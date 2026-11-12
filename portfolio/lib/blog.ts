import "server-only";

import type { ContentRecord } from "@/lib/content-types";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

function parseBlogRecord(record: ContentRecord & { created_at: string }): BlogPost {
  const payload = record.payload;
  const description = payload.description;
  const tags = payload.tags;

  if (
    typeof description !== "string" ||
    !description.trim() ||
    !Array.isArray(tags) ||
    tags.length === 0 ||
    !tags.every((tag) => typeof tag === "string" && tag.trim())
  ) {
    throw new Error(`Published blog post "${record.slug}" has invalid content.`);
  }

  return {
    slug: record.slug,
    title: record.title,
    description,
    tags,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_content")
    .select("id, section, slug, title, payload, sort_order, published, updated_at, created_at")
    .eq("section", "blogs")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load published blog posts: ${error.message}`);
  }

  return ((data ?? []) as (ContentRecord & { created_at: string })[]).map(parseBlogRecord);
}

export async function getPublishedBlog(slug: string): Promise<BlogPost | undefined> {
  if (!isSupabaseConfigured()) return undefined;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_content")
    .select("id, section, slug, title, payload, sort_order, published, updated_at, created_at")
    .eq("section", "blogs")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load blog post: ${error.message}`);
  }

  return data
    ? parseBlogRecord(data as ContentRecord & { created_at: string })
    : undefined;
}

export function getBlogExcerpt(description: string, maxLength = 160) {
  const excerpt = description.replace(/\s+/g, " ").trim();
  if (excerpt.length <= maxLength) return excerpt;
  return `${excerpt.slice(0, maxLength - 1).trimEnd()}…`;
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}
