"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CATEGORIES } from "@/lib/constants";
import { DIVISIONS } from "@/lib/bd-data";
import { PROFIT_OPTIONS, type ExploreFilters } from "@/lib/explore";
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
const trigger = "py-3 text-sm font-semibold";

const toggle = (list: string[], value: string, checked: boolean) =>
  checked ? Array.from(new Set([...list, value])) : list.filter((v) => v !== value);

/** Used twice: sticky sidebar on desktop, inside the Drawer on mobile. */
export function FilterSidebar({ filters, onChange, onReset, activeCount, showTitle = true }: FilterSidebarProps) {
  // Districts are grouped under their division. A division shows up if it is selected
  // OR if one of its districts is (e.g. a link like /explore?district=Sylhet).
  const visibleDivisions = DIVISIONS.filter(
    (d) => filters.division.includes(d.value) || d.districts.some((x) => filters.district.includes(x.value)),
  );

  return (
    <div>
      <div className="flex min-h-9 items-center justify-between">
        {showTitle ? <h2 className="text-lg font-semibold">ফিল্টার</h2> : <span />}
        {activeCount > 0 && (
          <button onClick={onReset} className="rounded text-sm font-medium text-link hover:underline">
            সব মুছুন ({activeCount})
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={ALL_SECTIONS} className="mt-1">
        <AccordionItem value="division">
          <AccordionTrigger className={trigger}>বিভাগ</AccordionTrigger>
          <AccordionContent>
            <CheckList
              idPrefix="f-division"
              options={DIVISIONS.map((d) => ({ value: d.value, label: d.label }))}
              selected={filters.division}
              onToggle={(v, c) => onChange({ division: toggle(filters.division, v, c) })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="district">
          <AccordionTrigger className={trigger}>জেলা</AccordionTrigger>
          <AccordionContent>
            {visibleDivisions.length === 0 ? (
              <p className="text-sm text-ink-secondary">জেলা বেছে নিতে আগে এক বা একাধিক বিভাগ নির্বাচন করুন।</p>
            ) : (
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {visibleDivisions.map((d) => (
                  <div key={d.value}>
                    <p className="mb-1 text-sm font-medium text-ink-secondary">{d.label} বিভাগ</p>
                    <CheckList
                      idPrefix={`f-district-${d.value}`}
                      options={d.districts}
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
          <AccordionTrigger className={trigger}>এলাকা</AccordionTrigger>
          <AccordionContent>
            <AreaFilter value={filters.area} onChange={(area) => onChange({ area })} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger className={trigger}>ক্যাটাগরি</AccordionTrigger>
          <AccordionContent>
            <CheckList
              idPrefix="f-category"
              options={CATEGORIES.map((c) => ({ value: c.slug, label: c.nameBn }))}
              selected={filters.category}
              onToggle={(v, c) => onChange({ category: toggle(filters.category, v, c) })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="wholesale">
          <AccordionTrigger className={trigger}>পাইকারি দাম</AccordionTrigger>
          <AccordionContent>
            <PriceRangeFilter label="পাইকারি দাম" value={filters.wholesale} onCommit={(wholesale) => onChange({ wholesale })} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="retail">
          <AccordionTrigger className={trigger}>খুচরা দাম</AccordionTrigger>
          <AccordionContent>
            <PriceRangeFilter label="খুচরা দাম" value={filters.retail} onCommit={(retail) => onChange({ retail })} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="profit" className="border-b-0">
          <AccordionTrigger className={trigger}>লাভের সম্ভাবনা</AccordionTrigger>
          <AccordionContent>
            <CheckList
              idPrefix="f-profit"
              options={PROFIT_OPTIONS}
              selected={filters.profit}
              onToggle={(v, c) => onChange({ profit: toggle(filters.profit, v, c) as ExploreFilters["profit"] })}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
