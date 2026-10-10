import sanitizeHtml from "sanitize-html";

/**
 * Server-only. Blog content is HTML written in the admin editor; we still strip
 * everything except a small allow-list (no scripts, iframes, inline styles, event
 * handlers, data: URLs) before it ever reaches dangerouslySetInnerHTML.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "span", "div",
    "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td", "code", "pre", "font", "mark", "del", "ins",
  ],
  allowedAttributes: {
    "*": ["style", "class", "color"],
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    font: ["color", "size", "face"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
  },
  allowedStyles: {
    "*": {
      "color": [/^#(0-9a-f]{3,8})$/i, /^rgb\(/i, /^rgba\(/i, /^[a-z]+$/i],
      "background-color": [/^#(0-9a-f]{3,8})$/i, /^rgb\(/i, /^rgba\(/i, /^[a-z]+$/i],
      "font-size": [/^\d+(px|em|rem|%)$/i],
      "font-weight": [/^(bold|normal|\d{3})$/i],
      "text-align": [/^(left|center|right|justify)$/i],
      "text-decoration": [/^(underline|line-through|none)$/i],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  transformTags: {
    a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" } }),
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
  },
};

export const sanitizeContent = (html?: string) => sanitizeHtml(html || "", OPTIONS);
