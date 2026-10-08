"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CATEGORIES } from "@/lib/constants";
import { DIVISIONS } from "@/lib/bd-data";
import { PROFIT_OPTIONS, type ExploreFilters } from "@/lib/explore";
import { useT } from "@/lib/i18n";
import { useLangStore } from "@/store/lang-store";
import { AreaFilter } from "./area-filter";
import { CheckList } from "./check-list";
import { PriceRangeFilter } from "./price-range-filter";

interface FilterSidebarProps {
  filters: ExploreFilters;
  onChange: (patch: Partial<ExploreFilters>) => void;
  onReset: () => void;
  activeCount: number;
  showTitle?: boolean;
}

const ALL_SECTIONS = ["division", "district", "area", "category", "wholesale", "retail", "profit"];
const trigger = "py-3 text-sm font-semibold text-ink";

const toggle = (list: string[], value: string, checked: boolean) =>
  checked ? Array.from(new Set([...list, value])) : list.filter((v) => v !== value);

export function FilterSidebar({ filters, onChange, onReset, activeCount, showTitle = true }: FilterSidebarProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const visibleDivisions = DIVISIONS.filter(
    (d) => filters.division.includes(d.value) || d.districts.some((x) => filters.district.includes(x.value)),
  );

  return (
    <div>
      <div className="flex min-h-9 items-center justify-between">
        {showTitle ? <h2 className="text-lg font-semibold text-ink">{t("filterTitle")}</h2> : <span />}
        {activeCount > 0 && (
          <button onClick={onReset} className="rounded text-sm font-medium text-green hover:underline">
            {t("clearAll")} ({activeCount})
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={ALL_SECTIONS} className="mt-1">
        <AccordionItem value="division">
          <AccordionTrigger className={trigger}>{t("division")}</AccordionTrigger>
          <AccordionContent>
            <CheckList
              idPrefix="f-division"
              options={DIVISIONS.map((d) => ({ value: d.value, label: lang === "bn" ? d.label : d.value }))}
              selected={filters.division}
              onToggle={(v, c) => onChange({ division: toggle(filters.division, v, c) })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="district">
          <AccordionTrigger className={trigger}>{t("district")}</AccordionTrigger>
          <AccordionContent>
            {visibleDivisions.length === 0 ? (
              <p className="text-sm text-muted">{t("selectDistrictHint")}</p>
            ) : (
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {visibleDivisions.map((d) => (
                  <div key={d.value}>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                      {lang === "bn" ? `${d.label} বিভাগ` : `${d.value} Division`}
                    </p>
                    <CheckList
                      idPrefix={`f-district-${d.value}`}
                      options={d.districts.map((x) => ({ value: x.value, label: lang === "bn" ? x.label : x.value }))}
                      selected={filters.district}
                      onToggle={(v, c) => onChange({ district: toggle(filters.district, v, c) })}
                    />
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="area">
          <AccordionTrigger className={trigger}>{t("area")}</AccordionTrigger>
          <AccordionContent>
            <AreaFilter value={filters.area} onChange={(area) => onChange({ area })} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger className={trigger}>{t("category")}</AccordionTrigger>
          <AccordionContent>
            <CheckList
              idPrefix="f-category"
              options={CATEGORIES.map((c) => ({ value: c.slug, label: lang === "bn" ? c.nameBn : c.nameEn }))}
              selected={filters.category}
              onToggle={(v, c) => onChange({ category: toggle(filters.category, v, c) })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="wholesale">
          <AccordionTrigger className={trigger}>{t("wholesalePrice")}</AccordionTrigger>
          <AccordionContent>
            <PriceRangeFilter label={t("wholesalePrice")} value={filters.wholesale} onCommit={(wholesale) => onChange({ wholesale })} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="retail">
          <AccordionTrigger className={trigger}>{t("retailPrice")}</AccordionTrigger>
          <AccordionContent>
            <PriceRangeFilter label={t("retailPrice")} value={filters.retail} onCommit={(retail) => onChange({ retail })} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="profit" className="border-b-0">
          <AccordionTrigger className={trigger}>{t("profitPotential")}</AccordionTrigger>
          <AccordionContent>
            <CheckList
              idPrefix="f-profit"
              options={PROFIT_OPTIONS.map((o) => ({ value: o.value, label: lang === "bn" ? o.labelBn : o.labelEn }))}
              selected={filters.profit}
              onToggle={(v, c) => onChange({ profit: toggle(filters.profit, v, c) as ExploreFilters["profit"] })}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
