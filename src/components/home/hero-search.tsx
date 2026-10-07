"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIVISIONS, getDistricts } from "@/lib/bd-data";
import { CATEGORIES } from "@/lib/constants";

const ALL = "all"; // Radix Select can't use "" as a value

export function HeroSearch() {
  const router = useRouter();
  const [division, setDivision] = useState(ALL);
  const [district, setDistrict] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const districts = getDistricts(division);

  function onDivisionChange(value: string) {
    setDivision(value);
    setDistrict(ALL); // districts depend on division
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (division !== ALL) params.set("division", division);
    if (district !== ALL) params.set("district", district);
    if (category !== ALL) params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `/explore?${qs}` : "/explore");
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="ব্যবসা খুঁজুন"
      className="grid gap-4 rounded-2xl border border-border bg-surface/70 p-4 shadow-md backdrop-blur-xl md:grid-cols-[1fr_1fr_1fr_auto] md:items-end md:p-5"
    >
      <div className="space-y-1.5">
        <Label htmlFor="hero-division">বিভাগ</Label>
        <Select value={division} onValueChange={onDivisionChange}>
          <SelectTrigger id="hero-division"><SelectValue placeholder="সব বিভাগ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>সব বিভাগ</SelectItem>
            {DIVISIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-district">জেলা</Label>
        <Select value={district} onValueChange={setDistrict} disabled={division === ALL}>
          <SelectTrigger id="hero-district"><SelectValue placeholder="সব জেলা" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>সব জেলা</SelectItem>
            {districts.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-category">ক্যাটাগরি</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="hero-category"><SelectValue placeholder="সব ক্যাটাগরি" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>সব ক্যাটাগরি</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.nameBn}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" className="h-11 w-full md:w-auto md:text-sm">
        <Search aria-hidden /> খুঁজুন
      </Button>
    </form>
  );
}
