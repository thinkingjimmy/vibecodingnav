import { describe, expect, it } from "vitest";
import { activeNav, NAV_KEYS, type NavKey } from "@/lib/nav";

const sections: { key: NavKey; paths: string[] }[] = [
  { key: "scenarios", paths: ["/scenarios", "/scenarios/", "/zh/scenarios/", "/scenarios/web-frontend/", "/zh/scenarios/android-app"] },
  { key: "models", paths: ["/models", "/models/", "/zh/models/", "/models/claude-opus-5-5/", "/zh/models/claude-opus-5-5"] },
  { key: "tools", paths: ["/tools/", "/zh/tools", "/libraries/phosphor-icons/", "/zh/skills/frontend-design/", "/plugins/shadcn-mcp/", "/zh/prompts/agents-md/", "/apps/open-design/"] },
  { key: "builds", paths: ["/build", "/build/", "/zh/build/", "/build/web-frontend/", "/zh/build/saas"] },
  { key: "benchmarks", paths: ["/benchmarks", "/benchmarks/", "/zh/benchmarks/", "/benchmarks/android-bench/", "/zh/benchmarks/lmarena-webdev"] },
];

describe("nav active state", () => {
  it("selects nothing on either home", () => {
    for (const path of ["/", "", "/zh", "/zh/"]) {
      expect(activeNav(path)).toBeUndefined();
    }
  });

  it("selects one section on that section's index and detail, in both locales", () => {
    for (const section of sections) {
      for (const path of section.paths) {
        expect(activeNav(path)).toBe(section.key);
        const others = NAV_KEYS.filter((key) => key !== section.key);
        expect(others.every((key) => activeNav(path) !== key)).toBe(true);
      }
    }
  });
});
