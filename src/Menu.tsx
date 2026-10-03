import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight, Menu as MenuIcon, Clock3, ShoppingBag, X } from "lucide-react";

import { menuCategories, type MenuItem } from "./content/menu";

import ReservationModal from "./components/ReservationModal";
import OrderNowModal from "./components/OrderNowModal";

import "./styles.css";

export default function Menu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.id);
  const [reservationOpen, setReservationOpen] = useState(false);

  const openOrder = (item: MenuItem) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const sections = menuCategories
      .map((category) => document.getElementById(category.id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          )[0];

        if (visibleSection) {
          setActiveCategory(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const openReservations = () => {
    setMobileOpen(false);
    setReservationOpen(true);
  };

  return (
    <main className="menu-page">
      {/* Header */}
      <header className="menu-header">
        <a className="brand" href="/">
          <img
            src="/images/logo.png"
            className="brand-logo"
            alt="Alora Kitchen"
          />
        </a>

        <a href="/" className="menu-back">
          <ArrowLeft size={16} />
          Back to home
        </a>
      </header>

      {/* Hero */}
      <section className="menu-hero">
        <div className="menu-hero__content">
          <p className="menu-eyebrow">
            ALORA KITCHEN · FULL MENU
          </p>

          <h1>
            Savor the Finest,
            <br />
            <em>Celebrate Always.</em>
          </h1>

          <p>
            Seasonal ingredients, beautifully crafted dishes & memorable moments.
          </p>
        </div>
      </section>

      {/* Category navigation */}
      <nav
        className="menu-category-nav"
        aria-label="Menu categories"
      >
        <div className="menu-category-nav__inner">
          {menuCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className={`menu-category-link ${
                activeCategory === category.id
                  ? "is-active"
                  : ""
              }`}
            >
              {category.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Menu */}
      <div className="menu-content">
        {menuCategories.map((category, categoryIndex) => (
          <section
            key={category.id}
            id={category.id}
            className="menu-category"
          >
            <div className="menu-category__intro">
              <div>
                <span className="menu-category__number">
                  {String(categoryIndex + 1).padStart(2, "0")}
                </span>

                <h2>{category.label}</h2>
              </div>

              <p>{category.description}</p>
            </div>

            <div className="menu-items">
              {category.items.map((item) => (
                <article
                  className="menu-item"
                  key={item.name}
                >
                  <div className="menu-item__image-wrap">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="menu-item__image"
                        loading={
                          categoryIndex === 0
                            ? "eager"
                            : "lazy"
                        }
                      />
                    ) : (
                      <div
                        className="menu-item__image menu-item__image--placeholder"
                        aria-hidden="true"
                      />
                    )}

                    {item.tag && (
                      <span className="menu-item__tag">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <div className="menu-item__details">
                    <div className="menu-item__top">
                      <div>
                        <span className="menu-item__category">
                          {category.label}
                        </span>

                        <h3>{item.name}</h3>
                      </div>

                      <strong className="menu-item__price">
                        {item.price}
                      </strong>
                    </div>

                    <p className="menu-item__description">
                      {item.description}
                    </p>

                    <button
                      type="button"
                      className="menu-item__order"
                      onClick={() => openOrder(item)}
                    >
                      <ShoppingBag size={15} />
                      Order now
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Closing */}
      <section className="menu-closing">
        <Clock3 size={18} />

        <p className="menu-eyebrow">ALORA KITCHEN</p>

        <h2>
          Contemporary dining,
          <br />
          <em>Rooted in tradition.</em>
        </h2>

        <p>
          Order your favourites online or request a table to join us.
        </p>

        <button 
          type="button"
          className="menu-closing__cta" 
          onClick={openReservations}
        >
          Reserve a table
          <ArrowRight size={16} />
        </button>

        <button
          className="menu-toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={21} /> : <MenuIcon size={21} />}
        </button>
      </section>

      {/* Footer */}
      <footer className="menu-footer">
        <div>
          <a className="brand" href="/">
            <img
              src="/images/logo.png"
              className="brand-logo"
              alt="Alora Kitchen"
            />
          </a>

          <p>Savor the finest. Celebrate always.</p>
        </div>
      </footer>

      <OrderNowModal
        item={selectedItem}
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />

      <ReservationModal
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </main>
  );
}