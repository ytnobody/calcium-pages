#!/usr/bin/env node
// Internal link + anchor checker for the Calcium docs site.
//
// It reads the markdown sources, derives each page's output URL from its
// front-matter `permalink` (or its path), and verifies that every internal
// link resolves to a known page and that every `#fragment` matches a heading.
// External links (http/https/mailto/tel) are ignored (see lychee in CI).
//
// Usage:  node scripts/check-links.mjs
// Exit code: 0 = OK, 1 = broken links found.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASEURL = "/calcium-pages";
const SKIP_DIRS = new Set([".git", ".worktrees", "node_modules", "_site", "vendor"]);

// ---------------------------------------------------------------- file walk

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".") {
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      out.push(path.relative(ROOT, full));
    }
  }
  return out;
}

// ---------------------------------------------------------------- slugify

// Approximates kramdown's auto-generated heading id.
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "") // strip inline HTML
    .replace(/[^\p{L}\p{N}\s_-]/gu, "") // drop punctuation
    .trim()
    .replace(/\s+/g, "-");
}

// ---------------------------------------------------------------- front matter

function parseFrontMatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { fm: {}, body: content };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, "");
  }
  return { fm, body: content.slice(m[0].length) };
}

function pageUrl(relPath, fm) {
  if (fm.permalink) return normalizeUrl(BASEURL + fm.permalink);
  const base = path.basename(relPath);
  const dir = path.dirname(relPath);
  if (base === "index.md") {
    return normalizeUrl(BASEURL + "/" + (dir === "." ? "" : dir + "/"));
  }
  return normalizeUrl(BASEURL + "/" + relPath.replace(/\.md$/, ".html"));
}

function normalizeUrl(u) {
  u = u.replace(/\/{2,}/g, "/");
  if (!u.startsWith("/")) u = "/" + u;
  return u;
}

// ---------------------------------------------------------------- link extract

function extractLinks(body) {
  const links = [];
  const md = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = md.exec(body))) links.push(m[1]);
  const html = /<(?:a|img|link|script)\b[^>]*\b(?:href|src)="([^"]+)"/g;
  while ((m = html.exec(body))) links.push(m[1]);
  return links;
}

// ---------------------------------------------------------------- main

const files = walk(ROOT);
const mdFiles = files.filter((f) => f.endsWith(".md"));
const fileSet = new Set(files);

/** pathname -> { file, slugs:Set } */
const pages = new Map();

for (const file of mdFiles) {
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");
  const { fm, body } = parseFrontMatter(content);
  const url = pageUrl(file, fm);
  const slugs = new Set();
  const heading = /^#{1,6}\s+(.+?)\s*#*\s*$/gm;
  let hm;
  while ((hm = heading.exec(body))) slugs.add(slugify(hm[1]));

  const variants = new Set([url]);
  if (url.endsWith("/")) variants.add(url.replace(/\/$/, ""));
  else variants.add(url + "/");
  for (const v of variants) pages.set(v, { file, slugs, url });
}

const problems = [];

/** Resolve an internal link (path) to a known page, with baseurl stripped. */
function resolvePage(pathname) {
  const candidates = [pathname];
  if (pathname.endsWith("/")) candidates.push(pathname.replace(/\/$/, ""));
  else candidates.push(pathname + "/");
  if (pathname.endsWith("/index.html")) candidates.push(pathname.replace(/index\.html$/, ""));
  for (const c of candidates) if (pages.has(c)) return pages.get(c);
  return null;
}

for (const file of mdFiles) {
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");
  const { fm, body } = parseFrontMatter(content);
  const url = pageUrl(file, fm);
  const base = "http://localhost" + url;

  for (const raw of extractLinks(body)) {
    const link = raw.trim();
    if (link === "" || link.startsWith("http://") || link.startsWith("https://")) continue;
    if (link.startsWith("mailto:") || link.startsWith("tel:") || link.startsWith("data:")) continue;
    if (link.includes("{{") || link.includes("{%")) continue; // Liquid template

    // Fragment only: same page.
    if (link.startsWith("#")) {
      const frag = decodeURIComponent(link.slice(1));
      const page = pages.get(url);
      if (frag && !page.slugs.has(frag)) {
        problems.push(`${file}: missing anchor '${link}' on ${url}`);
      }
      continue;
    }

    let resolved;
    try {
      resolved = new URL(link, base);
    } catch {
      problems.push(`${file}: malformed link '${link}'`);
      continue;
    }
    const pathname = resolved.pathname;
    const frag = decodeURIComponent(resolved.hash.replace(/^#/, ""));

    // Asset (has a file extension, not an .html page)?
    if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith(".html")) {
      const rel = pathname.replace(new RegExp("^" + BASEURL + "/?"), "");
      if (!fileSet.has(rel)) {
        problems.push(`${file}: missing asset '${link}' (expected ${rel})`);
      }
      continue;
    }

    const page = resolvePage(pathname);
    if (!page) {
      problems.push(`${file}: broken page link '${link}' -> ${pathname}`);
      continue;
    }
    if (frag && !page.slugs.has(frag)) {
      problems.push(`${file}: broken anchor '${link}' (no #${frag} in ${page.url})`);
    }
  }
}

if (problems.length > 0) {
  console.error(`Found ${problems.length} broken internal link(s):\n`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log(`OK: ${mdFiles.length} markdown files, no broken internal links.`);
