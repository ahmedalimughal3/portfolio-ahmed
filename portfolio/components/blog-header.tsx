import Link from "next/link";

export function BlogHeader() {
  return (
    <header className="blog-header">
      <Link className="blog-brand" href="/" aria-label="Ahmed, home">
        <span className="blog-brand-mark">A</span>
        <span>AHMED<span>.</span></span>
      </Link>
      <nav aria-label="Blog navigation">
        <Link href="/">Portfolio</Link>
        <Link className="blog-header-current" href="/blog" aria-current="page">Journal</Link>
      </nav>
    </header>
  );
}
