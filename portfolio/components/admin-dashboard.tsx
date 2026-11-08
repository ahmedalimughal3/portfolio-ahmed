"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  contentSections,
  type ContentField,
  type ContentPayload,
  type ContentRecord,
  type ContentSection,
} from "@/lib/content-types";
import { deleteContent, saveContent, type ContentActionState } from "@/app/admin/(protected)/actions";

const initialActionState: ContentActionState = {};

function fieldValue(payload: ContentPayload | undefined, field: ContentField) {
  const value = payload?.[field.key];
  return Array.isArray(value) ? value.join("\n") : value ?? "";
}

function ContentForm({
  section,
  record,
  sortOrder,
  onCancel,
}: {
  section: ContentSection;
  record?: ContentRecord;
  sortOrder: number;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(saveContent, initialActionState);
  const router = useRouter();
  const definition = contentSections.find((item) => item.id === section)!;

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <form action={formAction} className="admin-edit-form">
      <input name="section" type="hidden" value={section} />
      <input name="id" type="hidden" value={record?.id ?? ""} />
      <input name="sort_order" type="hidden" value={record?.sort_order ?? sortOrder} />
      <div className="admin-form-heading">
        <div>
          <span className="admin-eyebrow">{record ? "EDIT ITEM" : "NEW ITEM"}</span>
          <h2>{record ? `Edit ${record.title}` : `Add ${definition.label.toLowerCase()}`}</h2>
        </div>
        <button className="admin-icon-button" onClick={onCancel} type="button" aria-label="Close editor">×</button>
      </div>
      <div className="admin-fields-grid">
        {definition.fields.map((field) => (
          <label className={`admin-field${field.kind === "textarea" || field.kind === "list" ? " is-wide" : ""}`} key={field.key}>
            <span>{field.label}{field.required && <i> *</i>}</span>
            {field.kind === "select" ? (
              <select defaultValue={String(fieldValue(record?.payload, field) || field.options?.[0])} name={field.key} required={field.required}>
                {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : section === "experience" && field.key === "logo" ? (
              <>
                <input
                  autoComplete="off"
                  defaultValue={fieldValue(record?.payload, field)}
                  name={field.key}
                  placeholder="Existing public image path or URL"
                  type="text"
                />
                <input accept="image/png,image/jpeg,image/webp,image/gif" name="logo_upload" type="file" />
                <small className="admin-file-hint">Upload PNG, JPEG, WebP, or GIF (up to 5 MB). An uploaded image replaces this path.</small>
              </>
            ) : field.kind === "textarea" || field.kind === "list" ? (
              <textarea
                defaultValue={fieldValue(record?.payload, field)}
                name={field.key}
                placeholder={field.kind === "list" ? "One item per line" : ""}
                required={field.required}
                rows={field.kind === "list" ? 4 : 3}
              />
            ) : (
              <input
                autoComplete="off"
                defaultValue={fieldValue(record?.payload, field)}
                name={field.key}
                required={field.required}
                type={field.kind ?? "text"}
              />
            )}
          </label>
        ))}
      </div>
      <label className="admin-publish-toggle">
        <input defaultChecked={record?.published ?? true} name="published" type="checkbox" />
        <span><strong>Published</strong><small>Published items are visible on the public portfolio.</small></span>
      </label>
      {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
      {state.success && <p className="admin-form-success" role="status">{state.success}</p>}
      <div className="admin-form-actions">
        <button className="admin-secondary-button" onClick={onCancel} type="button">Cancel</button>
        <button className="admin-primary-button" disabled={isPending} type="submit">
          {isPending ? "Saving..." : "Save changes"} <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}

export function AdminDashboard({
  section,
  records,
}: {
  section: ContentSection;
  records: ContentRecord[];
}) {
  const [selectedRecordId, setSelectedRecordId] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);
  const definition = contentSections.find((item) => item.id === section)!;
  const selectedRecord = records.find((record) => record.id === selectedRecordId);
  const editorOpen = isCreating || selectedRecord !== undefined;

  function closeEditor() {
    setSelectedRecordId(undefined);
    setIsCreating(false);
  }

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-breadcrumb"><span>Workspace</span><i>/</i><strong>{definition.label}</strong></div>
        <Link className="admin-view-site" href="/" target="_blank">View website <span aria-hidden="true">↗</span></Link>
      </header>
      <section className="admin-content">
        <div className="admin-page-heading">
          <div>
            <span className="admin-eyebrow">PORTFOLIO MANAGEMENT</span>
            <h1>{definition.label}<span>.</span></h1>
            <p>{definition.description}</p>
          </div>
          {(section !== "contact" || records.length === 0) && (
            <button className="admin-primary-button" onClick={() => { setSelectedRecordId(undefined); setIsCreating(true); }} type="button">
              <span aria-hidden="true">＋</span> Add {section === "experience" ? "experience" : section.slice(0, -1)}
            </button>
          )}
        </div>

        <nav className="admin-section-tabs" aria-label="Content sections">
          {contentSections.map((item) => (
            <Link aria-current={item.id === section ? "page" : undefined} className={item.id === section ? "is-active" : ""} href={`/admin?section=${item.id}`} key={item.id}>
              {item.label}<span>{item.id === section ? records.length : ""}</span>
            </Link>
          ))}
        </nav>

        <div className={`admin-work-area${editorOpen ? " has-editor" : ""}`}>
          <div className="admin-record-list">
            {records.length === 0 ? (
              <div className="admin-empty-state">
                <span aria-hidden="true">✳</span>
                <h2>No {definition.label.toLowerCase()} yet</h2>
                <p>Add your first item here. You can keep it unpublished until it is ready.</p>
                <button className="admin-secondary-button" onClick={() => setIsCreating(true)} type="button">Add first item</button>
              </div>
            ) : records.map((record, index) => (
              <article className={`admin-record${selectedRecordId === record.id ? " is-selected" : ""}`} key={record.id}>
                <span className="admin-record-order">{String(index + 1).padStart(2, "0")}</span>
                <button className="admin-record-info" onClick={() => { setIsCreating(false); setSelectedRecordId(record.id); }} type="button">
                  <strong>{record.title}</strong>
                  <small>Updated {new Date(record.updated_at).toLocaleDateString()}</small>
                </button>
                <span className={`admin-publish-badge${record.published ? " is-published" : ""}`}>
                  <i />{record.published ? "Published" : "Draft"}
                </span>
                <form action={deleteContent} onSubmit={(event) => {
                  if (!window.confirm(`Delete "${record.title}"? This cannot be undone.`)) event.preventDefault();
                }}>
                  <input name="id" type="hidden" value={record.id} />
                  <button aria-label={`Delete ${record.title}`} className="admin-delete-button" title="Delete item" type="submit">×</button>
                </form>
              </article>
            ))}
          </div>
          {editorOpen && (
            <ContentForm
              key={selectedRecord?.id ?? `new-${section}`}
              onCancel={closeEditor}
              record={selectedRecord}
              section={section}
              sortOrder={records.length}
            />
          )}
        </div>
      </section>
    </>
  );
}
