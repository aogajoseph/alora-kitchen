import { site } from "./site";

const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");

export const SITE_URL = configuredSiteUrl || "https://alora-kitchen.vercel.app";

export const siteName = `${site.brand} ${site.descriptor}`
  .toLowerCase()
  .replace(/\b\w/g, (character) => character.toUpperCase());

export const seoDefaults = {
  siteName,
  locale: "en",
  twitterCard: "summary_large_image" as const,
  defaultImage: "/images/home/hero.png",
  defaultImageAlt:
    "A plated dish and a glass of wine on a wooden table at Alora Kitchen",
  themeColor: "#17170f",
  robots: "index, follow",
};

export type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export type SeoPageConfig = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  robots?: string;
  jsonLd?: JsonLd;
  preloadImage?: string;
};

export function canonicalUrl(path: string) {
  if (path === "/" || path === "") {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteAssetUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function parseClock(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);

  if (!match) {
    return value.trim();
  }

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toLowerCase();

  if (period === "am" && hours === 12) {
    hours = 0;
  }

  if (period === "pm" && hours !== 12) {
    hours += 12;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function openingHoursSpecification() {
  return site.hours.map(([label, range]) => {
    const [opensLabel, closesLabel] = range.split(/\s+[—–-]\s+/);
    const opens = parseClock(opensLabel);
    const closes = parseClock(closesLabel);

    const weekend = /weekend/i.test(label);

    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: weekend
        ? ["Saturday", "Sunday"]
        : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens,
      closes,
    };
  });
}

function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteName,
    url: canonicalUrl("/"),
    image: absoluteAssetUrl(seoDefaults.defaultImage),
    description: site.hero.body,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
    },
    openingHoursSpecification: openingHoursSpecification(),
    menu: canonicalUrl("/menu"),
    hasMenu: canonicalUrl("/menu"),
  };
}

function breadcrumbJsonLd(pageName: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: canonicalUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: canonicalUrl(path),
      },
    ],
  };
}

export const seoPages = {
  home: {
    title: "Alora Kitchen | Contemporary Dining Rooted in Tradition",
    description:
      "Alora Kitchen is a contemporary dining destination rooted in tradition, with seasonal ingredients, thoughtful cooking and memorable moments around the table.",
    path: "/",
    image: seoDefaults.defaultImage,
    imageAlt: seoDefaults.defaultImageAlt,
    preloadImage: "/images/home/hero.png",
    jsonLd: restaurantJsonLd(),
  },
  menu: {
    title: "Menu | Alora Kitchen",
    description:
      "Explore the Alora Kitchen menu, with thoughtfully prepared dishes built around quality ingredients, balanced flavours and the pleasure of dining well.",
    path: "/menu",
    image: "/images/menu/menu-hero.png",
    imageAlt: "The dining room and menu experience at Alora Kitchen",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Menu | Alora Kitchen",
        url: canonicalUrl("/menu"),
        description:
          "Explore the Alora Kitchen menu, with thoughtfully prepared dishes built around quality ingredients, balanced flavours and the pleasure of dining well.",
        isPartOf: {
          "@type": "WebSite",
          name: siteName,
          url: canonicalUrl("/"),
        },
      },
      breadcrumbJsonLd("Menu", "/menu"),
    ],
  },
  about: {
    title: "About Alora Kitchen | Our Story & Philosophy",
    description:
      "Discover the story, philosophy and values behind Alora Kitchen, a contemporary restaurant created for thoughtful food and gathering around the table.",
    path: "/about",
    image: "/images/home/slow-evenings.png",
    imageAlt: "An evening at Alora Kitchen",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Alora Kitchen | Our Story & Philosophy",
        url: canonicalUrl("/about"),
        description:
          "Discover the story, philosophy and values behind Alora Kitchen, a contemporary restaurant created for thoughtful food and gathering around the table.",
        isPartOf: {
          "@type": "WebSite",
          name: siteName,
          url: canonicalUrl("/"),
        },
      },
      breadcrumbJsonLd("About", "/about"),
    ],
  },
} satisfies Record<string, SeoPageConfig>;
