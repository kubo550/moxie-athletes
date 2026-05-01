import { useEffect } from 'react';

type PageMeta = {
  title: string;
  description?: string;
  noindex?: boolean;
};

const setMetaTag = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setOgTag = (property: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export const usePageMeta = ({ title, description, noindex }: PageMeta) => {
  useEffect(() => {
    document.title = title;
    setOgTag('og:title', title);
    if (description) {
      setMetaTag('description', description);
      setOgTag('og:description', description);
    }
    setMetaTag(
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large'
    );
    setOgTag('og:url', window.location.href);
    setCanonical(window.location.origin + window.location.pathname);
  }, [title, description, noindex]);
};
