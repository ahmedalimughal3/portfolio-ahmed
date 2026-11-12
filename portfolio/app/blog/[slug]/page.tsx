import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { BlogHeader } from "@/components/blog-header";
import { formatBlogDate, getBlogExcerpt, getPublishedBlog } from "@/lib/blog";
import { siteUrl } from "@/lib/site-metadata";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlog(slug);
  if (!post) {
    return { title: "Post not found", robots: { index: false, follow: true } };
  }

  const description = getBlogExcerpt(post.description);
  return {
    title: post.title,
    description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description,
    },
  };
}

async function BlogPostContent({ params }: BlogPostPageProps) {
  await connection();
  const { slug } = await params;
  const post = await getPublishedBlog(slug);
  if (!post) notFound();

  const paragraphs = post.description.trim().split(/\n\s*\n/);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: getBlogExcerpt(post.description),
    articleBody: post.description,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(", "),
    author: {
      "@type": "Person",
      name: "Ahmed Ali Mughal",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Ahmed Ali Mughal",
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <main className="blog-page">
      <BlogHeader />
      <article className="blog-article">
        <Link className="blog-back-link" href="/blog">← All articles</Link>
        <header className="blog-article-heading">
          <span className="section-kicker">JOURNAL / ARTICLE</span>
          <h1>{post.title}</h1>
          <div className="blog-list-meta">
            <time dateTime={post.createdAt}>{formatBlogDate(post.createdAt)}</time>
            <span>{Math.max(1, Math.ceil(post.description.trim().split(/\s+/).length / 220))} MIN READ</span>
          </div>
          <ul className="blog-tags" aria-label="Article tags">
            {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </header>
        <div className="blog-article-body">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <footer className="blog-article-footer">
          <span>THANKS FOR READING</span>
          <Link href="/blog">More articles <span aria-hidden="true">↗</span></Link>
        </footer>
      </article>
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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<main className="blog-page" aria-busy="true">Loading article…</main>}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}
