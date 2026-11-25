import { execFileSync } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../outputs/audit/", import.meta.url);
const files = new Set(execFileSync("git", ["ls-files", "-co", "--exclude-standard", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean));
const patterns = {
  privateKey: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
  githubToken: /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{35,})/g,
  awsAccessKey: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,
  openaiKey: /\bsk-(?:proj-)?[A-Za-z0-9_-]{35,}\b/g,
  stripeSecret: /\bsk_live_[A-Za-z0-9]{20,}\b/g,
  googleKey: /\bAIza[A-Za-z0-9_-]{35}\b/g,
  databasePassword: /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s:"']+:[^\s@"']{8,}@/g,
};
let checkedTextFiles = 0;
const matches = [];
for (const file of [...files].sort()) {
  const path = resolve(root, file);
  try {
    const info = await stat(path);
    if (!info.isFile() || info.size > 5_000_000) continue;
    const bytes = await readFile(path);
    if (bytes.includes(0)) continue;
    const source = bytes.toString("utf8");
    checkedTextFiles++;
    for (const [pattern, expression] of Object.entries(patterns)) {
      for (const match of source.matchAll(expression)) matches.push({ file, line: source.slice(0, match.index).split("\n").length, pattern });
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
await mkdir(output, { recursive: true });
await writeFile(new URL("secret-patterns.json", output), JSON.stringify({ checkedTextFiles, matches }, null, 2));
// Report locations only; never print possible credentials themselves.
if (matches.length) {
  console.error(matches);
  process.exitCode = 1;
} else console.log(`PASS ${checkedTextFiles} current text files: no supported credential signatures found (not a Git-history scan)`);
