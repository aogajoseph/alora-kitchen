import { useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { aboutPage } from "./content/about";
import ReservationModal from "./components/ReservationModal";

import "./styles.css";

export default function About() {
  const {
    hero,
    story,
    philosophy,
    experience,
    values,
    closing,
  } = aboutPage;

  const [reservationOpen, setReservationOpen] = useState(false);

  const openReservations = () => {
    setReservationOpen(true);
  };

  return (
    <main className="about-page">
      {/* Header */}
      <header className="about-header">
        <a
          className="brand"
          href="/"
          aria-label="Alora Kitchen home"
        >
          <img
            src="/images/logo-light.png"
            className="brand-logo"
            alt="Alora Kitchen"
          />
        </a>

        <a href="/" className="about-back">
          <ArrowLeft size={16} />
          Back to home
        </a>
      </header>

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__content">
          <p className="about-eyebrow">{hero.eyebrow}</p>

          <h1>
            {hero.title}
            <br />
            <em>{hero.emphasis}</em>
          </h1>

          <p>{hero.body}</p>
        </div>
      </section>

      {/* Story */}
      <section className="about-story">
        <div className="about-section-intro">
          <p className="about-eyebrow">{story.eyebrow}</p>

          <h2>
            {story.title}
            <br />
            <em>{story.emphasis}</em>
          </h2>
        </div>

        <div className="about-copy">
          {story.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="about-philosophy">
        <div className="about-philosophy__intro">
          <p className="about-eyebrow">{philosophy.eyebrow}</p>

          <h2>
            {philosophy.title}
            <br />
            <em>{philosophy.emphasis}</em>
          </h2>

          <p>{philosophy.body}</p>
        </div>

        <div className="about-philosophy__points">
          {philosophy.points.map((point) => (
            <article
              className="about-philosophy__point"
              key={point.number}
            >
              <span className="about-point-number">
                {point.number}
              </span>

              <div>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="about-experience">
        <div className="about-section-intro">
          <p className="about-eyebrow">{experience.eyebrow}</p>

          <h2>
            {experience.title}
            <br />
            <em>{experience.emphasis}</em>
          </h2>
        </div>

        <div className="about-copy">
          {experience.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values__header">
          <p className="about-eyebrow">{values.eyebrow}</p>

          <h2>
            {values.title}{" "}
            <em>{values.emphasis}</em>
          </h2>
        </div>

        <div className="about-values__grid">
          {values.items.map((item) => (
            <article className="about-value" key={item.number}>
              <span className="about-value__number">
                · {item.number}
              </span>

              <h3>{item.title}</h3>

              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="about-closing">
        <div className="about-closing__content">
          <p className="about-eyebrow">{closing.eyebrow}</p>

          <h2>
            {closing.title}
            <br />
            <em>{closing.emphasis}</em>
          </h2>

          <p>{closing.body}</p>

          <a
            onClick={openReservations}
            className="about-closing__cta"
          >
            {closing.cta}
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <a
          className="brand"
          href="/"
          aria-label="Alora Kitchen home"
        >
          <img
            src="/images/logo-light.png"
            className="footer-brand-logo"
            alt="Alora Kitchen"
          />
        </a>

        <p>Contemporary dining rooted in tradition.</p>
      </footer>

      <ReservationModal
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </main>
  );
}