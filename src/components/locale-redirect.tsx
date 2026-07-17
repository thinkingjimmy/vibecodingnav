/**
 * [INPUT]: 依赖浏览器 localStorage/navigator 与 resolveLocale/localePath 纯函数
 * [OUTPUT]: 对外提供根路径的客户端语言检测与 replace 跳转副作用
 * [POS]: src/components 的根路径交互叶子，不渲染可见 UI
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { useEffect } from "react";
import { resolveLocale } from "@/lib/locale";
import { localePath } from "@/lib/site";

export function LocaleRedirect() {
  useEffect(() => {
    const locale = resolveLocale(localStorage.getItem("lang"), navigator.languages);
    window.location.replace(localePath(locale));
  }, []);

  return null;
}
