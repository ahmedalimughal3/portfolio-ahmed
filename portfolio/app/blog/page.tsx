import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { BlogHeader } from "@/components/blog-header";
import { formatBlogDate, getBlogExcerpt, getPublishedBlogs } from "@/lib/blog";
import { siteUrl } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: "Blog — ideas on development, design, and technology",
  description:
    "Practical notes and ideas on web development, software engineering, design, and building digital products by Ahmed Ali Mughal.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Blog — Ahmed Ali Mughal",
    description: "Notes and ideas on development, design, and technology.",
    url: "/blog",
  },
};

async function BlogIndexContent() {
  await connection();
  const posts = await getPublishedBlogs();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ahmed's Blog",
    url: `${siteUrl}/blog`,
    description: "Notes and ideas on development, design, and technology.",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.createdAt,
      keywords: post.tags.join(", "),
    })),
  };

  return (
    <main className="blog-page">
      <BlogHeader />
      <section className="blog-index-hero">
        <span className="section-kicker">NOTES, IDEAS & THINGS I LEARN</span>
        <h1>Writing it<br /><span>as I learn.</span></h1>
        <p>Thoughts on building for the web, software, design, and the details that make digital products work.</p>
        <span className="blog-post-count">{String(posts.length).padStart(2, "0")} ARTICLES</span>
      </section>

      <section className="blog-list-section" aria-label="Published articles">
        {posts.length ? (
          <div className="blog-list">
            {posts.map((post, index) => (
              <article className="blog-list-card" key={post.slug}>
                <span className="blog-list-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="blog-list-content">
                  <div className="blog-list-meta">
                    <time dateTime={post.createdAt}>{formatBlogDate(post.createdAt)}</time>
                    <span>{Math.max(1, Math.ceil(post.description.trim().split(/\s+/).length / 220))} MIN READ</span>
                  </div>
                  <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p>{getBlogExcerpt(post.description)}</p>
                  <ul className="blog-tags" aria-label="Article tags">
                    {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                <Link className="blog-card-link" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <span aria-hidden="true">✳</span>
            <h2>The first post is on its way.</h2>
            <p>New articles will show up here as soon as they are published.</p>
          </div>
        )}
      </section>

      <footer className="blog-footer">
        <Link href="/">← Back to portfolio</Link>
        <span>WRITTEN WITH CURIOSITY · AHMED ALI MUGHAL</span>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}

export default function BlogIndexPage() {
  return (
    <Suspense fallback={<main className="blog-page" aria-busy="true">Loading articles…</main>}>
      <BlogIndexContent />
    </Suspense>
  );
}
