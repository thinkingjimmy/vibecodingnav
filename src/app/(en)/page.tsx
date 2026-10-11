/**
 * [INPUT]: 依赖首页视图
 * [OUTPUT]: 对外提供 en 首页
 * [POS]: / 路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { HomeView, homeMetadata } from "@/views/home-view";

export const metadata = homeMetadata("en");

export default function Page() {
  return <HomeView locale="en" />;
}
