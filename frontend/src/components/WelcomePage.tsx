import moonArtwork from "../../assets/figma-welcome-moon.png";
import akariArtwork from "../../assets/figma-welcome-akari.png";

export type WorkshopView = "home" | "focus";

type NavigationProps = {
  view: WorkshopView;
  onNavigate: (view: WorkshopView) => void;
};

const navigation = [
  { icon: "⌂", label: "Início", view: "home" },
  { icon: "◈", label: "Meu foco", view: "focus" },
  { icon: "▦", label: "Projetos" },
  { icon: "✦", label: "Estudos" },
  { icon: "▤", label: "Caderno" },
] as const;

export function WorkshopNavigation({ view, onNavigate }: NavigationProps) {
  return (
    <aside className="workshop-sidebar" aria-label="Menu principal">
      <p className="workshop-menu-label">MENU</p>
      <nav className="workshop-navigation" aria-label="Seu espaço">
        {navigation.map((item) => {
          const destination = "view" in item ? item.view : undefined;
          return (
            <button
              type="button"
              key={item.label}
              className={`workshop-nav-item${destination === view ? " is-active" : ""}`}
              aria-current={destination === view ? "page" : undefined}
              disabled={!destination}
              title={!destination ? `${item.label} — em breve` : undefined}
              onClick={() => destination && onNavigate(destination)}
            >
              <span className="workshop-nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <section className="workshop-corner" aria-label="Seu cantinho">
        <p className="workshop-corner-label">SEU CANTINHO</p>
        <h2 lang="ja">あかりと日本語</h2>
        <p className="workshop-practice">Prática de japonês</p>
      </section>
      <div className="workshop-profile">
        <span className="workshop-avatar" lang="ja" aria-hidden="true">燈</span>
        <div>
          <p className="workshop-profile-title">Seu espaço</p>
          <p className="workshop-profile-description">Pronto para começar</p>
        </div>
      </div>
    </aside>
  );
}

export function WorkshopHeader({ onHome }: { onHome: () => void }) {
  return (
    <header className="workshop-header">
      <a className="brand workshop-brand" href="#home" onClick={(event) => {
        event.preventDefault();
        onHome();
      }}>忍びHUB</a>
      <p className="workshop-wordmark">AKARI&apos;S WORKSHOP</p>
    </header>
  );
}

export function WelcomeScene() {
  return (
    <>
      <div className="welcome-illustration" aria-hidden="true">
        <img className="welcome-moon" src={String(moonArtwork)} alt="" />
        <div className="welcome-akari-frame">
          <img className="welcome-akari" src={String(akariArtwork)} alt="" />
        </div>
      </div>
      <h1 className="welcome-title" lang="ja">ようこそ</h1>
    </>
  );
}
