import type { Project } from "@/lib/portfolio";
import { Icon } from "@/components/icon";

function ProductPreview({ project }: { project: Project }) {
  return (
    <div className={`project-preview project-preview--${project.visual}`}>
      <div className="preview-window">
        <div className="preview-topbar">
          <span className="preview-dots"><i /><i /><i /></span>
          <span>{project.name.toLowerCase()}.app</span>
          <span className="preview-topbar-mark">↗</span>
        </div>
        {project.visual === "orbit" && (
          <div className="orbit-dashboard">
            <div className="preview-sidebar"><b>o.</b><i /><i /><i /></div>
            <div className="orbit-content">
              <span className="preview-kicker">GOOD AFTERNOON, ALEX</span>
              <strong>What’s on your mind?</strong>
              <div className="orbit-input">Ask anything to get started <span>↗</span></div>
              <div className="orbit-chips"><i /><i /><i /></div>
            </div>
          </div>
        )}
        {project.visual === "flow" && (
          <div className="flow-dashboard">
            <aside><b>F.</b><i /><i /><i /><i /></aside>
            <div>
              <span className="preview-kicker">MONDAY, 12 MAY</span>
              <strong>Good morning, Alex</strong>
              <div className="flow-columns">
                <i><b /><span /><span /></i>
                <i><b /><span /><span /></i>
                <i><b /><span /></i>
              </div>
            </div>
          </div>
        )}
        {project.visual === "pulse" && (
          <div className="pulse-dashboard">
            <div className="pulse-heading"><span className="preview-kicker">TOTAL BALANCE</span><strong>$12,480<span>.50</span></strong></div>
            <div className="pulse-chart">
              <svg viewBox="0 0 280 88" role="img" aria-label="Illustrative rising balance chart">
                <path d="M2 68 C28 62 34 48 57 53 S91 67 114 42 151 52 174 31 204 45 226 18 250 26 278 5" />
                <path className="chart-fill" d="M2 68 C28 62 34 48 57 53 S91 67 114 42 151 52 174 31 204 45 226 18 250 26 278 5 L278 88 L2 88Z" />
              </svg>
            </div>
            <div className="pulse-bottom"><i /><span>Monthly overview</span><b>+12.8%</b></div>
          </div>
        )}
      </div>
      <span className="preview-decoration" aria-hidden="true">✳</span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card project-card--${project.theme}`}>
      <div className="project-card-top">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
      <ProductPreview project={project} />
      <div className="project-card-content">
        <div className="project-title-row">
          <h3>{project.name}</h3>
          <span className="project-arrow" aria-hidden="true"><Icon name="arrow" /></span>
        </div>
        <p>{project.description}</p>
        <ul className="project-tags" aria-label="Project skills">
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  );
}
