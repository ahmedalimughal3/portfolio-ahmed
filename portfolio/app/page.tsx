import { Suspense } from "react";
import { connection } from "next/server";
import { PortfolioPage } from "@/components/portfolio-page";
import { getPortfolioContent } from "@/lib/portfolio-content";

async function PortfolioContentPage() {
  await connection();
  const content = await getPortfolioContent();
  return <PortfolioPage content={content} />;
}

export default function Home() {
  return (
    <Suspense fallback={<main className="portfolio-loading" aria-busy="true">Loading portfolio…</main>}>
      <PortfolioContentPage />
    </Suspense>
  );
}
