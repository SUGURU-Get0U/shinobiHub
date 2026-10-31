import { useRef } from "react";
import { Link } from "expo-router";
import CardNav from "../components/react-bits/CardNav.web";
import { LaserFlow } from "../components/react-bits/LaserFlow.web";
import "../components/about.css";

export default function AboutWeb() {
  const surfaceRef = useRef<HTMLElement | null>(null);

  return (
    <main className="about-page">
      <header className="about-navigation">
        <CardNav
          logo={<span>Shinobi HUB</span>}
          logoAlt="Shinobi HUB Home"
          logoHref="/"
          items={[{ label: "Navigation", links: [{ label: "Home", href: "/" }] }]}
          linkComponent={Link}
          theme="dark"
          surface="glass"
          maxWidth={800}
          ariaLabel="Main navigation"
        />
      </header>
      <div className="about-background" aria-hidden="true">
        <LaserFlow
          surfaceRef={surfaceRef}
          color="#a855f7"
          beamPosition={0.5}
          intensity={1.5}
          dpr={1.5}
        />
      </div>
      <section className="website_info">
        <div>
          
        </div>
      </section>
    </main>
  );
}
