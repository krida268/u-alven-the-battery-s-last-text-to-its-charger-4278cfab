import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "You finally showed up — 9pm, I'm at 1%, and you've brought the wrong cable. Tell the cloud I loved it.";

function resolveTarget(raw: string | undefined): string {
  if (!raw) return "/output/entry.txt";
  // A path that already exists as a directory takes entry.txt inside it.
  if (existsSync(raw) && statSync(raw).isDirectory()) {
    return join(raw, "entry.txt");
  }
  if (raw.endsWith("/")) {
    mkdirSync(raw, { recursive: true });
    return join(raw, "entry.txt");
  }
  return raw;
}

function main(): void {
  if (ENTRY.length < 1 || ENTRY.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${ENTRY.length}`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (ENTRY.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  const target = resolveTarget(process.argv[2]);
  // Create the output directory if needed; never delete /output itself.
  const dir = target.slice(0, target.lastIndexOf("/")) || "/";
  mkdirSync(dir, { recursive: true });
  writeFileSync(target, ENTRY, "utf8");
  console.log(`wrote ${target} (${ENTRY.length} characters)`);
}

main();
