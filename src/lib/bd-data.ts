/**
 * Bangladesh administrative data: 8 divisions, 64 districts (correctly mapped).
 *
 * `value` is the English name (what we put in URLs and send to the API),
 * `label` is the Bangla name shown in the UI. If your backend stores different
 * strings, change the `value`s here — nothing else needs to change.
 */
export interface District {
  value: string;
  label: string;
}
export interface Division {
  value: string;
  label: string;
  districts: District[];
}

const d = (value: string, label: string): District => ({ value, label });

export const DIVISIONS: Division[] = [
  {
    value: "Dhaka",
    label: "ঢাকা",
    districts: [
      d("Dhaka", "ঢাকা"), d("Faridpur", "ফরিদপুর"), d("Gazipur", "গাজীপুর"), d("Gopalganj", "গোপালগঞ্জ"),
      d("Kishoreganj", "কিশোরগঞ্জ"), d("Madaripur", "মাদারীপুর"), d("Manikganj", "মানিকগঞ্জ"),
      d("Munshiganj", "মুন্সিগঞ্জ"), d("Narayanganj", "নারায়ণগঞ্জ"), d("Narsingdi", "নরসিংদী"),
      d("Rajbari", "রাজবাড়ী"), d("Shariatpur", "শরীয়তপুর"), d("Tangail", "টাঙ্গাইল"),
    ],
  },
  {
    value: "Chattogram",
    label: "চট্টগ্রাম",
    districts: [
      d("Bandarban", "বান্দরবান"), d("Brahmanbaria", "ব্রাহ্মণবাড়িয়া"), d("Chandpur", "চাঁদপুর"),
      d("Chattogram", "চট্টগ্রাম"), d("Cumilla", "কুমিল্লা"), d("Cox's Bazar", "কক্সবাজার"),
      d("Feni", "ফেনী"), d("Khagrachhari", "খাগড়াছড়ি"), d("Lakshmipur", "লক্ষ্মীপুর"),
      d("Noakhali", "নোয়াখালী"), d("Rangamati", "রাঙ্গামাটি"),
    ],
  },
  {
    value: "Rajshahi",
    label: "রাজশাহী",
    districts: [
      d("Bogura", "বগুড়া"), d("Joypurhat", "জয়পুরহাট"), d("Naogaon", "নওগাঁ"), d("Natore", "নাটোর"),
      d("Chapainawabganj", "চাঁপাইনবাবগঞ্জ"), d("Pabna", "পাবনা"), d("Rajshahi", "রাজশাহী"), d("Sirajganj", "সিরাজগঞ্জ"),
    ],
  },
  {
    value: "Khulna",
    label: "খুলনা",
    districts: [
      d("Bagerhat", "বাগেরহাট"), d("Chuadanga", "চুয়াডাঙ্গা"), d("Jashore", "যশোর"), d("Jhenaidah", "ঝিনাইদহ"),
      d("Khulna", "খুলনা"), d("Kushtia", "কুষ্টিয়া"), d("Magura", "মাগুরা"), d("Meherpur", "মেহেরপুর"),
      d("Narail", "নড়াইল"), d("Satkhira", "সাতক্ষীরা"),
    ],
  },
  {
    value: "Barishal",
    label: "বরিশাল",
    districts: [
      d("Barguna", "বরগুনা"), d("Barishal", "বরিশাল"), d("Bhola", "ভোলা"), d("Jhalokati", "ঝালকাঠি"),
      d("Patuakhali", "পটুয়াখালী"), d("Pirojpur", "পিরোজপুর"),
    ],
  },
  {
    value: "Sylhet",
    label: "সিলেট",
    districts: [d("Habiganj", "হবিগঞ্জ"), d("Moulvibazar", "মৌলভীবাজার"), d("Sunamganj", "সুনামগঞ্জ"), d("Sylhet", "সিলেট")],
  },
  {
    value: "Rangpur",
    label: "রংপুর",
    districts: [
      d("Dinajpur", "দিনাজপুর"), d("Gaibandha", "গাইবান্ধা"), d("Kurigram", "কুড়িগ্রাম"), d("Lalmonirhat", "লালমনিরহাট"),
      d("Nilphamari", "নীলফামারী"), d("Panchagarh", "পঞ্চগড়"), d("Rangpur", "রংপুর"), d("Thakurgaon", "ঠাকুরগাঁও"),
    ],
  },
  {
    value: "Mymensingh",
    label: "ময়মনসিংহ",
    districts: [d("Jamalpur", "জামালপুর"), d("Mymensingh", "ময়মনসিংহ"), d("Netrokona", "নেত্রকোণা"), d("Sherpur", "শেরপুর")],
  },
];

const divisionMap = new Map(DIVISIONS.map((x) => [x.value, x]));
const districtLabelMap = new Map(DIVISIONS.flatMap((x) => x.districts.map((y) => [y.value, y.label] as const)));

/** Districts of one division (empty array for unknown/"all"). */
export function getDistricts(divisionValue: string): District[] {
  return divisionMap.get(divisionValue)?.districts ?? [];
}
export function getDivisionLabel(value: string): string {
  return divisionMap.get(value)?.label ?? value;
}
export function getDistrictLabel(value: string): string {
  return districtLabelMap.get(value) ?? value;
}

/** Area suggestions for Dhaka (areas stay free text everywhere else). */
export const DHAKA_AREAS = [
  "Dhanmondi", "Mohammadpur", "Mirpur", "Tejgaon", "Uttara", "Mohakhali", "Banani", "Gulshan", "Motijheel",
  "Paltan", "Old Dhaka", "Lalbagh", "Azimpur", "Hazaribagh", "Shyampur", "Jatrabari", "Sayedabad", "Khilgaon",
  "Rampura", "Badda", "Bhatara", "Shahjahanpur", "Malibagh", "Nakhhalpara", "Nikunja", "Kuril", "Baridhara",
  "Savar", "Keraniganj", "Tongi", "Gazipur",
] as const;

/** "ঢাকা → ঢাকা → মিরপুর" */
export function formatLocation(p: { division: string; district: string; area?: string }): string {
  return [getDivisionLabel(p.division), getDistrictLabel(p.district), p.area].filter(Boolean).join(" → ");
}
