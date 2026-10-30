import { useRef } from "react";
import { LaserFlow } from "../components/react-bits/LaserFlow.web";
import "../components/about.css";

export default function AboutWeb() {
  const surfaceRef = useRef<HTMLElement | null>(null);

  return (
    <main className="about-page">
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
