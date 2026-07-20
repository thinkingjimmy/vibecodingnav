/**
 * [INPUT]: 依赖模型目录、Locale/ModelSlug、modelPath、next/image、Phosphor CaretDown 与 Base UI DropdownMenu
 * [OUTPUT]: 对外提供截图同构的桌面 Models 厂商分组菜单、当前模型链接与不可用模型状态
 * [POS]: src/components 的 Header 客户端交互叶子，只持有菜单开合与无障碍导航行为
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import Image from "next/image";
import { MODEL_CATALOG, type ModelCatalogGroup } from "@/content/models/catalog";
import type { Locale } from "@/lib/contracts";
import type { ModelSlug } from "@/lib/model";
import { modelPath } from "@/lib/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dotClasses = {
  positive: "bg-[var(--model-positive)]",
  neutral: "bg-[var(--model-neutral)]",
  current: "bg-[var(--model-current)]",
} as const;

function ModelRow({
  currentModelSlug,
  locale,
  model,
}: {
  currentModelSlug: ModelSlug;
  locale: Locale;
  model: ModelCatalogGroup["models"][number];
}) {
  const content = (
    <>
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dotClasses[model.tone]}`} />
      <span className="min-w-0 flex-1 truncate font-serif text-base leading-none text-ink">
        {model.name}
      </span>
      <span className="font-mono text-xs leading-none text-ink-faint [font-feature-settings:'tnum']">
        {model.score}
      </span>
    </>
  );

  if (!model.slug) {
    return (
      <DropdownMenuItem
        aria-disabled="true"
        className="gap-2.5 rounded-sm px-0 py-2 data-disabled:opacity-100"
        disabled
      >
        {content}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      className="gap-2.5 rounded-sm px-0 py-2 focus:bg-subtle"
      render={
        <a
          aria-current={model.slug === currentModelSlug ? "page" : undefined}
          href={modelPath(locale, model.slug)}
        />
      }
    >
      {content}
    </DropdownMenuItem>
  );
}

export function ModelMenu({
  currentModelSlug,
  label,
  locale,
}: {
  currentModelSlug: ModelSlug;
  label: string;
  locale: Locale;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={`${label}: Kimi K3`}
            className="header-nav-link group inline-flex cursor-pointer items-center gap-1.5"
            type="button"
          />
        }
      >
        <span>{label}</span>
        <CaretDownIcon
          aria-hidden="true"
          className="transition-transform group-data-[popup-open]:rotate-180"
          size={12}
          weight="bold"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-[min(760px,calc(100vw-32px))] rounded-sm border-hairline bg-elevated p-4 shadow-[0_12px_36px_rgba(56,48,35,.12)]"
        sideOffset={14}
      >
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          {MODEL_CATALOG.map((group) => {
            const headingId = `model-vendor-${group.vendor.toLowerCase()}`;
            return (
              <div aria-labelledby={headingId} key={group.vendor} role="group">
                <div className="flex items-center gap-2.5 border-b border-hairline pb-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-subtle">
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="size-4 object-contain"
                      height={20}
                      src={group.logo}
                      unoptimized
                      width={20}
                    />
                  </span>
                  <h2
                    className="font-mono text-xs font-medium uppercase tracking-[.14em] text-ink"
                    id={headingId}
                  >
                    {group.vendor}
                  </h2>
                </div>
                <div className="pt-2">
                  {group.models.map((model) => (
                    <ModelRow
                      currentModelSlug={currentModelSlug}
                      key={model.name}
                      locale={locale}
                      model={model}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
