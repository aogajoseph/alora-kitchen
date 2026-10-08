import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  Clock3,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { type MenuItem } from "./content/menu";
import { site } from "./content/site";
import "./styles.css";

import ReservationModal from "./components/ReservationModal";
import PrivateDiningModal from "./components/PrivateDiningModal";
import OrderNowModal from "./components/OrderNowModal";
import Seo from "./components/Seo";

import Menu from "./Menu";
import About from "./About";

type CartItem = MenuItem & {
  quantity: number;
};

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [privateDiningOpen, setPrivateDiningOpen] = useState(false);
  const [orderCart, setOrderCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => setMobileOpen(false);

  const highlightIcons = {
    sparkles: <Sparkles size={18} />,
    chef: <ChefHat size={18} />,
    utensils: <Utensils size={18} />,
    calendar: <CalendarDays size={18} />,
  };

  const socialIcons = {
    instagram: <FaInstagram size={15} />,
    tiktok: <FaTiktok size={15} />,
    facebook: <FaFacebook size={15} />,
  };

  const openReservations = () => {
    setMobileOpen(false);
    setReservationOpen(true);
  };

  const openPrivateDining = () => {
    setMobileOpen(false);
    setPrivateDiningOpen(true);
  };

  const openOrderNow = (item: MenuItem) => {
    setOrderCart([
      {
        ...item,
        quantity: 1,
      },
    ]);
  };

  const addToOrder = (item: MenuItem) => {
    setOrderCart((current) => {
      const existing = current.find(
        (cartItem) => cartItem.name === item.name
      );
  
      if (existing) {
        return current.map((cartItem) =>
          cartItem.name === item.name
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }
  
      return [
        ...current,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };
  
  const updateOrderQuantity = (
    itemName: string,
    quantity: number
  ) => {
    setOrderCart((current) =>
      current.map((item) =>
        item.name === itemName
          ? {
              ...item,
              quantity: Math.max(1, quantity),
            }
          : item
      )
    );
  };
  
  const removeFromOrder = (itemName: string) => {
    setOrderCart((current) =>
      current.filter((item) => item.name !== itemName)
    );
  };

  const closeOrder = () => {
    setOrderCart([]);
  };

  return (
    <div className="site-shell">
      <Seo
        page={{
          title: `${site.brand} | ${site.descriptor}`,
          description: site.tagline,
          path: "/",
        }}
      />
      <header
        className={`site-header ${
          headerScrolled ? "site-header--scrolled" : ""
        }`}
      >
        <a
          className="brand"
          href="#home"
          onClick={closeMenu}
          aria-label={`${site.brand} ${site.descriptor} home`}
        >
          <img
            src="/images/logo-dark.png"
            alt={`${site.brand} ${site.descriptor}`}
            className="brand-logo"
          />
        </a>

        <nav 
          id="site-navigation"
          className={`nav ${mobileOpen ? "nav--open" : ""}`}
        >
          {site.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}

          <a
            className="nav-cta"
            onClick={openReservations}
          >
            Reserve a table
          </a>
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="site-navigation"
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

              <a
                className="button button--primary"
                onClick={openReservations}
              >
                {site.hero.primaryCta}
                <ArrowRight size={17} />
              </a>

              <a
                className="button button--ghost"
                href="#menu"
              >
                {site.hero.secondaryCta}
              </a>
            </div>

            <div className="hero-meta">
              {site.hero.stats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.value}</span>
                  <small>{stat.label}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="intro section">
          <div className="section-kicker">
            <span>{site.about.sectionNumber}</span>
            <span>{site.about.eyebrow}</span>
          </div>

          <div className="intro-grid">
            <h2>
              {site.about.title}{" "}
              <em>{site.about.emphasis}</em>
            </h2>

            <div>
              <p>{site.about.body}</p>

              <a
                className="text-link"
                href={site.about.href}
              >
                {site.about.cta}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="highlights">
          <div className="highlights-grid">
            {site.highlights.map((item, index) => (
              <article
                className="highlight"
                key={item.title}
              >
                <span className="highlight-number">
                  · 0{index + 1}
                </span>

                <div className="icon-circle">
                  {
                    highlightIcons[
                      item.icon as keyof typeof highlightIcons
                    ]
                  }
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
              <p className="eyebrow">
                {site.menuSection.eyebrow}
              </p>

              <h2>
                {site.menuSection.title}{" "}
                <em>{site.menuSection.emphasis}</em>
              </h2>
            </div>

            <a
              className="text-link"
              href={site.menuSection.href}
            >
              {site.menuSection.cta}
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="menu-grid">
            {site.menu.map((item, index) => (
              <article
                className="menu-card"
                key={item.name}
              >
                <div
                  className={`dish-art dish-art--${index + 1}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="dish-image"
                  />
              
                  <span className="dish-tag">
                    {item.tag}
                  </span>
                </div>
              
                <div className="menu-card-copy">
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <strong>{item.price}</strong>
              
                  <a
                    className="text-link"
                    onClick={() => openOrderNow(item)}
                  >
                    Order now
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="reservations"
          className="reservation section"
        >
          <div className="reservation-card">
            <div>
              <p className="eyebrow reservations-label">
                {site.reservations.eyebrow}
              </p>

              <h2>
                {site.reservations.title}{" "}
                <em className="reservations-emphasis">
                  {site.reservations.emphasis}
                </em>
              </h2>

              <p>{site.reservations.body}</p>
            </div>

            <a
              className="button button--light"
              onClick={openReservations}
            >
              {site.reservations.cta}
              <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <section
          id="private-dining"
          className="split-section section"
        >
          <div className="split-image">
            <img
              src={site.privateDining.image}
              alt={site.privateDining.imageAlt}
              className="private-dining-image"
            />
          </div>

          <div className="split-copy">
            <p className="eyebrow">
              {site.privateDining.eyebrow}
            </p>

            <h2>{site.privateDining.title}</h2>

            <p>{site.privateDining.body}</p>

            <a
              className="text-link private-dining-cta"
              onClick={openPrivateDining}
            >
              {site.privateDining.cta}
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <section id="gallery" className="gallery section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {site.gallery.eyebrow}
              </p>

              <h2>
                {site.gallery.title}{" "}
                <em>{site.gallery.emphasis}</em>
              </h2>
            </div>
          </div>

          <div className="gallery-grid">
            {site.gallery.items.map((item) => (
              <div
                className={`gallery-tile ${item.className}`}
                key={item.title}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                />

                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <a
              href="#home"
              aria-label={`${site.brand} ${site.descriptor} home`}
            >
              <img
                src="/images/logo-light.png"
                alt={`${site.brand} ${site.descriptor}`}
                className="footer-brand-logo"
              />
            </a>

            <p>{site.tagline}</p>
          </div>

          <div className="footer-column">
            <h3>Visit Us</h3>

            <p>
              <MapPin size={15} />
              {site.contact.address}
            </p>

            {site.hours.map(([days, hours]) => (
              <p key={days}>
                <Clock3 size={15} />
                {days} · {hours}
              </p>
            ))}
          </div>

          <div className="footer-column">
            <h3>Connect</h3>

            {site.social.map((social) => (
              <a key={social.label} href={social.href}>
                {
                  socialIcons[
                    social.icon as keyof typeof socialIcons
                  ]
                }
                {social.label}
              </a>
            ))}
          </div>

          <div className="footer-column">
            <h3>Contact Us</h3>

            <a href={`mailto:${site.contact.email}`}>
              <Mail size={15} />
              {site.contact.email}
            </a>

            <a href={`tel:${site.contact.phone}`}>
              <CalendarDays size={15} />
              {site.contact.phone}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.brand}{" "}
            {site.descriptor}. {site.footer.copyright}
          </span>

          <span>{site.footer.statement}</span>
        </div>
      </footer>

      <ReservationModal
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />

      <PrivateDiningModal
        open={privateDiningOpen}
        onClose={() => setPrivateDiningOpen(false)}
      />

      <OrderNowModal
        cart={orderCart}
        open={orderCart.length > 0}
        onClose={closeOrder}
        onAddItem={addToOrder}
        onUpdateQuantity={updateOrderQuantity}
        onRemoveItem={removeFromOrder}
      />
    </div>
  );
}

export default App;

const pathname = window.location.pathname;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {pathname === "/menu" ? (
      <Menu />
    ) : pathname === "/about" ? (
      <About />
    ) : (
      <App />
    )}
  </StrictMode>
);