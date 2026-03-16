const OWNER_HANDLES = {
  twitter: "@EdehChinedu20",
  instagram: "@chinedu_edeh",
  facebook: "Edeh Chinedu Daniel",
} as const;

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://edehchinedu.com";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";

export function buildPostUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

export function buildTwitterShare(title: string, slug: string): string {
  const url = buildPostUrl(slug);
  const text = encodeURIComponent(
    `${title}\n\n${url}\n\nvia ${OWNER_HANDLES.twitter}`,
  );
  return `https://twitter.com/intent/tweet?text=${text}`;
}

export function buildFacebookShare(slug: string): string {
  const url = encodeURIComponent(buildPostUrl(slug));
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
}

export function buildFacebookCaption(title: string, slug: string): string {
  const url = buildPostUrl(slug);
  return `${title}\n\n${url}\n\nTag me: ${OWNER_HANDLES.facebook}`;
}

export function buildInstagramCaption(title: string, slug: string): string {
  const url = buildPostUrl(slug);
  return `${title}\n\n${url}\n\nTag me ${OWNER_HANDLES.instagram}`;
}

export function buildWhatsAppShare(title: string, slug: string): string {
  const url = buildPostUrl(slug);
  const text = encodeURIComponent(`${title}\n\n${url}`);
  if (WHATSAPP_NUMBER) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }
  return `https://wa.me/?text=${text}`;
}
