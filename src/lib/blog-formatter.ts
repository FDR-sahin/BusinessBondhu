/**
 * Utility to parse WhatsApp-style shortcuts, Markdown formatting, and custom text colors into HTML.
 */

export function parseRichBlogText(content?: string, excerpt?: string): string {
  const text = content && content.trim() ? content : excerpt || "";
  if (!text) return "";

  // If already contains block HTML tags like <p>, <h2>, <ul>, return as is (after minor enhancements)
  if (/^\s*<[a-z][\s\S]*>/i.test(text.trim())) {
    return text;
  }

  // Split into paragraphs by double linebreaks
  const paragraphs = text.trim().split(/\n\s*\n/);

  const formattedBlocks = paragraphs.map((block) => {
    let b = block.trim();
    if (!b) return "";

    // 1. Headings (# H1, ## H2, ### H3)
    if (/^###\s+(.+)$/m.test(b)) {
      const heading = b.replace(/^###\s+/, "");
      return `<h3 class="text-xl font-bold text-ink mt-6 mb-3 border-l-4 border-green pl-3">${parseInlineFormatting(heading)}</h3>`;
    }
    if (/^##\s+(.+)$/m.test(b)) {
      const heading = b.replace(/^##\s+/, "");
      return `<h2 class="text-2xl font-extrabold text-ink mt-8 mb-4">${parseInlineFormatting(heading)}</h2>`;
    }
    if (/^#\s+(.+)$/m.test(b)) {
      const heading = b.replace(/^#\s+/, "");
      return `<h2 class="text-3xl font-extrabold text-ink mt-8 mb-4">${parseInlineFormatting(heading)}</h2>`;
    }

    // 2. Blockquotes (> Quote)
    if (b.startsWith(">")) {
      const quoteText = b.split("\n").map(l => l.replace(/^>\s*/, "")).join(" ");
      return `<blockquote class="my-5 border-l-4 border-green bg-green/10 p-4 italic text-ink rounded-r-lg font-medium">${parseInlineFormatting(quoteText)}</blockquote>`;
    }

    // 3. Bullet list (- item or * item or • item)
    const lines = b.split("\n");
    const isBulletList = lines.every(l => /^[\*\-•]\s+/.test(l.trim()));
    if (isBulletList) {
      const itemsHtml = lines
        .map(l => `<li class="relative pl-6 before:absolute before:left-2 before:top-2.5 before:h-2 before:w-2 before:rounded-full before:bg-green">${parseInlineFormatting(l.replace(/^[\*\-•]\s+/, ""))}</li>`)
        .join("");
      return `<ul class="my-4 space-y-2 text-base md:text-lg text-ink font-sans">${itemsHtml}</ul>`;
    }

    // 4. Numbered list (1. item)
    const isNumberedList = lines.every(l => /^\d+[\.\)]\s+/.test(l.trim()));
    if (isNumberedList) {
      const itemsHtml = lines
        .map(l => `<li class="ml-5 list-decimal font-medium">${parseInlineFormatting(l.replace(/^\d+[\.\)]\s+/, ""))}</li>`)
        .join("");
      return `<ol class="my-4 space-y-2 text-base md:text-lg text-ink font-sans">${itemsHtml}</ol>`;
    }

    // 5. Code block
    if (b.startsWith("```") && b.endsWith("```")) {
      const code = b.slice(3, -3).replace(/^[a-z]+\n/, "");
      return `<pre class="my-4 overflow-x-auto rounded-lg bg-ink p-4 font-mono text-xs md:text-sm text-gold"><code>${escapeHtml(code)}</code></pre>`;
    }

    // 6. Regular Paragraph
    const formattedText = parseInlineFormatting(b.replace(/\n/g, "<br />"));
    return `<p class="mb-4 text-base md:text-lg leading-relaxed text-ink">${formattedText}</p>`;
  });

  return formattedBlocks.filter(Boolean).join("");
}

/**
 * Parses inline shortcuts:
 * - **bold** or *bold* (WhatsApp) -> <strong>bold</strong>
 * - _italic_ -> <em>italic</em>
 * - ~strikethrough~ -> <del>strikethrough</del>
 * - `code` -> <code>code</code>
 * - [color=#hex]text[/color] or [color=red]text[/color] -> <span style="color:#hex">text</span>
 */
function parseInlineFormatting(str: string): string {
  if (!str) return "";

  let result = str;

  // Color syntax: [color=#10b981]text[/color] or [color=red]text[/color]
  result = result.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, '<span style="color: $1">$2</span>');

  // WhatsApp style bold: **text** or *text* (word bounded)
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-ink">$1</strong>');
  result = result.replace(/(^|\s)\*([^*]+)\*(\s|$)/g, '$1<strong class="font-bold text-ink">$2</strong>$3');

  // WhatsApp style italic: _text_
  result = result.replace(/(^|\s)_([^_]+)_(\s|$)/g, '$1<em class="italic text-ink/90">$2</em>$3');

  // WhatsApp style strikethrough: ~text~
  result = result.replace(/(^|\s)~([^~]+)~(\s|$)/g, '$1<del class="line-through text-muted">$2</del>$3');

  // Inline code: `code`
  result = result.replace(/`([^`]+)`/g, '<code class="rounded bg-line/50 px-1.5 py-0.5 font-mono text-xs text-green">$1</code>');

  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
