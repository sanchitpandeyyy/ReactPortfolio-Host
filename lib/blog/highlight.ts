import { decodeEntities, escapeHtml } from "./sanitize";

/**
 * Server-side syntax highlighting for mirrored code blocks.
 *
 * Deliberately tiny and dependency-free: a full highlighter would add hundreds
 * of kilobytes of client JavaScript to every article for a purely visual gain.
 * This runs once on the server, ships as plain HTML, and degrades to unstyled
 * (but perfectly readable and selectable) code for languages it does not know.
 *
 * Code is decoded before tokenising and re-escaped when emitted, so an article
 * about XSS renders its own examples safely.
 */

interface LangSpec {
  comment?: string;
  string?: string;
  number?: string;
  keywords?: string[];
  /** Extra token classes, tried before keywords. */
  extra?: { name: string; pattern: string }[];
}

const C_STRING = String.raw`"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'`;
// A template literal, written as a plain string because it contains backticks.
const TEMPLATE = "`(?:\\\\.|[^`\\\\])*`";
const C_NUMBER = String.raw`\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b`;
const LINE_HASH = String.raw`#[^\n]*`;
const LINE_SLASH = String.raw`//[^\n]*|/\*[\s\S]*?\*/`;

const JS_KEYWORDS = [
  "abstract", "async", "await", "break", "case", "catch", "class", "const",
  "continue", "debugger", "declare", "default", "delete", "do", "else", "enum",
  "export", "extends", "false", "finally", "for", "from", "function", "get",
  "if", "implements", "import", "in", "instanceof", "interface", "keyof", "let",
  "new", "null", "of", "private", "protected", "public", "readonly", "return",
  "satisfies", "set", "static", "super", "switch", "this", "throw", "true",
  "try", "type", "typeof", "undefined", "var", "void", "while", "yield",
];

const PY_KEYWORDS = [
  "and", "as", "assert", "async", "await", "break", "class", "continue", "def",
  "del", "elif", "else", "except", "False", "finally", "for", "from", "global",
  "if", "import", "in", "is", "lambda", "None", "nonlocal", "not", "or", "pass",
  "raise", "return", "True", "try", "while", "with", "yield",
];

const SQL_KEYWORDS = [
  "ALTER", "AND", "AS", "ASC", "BY", "CASE", "CREATE", "DELETE", "DESC", "DROP",
  "ELSE", "END", "EXISTS", "FROM", "FULL", "GROUP", "HAVING", "IN", "INDEX",
  "INNER", "INSERT", "INTO", "IS", "JOIN", "LEFT", "LIKE", "LIMIT", "NOT",
  "NULL", "OFFSET", "ON", "OR", "ORDER", "OUTER", "RIGHT", "SELECT", "SET",
  "TABLE", "THEN", "UNION", "UPDATE", "VALUES", "WHEN", "WHERE", "WITH",
];

const SHELL_KEYWORDS = [
  "case", "cd", "do", "done", "echo", "elif", "else", "esac", "exit", "export",
  "fi", "for", "function", "if", "in", "local", "return", "set", "source",
  "then", "unset", "while",
];

const GO_KEYWORDS = [
  "break", "case", "chan", "const", "continue", "default", "defer", "else",
  "fallthrough", "for", "func", "go", "goto", "if", "import", "interface",
  "map", "package", "range", "return", "select", "struct", "switch", "type",
  "var", "nil", "true", "false",
];

const PHP_KEYWORDS = [
  "abstract", "array", "as", "break", "case", "catch", "class", "const",
  "continue", "declare", "default", "do", "echo", "else", "elseif", "extends",
  "final", "finally", "fn", "for", "foreach", "function", "global", "if",
  "implements", "include", "instanceof", "interface", "isset", "namespace",
  "new", "null", "print", "private", "protected", "public", "require", "return",
  "static", "switch", "throw", "trait", "try", "use", "var", "while", "yield",
];

const RUST_KEYWORDS = [
  "as", "async", "await", "break", "const", "continue", "crate", "dyn", "else",
  "enum", "extern", "false", "fn", "for", "if", "impl", "in", "let", "loop",
  "match", "mod", "move", "mut", "pub", "ref", "return", "self", "static",
  "struct", "super", "trait", "true", "type", "unsafe", "use", "where", "while",
];

const JS: LangSpec = {
  comment: LINE_SLASH,
  string: `${C_STRING}|${TEMPLATE}`,
  number: C_NUMBER,
  keywords: JS_KEYWORDS,
};

const LANGS: Record<string, LangSpec> = {
  js: JS,
  jsx: JS,
  ts: JS,
  tsx: JS,
  javascript: JS,
  typescript: JS,
  json: {
    string: C_STRING,
    number: C_NUMBER,
    keywords: ["true", "false", "null"],
  },
  bash: {
    comment: LINE_HASH,
    string: C_STRING,
    keywords: SHELL_KEYWORDS,
    extra: [{ name: "var", pattern: String.raw`\$\{?\w+\}?` }],
  },
  css: {
    comment: String.raw`/\*[\s\S]*?\*/`,
    string: C_STRING,
    number: String.raw`\b\d[\d_]*(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg)?\b`,
    extra: [{ name: "kw", pattern: String.raw`@[a-z-]+|--[\w-]+` }],
  },
  html: {
    comment: String.raw`<!--[\s\S]*?-->`,
    string: C_STRING,
    extra: [
      { name: "tag", pattern: String.raw`</?[a-zA-Z][\w:-]*|/?>` },
      { name: "atr", pattern: String.raw`\b[a-zA-Z-]+(?==)` },
    ],
  },
  python: {
    comment: LINE_HASH,
    string: String.raw`"""[\s\S]*?"""|'''[\s\S]*?'''|` + C_STRING,
    number: C_NUMBER,
    keywords: PY_KEYWORDS,
  },
  sql: {
    comment: String.raw`--[^\n]*|/\*[\s\S]*?\*/`,
    string: C_STRING,
    number: C_NUMBER,
    keywords: SQL_KEYWORDS,
  },
  go: { comment: LINE_SLASH, string: `${C_STRING}|${TEMPLATE}`, number: C_NUMBER, keywords: GO_KEYWORDS },
  rust: { comment: LINE_SLASH, string: C_STRING, number: C_NUMBER, keywords: RUST_KEYWORDS },
  php: {
    comment: `${LINE_SLASH}|${LINE_HASH}`,
    string: C_STRING,
    number: C_NUMBER,
    keywords: PHP_KEYWORDS,
    extra: [{ name: "var", pattern: String.raw`\$\w+` }],
  },
  yaml: {
    comment: LINE_HASH,
    string: C_STRING,
    number: C_NUMBER,
    extra: [{ name: "atr", pattern: String.raw`^\s*[\w.-]+(?=\s*:)` }],
  },
  prisma: {
    comment: LINE_SLASH,
    string: C_STRING,
    number: C_NUMBER,
    keywords: ["model", "enum", "datasource", "generator", "type"],
  },
};

/** Common aliases so the CMS language label does not have to be exact. */
const ALIASES: Record<string, string> = {
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  py: "python",
  yml: "yaml",
  golang: "go",
  scss: "css",
  postgres: "sql",
  postgresql: "sql",
  htm: "html",
  xml: "html",
  vue: "html",
  svelte: "html",
  jsonc: "json",
  rs: "rust",
};

function specFor(language: string): LangSpec | null {
  const key = language.toLowerCase();
  return LANGS[ALIASES[key] ?? key] ?? null;
}

const compiled = new Map<string, RegExp>();

function patternFor(language: string, spec: LangSpec): RegExp {
  const cached = compiled.get(language);
  if (cached) return cached;

  const parts: string[] = [];
  if (spec.comment) parts.push(`(?<com>${spec.comment})`);
  if (spec.string) parts.push(`(?<str>${spec.string})`);
  for (const extra of spec.extra ?? []) {
    parts.push(`(?<${extra.name}>${extra.pattern})`);
  }
  if (spec.number) parts.push(`(?<num>${spec.number})`);
  if (spec.keywords?.length) {
    parts.push(`(?<kw>\\b(?:${spec.keywords.join("|")})\\b)`);
  }

  const re = new RegExp(parts.join("|"), "gm");
  compiled.set(language, re);
  return re;
}

/** Tokenise one block of source. Input is plain text, output is escaped HTML. */
export function highlightCode(code: string, language: string): string {
  const spec = language ? specFor(language) : null;
  if (!spec) return escapeHtml(code);

  const re = patternFor(language.toLowerCase(), spec);
  re.lastIndex = 0;

  let out = "";
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code)) !== null) {
    // A zero-length match would loop forever; step past it.
    if (match[0] === "") {
      re.lastIndex += 1;
      continue;
    }
    const groups = match.groups ?? {};
    const type = Object.keys(groups).find((k) => groups[k] !== undefined);
    out += escapeHtml(code.slice(last, match.index));
    out += type
      ? `<span class="tk-${type}">${escapeHtml(match[0])}</span>`
      : escapeHtml(match[0]);
    last = match.index + match[0].length;
  }

  return out + escapeHtml(code.slice(last));
}

const CODE_BLOCK_RE =
  /<pre([^>]*)><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g;

function languageOf(preAttrs: string, codeAttrs: string): string {
  const data = preAttrs.match(/data-language="([^"]*)"/);
  if (data) return data[1];
  const cls = codeAttrs.match(/class="[^"]*language-([\w+#.-]+)[^"]*"/);
  return cls ? cls[1] : "";
}

/**
 * Highlights every code block in an already-sanitized article.
 *
 * Runs after sanitizing, so the tags and attributes it sees are known-good and
 * the only thing being rewritten is the text inside <code>.
 */
export function highlightArticleHtml(html: string): string {
  return html.replace(
    CODE_BLOCK_RE,
    (_full, preAttrs: string, codeAttrs: string, body: string) => {
      const language = languageOf(preAttrs, codeAttrs);
      const code = decodeEntities(body);
      return `<pre${preAttrs}><code${codeAttrs}>${highlightCode(
        code,
        language,
      )}</code></pre>`;
    },
  );
}
