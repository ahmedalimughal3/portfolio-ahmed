"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import {
  getContentSection,
  type ContentPayload,
  type ContentSection,
} from "@/lib/content-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContentActionState = { error?: string; success?: string };

const imageExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function getLogoUpload(formData: FormData) {
  const value = formData.get("logo_upload");
  if (!(value instanceof File) || value.size === 0) return undefined;
  if (!imageExtensions[value.type]) {
    throw new Error("Upload a PNG, JPEG, WebP, or GIF image.");
  }
  if (value.size > 5 * 1024 * 1024) {
    throw new Error("Logo images must be 5 MB or smaller.");
  }
  const signature = new Uint8Array(await value.slice(0, 12).arrayBuffer());
  const matchesType = value.type === "image/png"
    ? [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => signature[index] === byte)
    : value.type === "image/jpeg"
      ? signature[0] === 255 && signature[1] === 216 && signature[2] === 255
      : value.type === "image/gif"
        ? String.fromCharCode(...signature.slice(0, 6)) === "GIF87a" ||
          String.fromCharCode(...signature.slice(0, 6)) === "GIF89a"
        : String.fromCharCode(...signature.slice(0, 4)) === "RIFF" &&
          String.fromCharCode(...signature.slice(8, 12)) === "WEBP";
  if (!matchesType) {
    throw new Error("The uploaded file does not match its image type.");
  }
  return { file: value, extension: imageExtensions[value.type] };
}

function makeSlug(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  if (!slug) throw new Error("Please provide a title that can be used as a URL-safe slug.");
  return slug;
}

function getPayload(
  section: ContentSection,
  formData: FormData,
  hasLogoUpload: boolean,
): ContentPayload {
  const definition = getContentSection(section);
  if (!definition) throw new Error("Unknown content section.");

  const payload: ContentPayload = {};
  for (const field of definition.fields) {
    const raw = String(formData.get(field.key) ?? "").trim();
    const value = field.kind === "list"
      ? raw.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
      : raw;

    if (
      field.required &&
      !(section === "experience" && field.key === "logo" && hasLogoUpload) &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      throw new Error(`${field.label} is required.`);
    }
    const maxLength = field.maxLength ?? 3000;
    if (typeof value === "string" && value.length > maxLength) {
      throw new Error(`${field.label} must be ${maxLength.toLocaleString()} characters or fewer.`);
    }
    if (Array.isArray(value) && (value.length > 30 || value.some((item) => item.length > 180))) {
      throw new Error(`${field.label} must contain at most 30 items, each under 180 characters.`);
    }
    if (field.options && (typeof value !== "string" || !field.options.includes(value))) {
      throw new Error(`Choose a valid option for ${field.label.toLowerCase()}.`);
    }
    if (field.kind === "email" && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error("Enter a valid contact email address.");
    }
    if (field.kind === "url" && typeof value === "string") {
      try {
        const url = new URL(value);
        if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
      } catch {
        throw new Error(`${field.label} must be a valid http or https URL.`);
      }
    }

    payload[field.key] = value;
  }
  return payload;
}

export async function saveContent(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  await requireAdmin();

  try {
    const sectionValue = String(formData.get("section") ?? "");
    const definition = getContentSection(sectionValue);
    if (!definition) throw new Error("Unknown content section.");
    const section = definition.id;
    const logoUpload = await getLogoUpload(formData);
    if (logoUpload && section !== "experience") {
      throw new Error("Logo uploads are only available for experience entries.");
    }
    const payload = getPayload(section, formData, Boolean(logoUpload));
    const titleField = section === "projects"
      ? "name"
      : section === "experience"
        ? "company"
        : section === "site"
          ? "heroTitle"
          : section === "contact"
            ? ""
            : "title";
    const title = section === "contact"
      ? "Contact details"
      : section === "site"
        ? "Home and about"
        : String(payload[titleField] ?? "");
    const slug = section === "contact" || section === "site" ? "primary" : makeSlug(title);
    const sortOrder = Number(formData.get("sort_order") ?? 0);
    if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 10000) {
      throw new Error("Display order must be a whole number between 0 and 10,000.");
    }

    const supabase = await createSupabaseServerClient();
    let uploadedLogoPath: string | undefined;
    if (logoUpload) {
      uploadedLogoPath = `experience/${crypto.randomUUID()}.${logoUpload.extension}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio-media")
        .upload(uploadedLogoPath, logoUpload.file, {
          cacheControl: "31536000",
          contentType: logoUpload.file.type,
          upsert: false,
        });
      if (uploadError) {
        return { error: `Could not upload this logo: ${uploadError.message}` };
      }
      payload.logo = supabase.storage
        .from("portfolio-media")
        .getPublicUrl(uploadedLogoPath).data.publicUrl;
    }

    const id = String(formData.get("id") ?? "");
    const record = {
      section,
      slug,
      title,
      payload,
      sort_order: sortOrder,
      published: formData.get("published") === "on",
      updated_at: new Date().toISOString(),
    };
    const result = id
      ? await supabase.from("portfolio_content").update(record).eq("id", id).eq("section", section).select("id").single()
      : await supabase.from("portfolio_content").insert(record).select("id").single();

    if (result.error) {
      if (uploadedLogoPath) {
        const { error: cleanupError } = await supabase.storage
          .from("portfolio-media")
          .remove([uploadedLogoPath]);
        if (cleanupError) {
          return {
            error: `Could not save this item (${result.error.message}) or remove the uploaded logo (${cleanupError.message}).`,
          };
        }
      }
      if (result.error.code === "23505") {
        return { error: "An item with this title already exists in this section." };
      }
      return { error: `Could not save this item: ${result.error.message}` };
    }
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: "Changes saved." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save this item." };
  }
}

export async function deleteContent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Invalid content item id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("portfolio_content").delete().eq("id", id);
  if (error) throw new Error(`Could not delete this item: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/admin");
}
