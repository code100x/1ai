
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";

export function processOutput(raw: string): string {
  if (!raw) return raw;
  try {
    const file = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkStringify as any)
      .data("settings", {
        bullet: "-",
        bulletOrdered: ".",
        listItemIndent: "one",
        fences: true,
        fence: "`",
        emphasis: "_",
        strong: "*",
        rule: "*",
        ruleRepetition: 3,
        ruleSpaces: true,
        setext: false,
        tightDefinitions: true,
      })
      .processSync(raw);
    return String(file).trim();
  } catch {
    return raw;
  }
}