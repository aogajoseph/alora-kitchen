import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  Clock3,
  Instagram,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { site } from "./content/site";
import "./styles.css";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Alora Kitchen home">
          <span className="brand-mark">✦</span>
          <span>
            <strong>{site.brand}</strong>
            <small>{site.descriptor}</small>
          </span>
        </a>

        <nav className={`nav ${mobileOpen ? "nav--open" : ""}`}>
          {site.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta" href="#reservations" onClick={closeMenu}>
            Reserve a table
          </a>
        </nav>

        <button
          className="menu-toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={21} /> : <MenuIcon size={21} />}
        </button>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">{site.hero.eyebrow}</p>

            <h1>{site.hero.title}</h1>

            <p className="hero-body">{site.hero.body}</p>

            <div className="button-row">
              <a className="button button--primary" href="#reservations">
                {site.hero.primaryCta}
                <ArrowRight size={17} />
              </a>

              <a className="button button--ghost" href="#menu">
                {site.hero.secondaryCta}
              </a>
            </div>

            <div className="hero-meta">
              <div>
                <span>12</span>
                <small>Seasons celebrated</small>
              </div>

              <div>
                <span>4.9</span>
                <small>Guest experience</small>
              </div>

              <div>
                <span>100%</span>
                <small>Made with care</small>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="intro section">
          <div className="section-kicker">
            <span>01</span>
            <span>Our philosophy</span>
          </div>
          <div className="intro-grid">
            <h2>Where taste meets <em>experience.</em></h2>
            <div>
              <p>
                Alora Kitchen is a modern restaurant celebrating seasonal
                ingredients, thoughtful preparation and the joy of gathering
                around the table.
              </p>
              <a className="text-link" href="#menu">
                Discover our story <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="highlights">
          <div className="highlights-grid">
            {site.highlights.map((item, index) => (
              <article className="highlight" key={item.title}>
                <span className="highlight-number">0{index + 1}</span>
                <div className="icon-circle">
                  {index === 0 && <Sparkles size={18} />}
                  {index === 1 && <ChefHat size={18} />}
                  {index === 2 && <Utensils size={18} />}
                  {index === 3 && <CalendarDays size={18} />}
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="menu" className="menu-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 · From the kitchen</p>
              <h2>Chef's <em>recommendations.</em></h2>
            </div>
            <a className="text-link" href="#reservations">
              View full menu <ArrowRight size={16} />
            </a>
          </div>

          <div className="menu-grid">
            {site.menu.map((item, index) => (
              <article className="menu-card" key={item.name}>
                <div className={`dish-art dish-art--${index + 1}`}>
                  <div className="dish-plate">
                    <div className="dish-center" />
                    <div className="dish-garnish garnish-a" />
                    <div className="dish-garnish garnish-b" />
                    <div className="dish-garnish garnish-c" />
                  </div>
                  <span className="dish-tag">{item.tag}</span>
                </div>
                <div className="menu-card-copy">
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <strong>{item.price}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="reservations" className="reservation section">
          <div className="reservation-card">
            <div>
              <p className="eyebrow">03 · Reservations</p>
              <h2>Make a moment <em>of it.</em></h2>
              <p>
                Join us for dinner, a special celebration or an evening that
                deserves a beautiful table.
              </p>
            </div>
            <a className="button button--light" href="mailto:hello@alorakitchen.com?subject=Table reservation">
              Request a table <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <section id="private-dining" className="split-section section">
          <div className="split-image">
            <div className="arch-window">
              <div className="arch-table">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          <div className="split-copy">
            <p className="eyebrow">Private dining</p>
            <h2>Gather beautifully.</h2>
            <p>
              From intimate dinners to brand events and milestone celebrations,
              our private dining experience is designed around your occasion.
            </p>
            <a className="text-link" href="mailto:hello@alorakitchen.com?subject=Private dining enquiry">
              Enquire about private dining <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <section id="gallery" className="gallery section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 · The Alora mood</p>
              <h2>A table worth <em>remembering.</em></h2>
            </div>
          </div>
          <div className="gallery-grid">
            <div className="gallery-tile gallery-tile--large">
              <span>Slow evenings</span>
            </div>
            <div className="gallery-tile gallery-tile--warm">
              <span>Good company</span>
            </div>
            <div className="gallery-tile gallery-tile--dark">
              <span>Fine details</span>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-mark">✦</span>
            <div>
              <strong>{site.brand}</strong>
              <small>{site.descriptor}</small>
            </div>
            <p>{site.tagline}</p>
          </div>

          <div className="footer-column">
            <h3>Visit</h3>
            <p><MapPin size={15} /> {site.contact.address}</p>
            <p><Clock3 size={15} /> Mon — Sun · 12pm — late</p>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <a href={`mailto:${site.contact.email}`}><Mail size={15} /> {site.contact.email}</a>
            <a href={`tel:${site.contact.phone}`}><CalendarDays size={15} /> {site.contact.phone}</a>
          </div>

          <div className="footer-column">
            <h3>Follow</h3>
            <a href="#instagram"><Instagram size={15} /> Instagram</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Alora Kitchen. All rights reserved.</span>
          <span>Crafted for memorable moments.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);