import DOMPurify from "isomorphic-dompurify";

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "p",
      "br",
      "b",
      "i",
      "em",
      "strong",
      "pre",
      "code",
      "span",
      "ul",
      "ol",
      "li",
      "a",
    ],
    ALLOWED_ATTR: ["src", "alt", "width", "height", "loading", "class"],
    // svgを除外し、主要な静止画フォーマットのみに限定
    ALLOWED_URI_REGEXP: /^(https?:|data:image\/(?:png|jpe?g|gif|webp);base64,)/i,
  });
};
