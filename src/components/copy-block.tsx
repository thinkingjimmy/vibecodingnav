/**
 * [INPUT]: 依赖要复制的文案与按钮标签
 * [OUTPUT]: 对外提供复制与下载 AGENTS.md
 * [POS]: src/components 的组合页带走动作
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { useState } from "react";

export function CopyActions({ text, copyLabel, copiedLabel, downloadLabel }: { text: string; copyLabel: string; copiedLabel: string; downloadLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="pill"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
      <button
        type="button"
        className="pill"
        onClick={() => {
          const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = "AGENTS.md";
          link.click();
          URL.revokeObjectURL(url);
        }}
      >
        {downloadLabel}
      </button>
    </div>
  );
}
