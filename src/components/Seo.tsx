import { useEffect } from "react";

import {
  absoluteAssetUrl,
  canonicalUrl,
  seoDefaults,
  siteName,
  type SeoPageConfig,
} from "../content/seo";

type SeoProps = {
  page: SeoPageConfig;
};

const JSON_LD_ID = "alora-json-ld";
const PRELOAD_ATTR = "data-seo-preload";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, extras?: Record<string, string>) {
  const extraSelector = extras
    ? Object.entries(extras)
        .map(([name, value]) => `[${name}="${value}"]`)
        .join("")
    : "";
  const selector = `link[rel="${rel}"]${extraSelector}`;
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);

  if (extras) {
    for (const [name, value] of Object.entries(extras)) {
      element.setAttribute(name, value);
    }
  }
}

function setJsonLd(data: SeoPageConfig["jsonLd"]) {
  const existing = document.getElementById(JSON_LD_ID);
  existing?.remove();

  if (!data) {
    return;
  }

  const script = document.createElement("script");
  script.id = JSON_LD_ID;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

function setPreloadImage(href?: string) {
  document.head
    .querySelectorAll(`link[${PRELOAD_ATTR}="true"]`)
    .forEach((node) => node.remove());

  if (!href) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = href;
  link.setAttribute(PRELOAD_ATTR, "true");
  document.head.appendChild(link);
}

export default function Seo({ page }: SeoProps) {
  useEffect(() => {
    const image = absoluteAssetUrl(page.image || seoDefaults.defaultImage);
    const imageAlt = page.imageAlt || seoDefaults.defaultImageAlt;
    const robots = page.robots || seoDefaults.robots;
    const url = canonicalUrl(page.path);

    document.title = page.title;

    upsertMeta("name", "description", page.description);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "theme-color", seoDefaults.themeColor);

    upsertLink("canonical", url);

    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", siteName);
    upsertMeta("property", "og:locale", "en");
    upsertMeta("property", "og:image", image); 
    upsertMeta("property", "og:image:alt", imageAlt);

    upsertMeta("name", "twitter:card", seoDefaults.twitterCard);
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:image:alt", imageAlt);

    setJsonLd(page.jsonLd);
    setPreloadImage(page.preloadImage);
  }, [page]);

  return null;
}
