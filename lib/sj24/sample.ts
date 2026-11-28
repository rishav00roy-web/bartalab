// Sample content for the design preview. None of it is real news.
// Categories and districts will move to the database so editors can change them.
import type { Text } from "./i18n";

export type Category = { slug: string; name: Text };

export const categories: Category[] = [
  { slug: "assam", name: { en: "Assam", as: "অসম" } },
  { slug: "northeast", name: { en: "Northeast", as: "উত্তৰ-পূব" } },
  { slug: "national", name: { en: "National", as: "ৰাষ্ট্ৰীয়" } },
  { slug: "international", name: { en: "International", as: "আন্তঃৰাষ্ট্ৰীয়" } },
  { slug: "politics", name: { en: "Politics", as: "ৰাজনীতি" } },
  { slug: "business", name: { en: "Business", as: "ব্যৱসায়" } },
  { slug: "agriculture", name: { en: "Agriculture", as: "কৃষি" } },
  { slug: "education", name: { en: "Education", as: "শিক্ষা" } },
  { slug: "health", name: { en: "Health", as: "স্বাস্থ্য" } },
  { slug: "environment", name: { en: "Environment", as: "পৰিৱেশ" } },
  { slug: "technology", name: { en: "Technology", as: "প্ৰযুক্তি" } },
  { slug: "sports", name: { en: "Sports", as: "খেল" } },
  { slug: "entertainment", name: { en: "Entertainment", as: "মনোৰঞ্জন" } },
  { slug: "culture", name: { en: "Culture", as: "সংস্কৃতি" } },
  { slug: "opinion", name: { en: "Opinion", as: "মতামত" } },
  { slug: "special-reports", name: { en: "Special Reports", as: "বিশেষ প্ৰতিবেদন" } },
];

export type District = { slug: string; name: Text };

// 35 districts. Confirm against the state government list before launch.
export const districts: District[] = [
  ["bajali", "Bajali", "বাজালী"],
  ["baksa", "Baksa", "বাক্সা"],
  ["barpeta", "Barpeta", "বৰপেটা"],
  ["biswanath", "Biswanath", "বিশ্বনাথ"],
  ["bongaigaon", "Bongaigaon", "বঙাইগাঁও"],
  ["cachar", "Cachar", "কাছাৰ"],
  ["charaideo", "Charaideo", "চৰাইদেউ"],
  ["chirang", "Chirang", "চিৰাং"],
  ["darrang", "Darrang", "দৰং"],
  ["dhemaji", "Dhemaji", "ধেমাজি"],
  ["dhubri", "Dhubri", "ধুবুৰী"],
  ["dibrugarh", "Dibrugarh", "ডিব্ৰুগড়"],
  ["dima-hasao", "Dima Hasao", "ডিমা হাছাও"],
  ["goalpara", "Goalpara", "গোৱালপাৰা"],
  ["golaghat", "Golaghat", "গোলাঘাট"],
  ["hailakandi", "Hailakandi", "হাইলাকান্দি"],
  ["hojai", "Hojai", "হোজাই"],
  ["jorhat", "Jorhat", "যোৰহাট"],
  ["kamrup", "Kamrup", "কামৰূপ"],
  ["kamrup-metropolitan", "Kamrup Metropolitan", "কামৰূপ মহানগৰ"],
  ["karbi-anglong", "Karbi Anglong", "কাৰ্বি আংলং"],
  ["kokrajhar", "Kokrajhar", "কোকৰাঝাৰ"],
  ["lakhimpur", "Lakhimpur", "লখিমপুৰ"],
  ["majuli", "Majuli", "মাজুলী"],
  ["morigaon", "Morigaon", "মৰিগাঁও"],
  ["nagaon", "Nagaon", "নগাঁও"],
  ["nalbari", "Nalbari", "নলবাৰী"],
  ["sivasagar", "Sivasagar", "শিৱসাগৰ"],
  ["sonitpur", "Sonitpur", "শোণিতপুৰ"],
  ["south-salmara-mankachar", "South Salmara-Mankachar", "দক্ষিণ শালমাৰা-মানকাচৰ"],
  ["sribhumi", "Sribhumi", "শ্ৰীভূমি"],
  ["tamulpur", "Tamulpur", "তামুলপুৰ"],
  ["tinsukia", "Tinsukia", "তিনিচুকীয়া"],
  ["udalguri", "Udalguri", "ওদালগুৰি"],
  ["west-karbi-anglong", "West Karbi Anglong", "পশ্চিম কাৰ্বি আংলং"],
].map(([slug, en, as]) => ({ slug, name: { en, as } }));

export type Story = {
  slug: string;
  category: string;
  district?: string;
  kind: "story" | "video" | "photo";
  headline: Text;
  subheadline: Text;
  body: Text[];
  reporter: string;
  publishedAt: string;
  updatedAt?: string;
  correction?: Text;
  caption?: Text;
  credit?: string;
  tags: string[];
  breaking?: boolean;
  reads: number;
  sponsored?: boolean;
  /** Placeholder picture tint until real photos exist. */
  tone: "navy" | "red" | "saffron" | "green" | "teal" | "plum";
};

const placeholderBody: Text[] = [
  {
    en: "This is sample text that shows how an SJ24 article will look. A real story would open with the most important facts: what happened, where, when and who it affects.",
    as: "এইটো এটা নমুনা লেখা, SJ24 ৰ বাতৰি কেনেকুৱা দেখা যাব তাক দেখুৱাবলৈ। প্ৰকৃত বাতৰিত প্ৰথমতে আটাইতকৈ গুৰুত্বপূৰ্ণ তথ্য থাকিব।",
  },
  {
    en: "The following paragraphs would add context, quotes from the people involved and what happens next. Editors check every article before it is published.",
    as: "পিছৰ অনুচ্ছেদবোৰত প্ৰসংগ, সংশ্লিষ্ট লোকৰ মন্তব্য আৰু পৰৱৰ্তী পদক্ষেপৰ কথা থাকিব। প্ৰকাশৰ আগতে সম্পাদকে প্ৰতিটো বাতৰি পৰীক্ষা কৰে।",
  },
  {
    en: "Reporters file stories from their district through the SJ24 newsroom, attach photos and videos, and follow the story's status until it goes live.",
    as: "প্ৰতিবেদকসকলে নিজৰ জিলাৰ পৰা SJ24 নিউজৰুমৰ জৰিয়তে বাতৰি, ফটো আৰু ভিডিঅ' পঠিয়ায়।",
  },
];

type Seed = Omit<Story, "body" | "tags" | "reporter"> & { reporter?: string; tags?: string[] };

const seeds: Seed[] = [
  {
    slug: "brahmaputra-water-level-rises-after-heavy-rain",
    category: "assam",
    district: "dibrugarh",
    kind: "story",
    breaking: true,
    headline: {
      en: "Brahmaputra rises after two days of heavy rain upstream",
      as: "উজনিত দুদিনীয়া প্ৰবল বৰষুণৰ পিছত ব্ৰহ্মপুত্ৰৰ পানী বাঢ়িছে",
    },
    subheadline: {
      en: "District administration puts relief camps on standby in low-lying areas",
      as: "নিম্নাঞ্চলত সাহায্য শিবিৰ সাজু ৰাখিছে জিলা প্ৰশাসনে",
    },
    caption: { en: "The riverbank near Dibrugarh (sample picture)", as: "ডিব্ৰুগড়ৰ ওচৰৰ নদীৰ পাৰ (নমুনা ছবি)" },
    credit: "SJ24",
    publishedAt: "2026-11-28T08:15:00+05:30",
    updatedAt: "2026-11-28T11:40:00+05:30",
    reads: 9800,
    tone: "navy",
  },
  {
    slug: "jorhat-farmers-prepare-for-rabi-season",
    category: "agriculture",
    district: "jorhat",
    kind: "story",
    headline: {
      en: "Jorhat farmers prepare fields for the rabi season",
      as: "ৰবি শস্যৰ বাবে পথাৰ সাজু কৰিছে যোৰহাটৰ খেতিয়কে",
    },
    subheadline: {
      en: "Mustard and potato sowing begins in several villages",
      as: "কেইবাখনো গাঁৱত সৰিয়হ আৰু আলুৰ খেতি আৰম্ভ",
    },
    publishedAt: "2026-11-28T07:30:00+05:30",
    reads: 4200,
    tone: "green",
  },
  {
    slug: "guwahati-schools-science-fair",
    category: "education",
    district: "kamrup-metropolitan",
    kind: "photo",
    headline: {
      en: "Students show 120 projects at Guwahati science fair",
      as: "গুৱাহাটীৰ বিজ্ঞান মেলাত ছাত্ৰ-ছাত্ৰীৰ ১২০টা প্ৰকল্প",
    },
    subheadline: { en: "Water and farming ideas lead the entries", as: "পানী আৰু কৃষি সম্পৰ্কীয় ধাৰণা আগত" },
    publishedAt: "2026-11-28T10:05:00+05:30",
    reads: 3100,
    tone: "teal",
  },
  {
    slug: "majuli-river-island-ferry-timings",
    category: "assam",
    district: "majuli",
    kind: "video",
    breaking: true,
    headline: {
      en: "Majuli ferry timings change for winter",
      as: "শীতকালৰ বাবে মাজুলীৰ নাৱৰ সময় সলনি",
    },
    subheadline: { en: "Last ferry now leaves an hour earlier", as: "শেষৰ নাওখন এতিয়া এঘণ্টা আগতে এৰিব" },
    publishedAt: "2026-11-27T18:20:00+05:30",
    reads: 6700,
    tone: "saffron",
    correction: {
      en: "An earlier version gave the wrong departure ghat. It has been corrected.",
      as: "আগৰ সংস্কৰণত ঘাটৰ নাম ভুল আছিল। শুধৰোৱা হৈছে।",
    },
  },
  {
    slug: "shillong-tourism-season",
    category: "northeast",
    kind: "story",
    headline: {
      en: "Meghalaya expects a busy winter tourism season",
      as: "মেঘালয়ত শীতকালীন পৰ্যটনৰ ব্যস্ত বতৰৰ আশা",
    },
    subheadline: { en: "Homestays report early bookings", as: "হোমষ্টেত আগতীয়া বুকিং" },
    publishedAt: "2026-11-27T16:00:00+05:30",
    reads: 2500,
    tone: "plum",
  },
  {
    slug: "arunachal-road-link",
    category: "northeast",
    kind: "story",
    headline: {
      en: "New road link to shorten travel between two Arunachal towns",
      as: "অৰুণাচলৰ দুখন নগৰৰ মাজৰ যাত্ৰা চুটি কৰিব নতুন পথে",
    },
    subheadline: { en: "Work is due to finish next year", as: "অহা বছৰ কাম শেষ হোৱাৰ কথা" },
    publishedAt: "2026-11-27T13:10:00+05:30",
    reads: 1900,
    tone: "teal",
  },
  {
    slug: "assam-tea-auction-prices",
    category: "business",
    kind: "story",
    headline: {
      en: "Tea auction prices steady this week in Guwahati",
      as: "গুৱাহাটীত এই সপ্তাহত চাহৰ নিলামৰ দাম স্থিৰ",
    },
    subheadline: { en: "Small growers watch the market closely", as: "ক্ষুদ্ৰ চাহ খেতিয়কে বজাৰলৈ চকু ৰাখিছে" },
    publishedAt: "2026-11-27T12:00:00+05:30",
    reads: 3600,
    tone: "green",
  },
  {
    slug: "nagaon-district-hospital-new-ward",
    category: "health",
    district: "nagaon",
    kind: "story",
    headline: {
      en: "Nagaon hospital opens a new children's ward",
      as: "নগাঁও চিকিৎসালয়ত শিশুৰ বাবে নতুন ৱাৰ্ড",
    },
    subheadline: { en: "Thirty beds added for district patients", as: "জিলাৰ ৰোগীৰ বাবে ত্ৰিশখন বিচনা" },
    publishedAt: "2026-11-27T10:45:00+05:30",
    reads: 2800,
    tone: "red",
  },
  {
    slug: "kaziranga-winter-birds",
    category: "environment",
    district: "golaghat",
    kind: "photo",
    headline: {
      en: "Winter birds return to the wetlands near Kaziranga",
      as: "কাজিৰঙাৰ ওচৰৰ জলাশয়লৈ উভতি আহিছে শীতৰ চৰাই",
    },
    subheadline: { en: "Birdwatchers count more species than last year", as: "যোৱা বছৰতকৈ অধিক প্ৰজাতি গণনা" },
    publishedAt: "2026-11-26T17:30:00+05:30",
    reads: 5400,
    tone: "teal",
  },
  {
    slug: "under-17-football-final",
    category: "sports",
    district: "sivasagar",
    kind: "video",
    headline: {
      en: "Sivasagar reaches the state under-17 football final",
      as: "ৰাজ্যিক অনূৰ্ধ্ব-১৭ ফুটবলৰ ফাইনেলত শিৱসাগৰ",
    },
    subheadline: { en: "Final to be played on Sunday", as: "দেওবাৰে ফাইনেল খেল" },
    publishedAt: "2026-11-26T15:00:00+05:30",
    reads: 4900,
    tone: "saffron",
  },
  {
    slug: "bhaona-festival-majuli",
    category: "culture",
    district: "majuli",
    kind: "photo",
    headline: {
      en: "Satras prepare for the winter bhaona season",
      as: "শীতকালীন ভাওনাৰ বাবে সাজু হৈছে সত্ৰসমূহ",
    },
    subheadline: { en: "Young performers rehearse every evening", as: "যুৱ শিল্পীসকলে প্ৰতি সন্ধিয়া অনুশীলন কৰিছে" },
    publishedAt: "2026-11-26T12:20:00+05:30",
    reads: 3300,
    tone: "plum",
  },
  {
    slug: "village-roads-and-the-last-mile",
    category: "opinion",
    kind: "story",
    reporter: "Editorial Board",
    headline: {
      en: "Editorial: Village roads decide who reaches the hospital in time",
      as: "সম্পাদকীয়: গাঁৱৰ পথেই নিৰ্ণয় কৰে সময়মতে চিকিৎসালয় পোৱাটো",
    },
    subheadline: { en: "Rural connectivity needs steady attention", as: "গ্ৰাম্য যোগাযোগলৈ নিৰন্তৰ মনোযোগ প্ৰয়োজন" },
    publishedAt: "2026-11-26T09:00:00+05:30",
    reads: 2100,
    tone: "navy",
  },
  {
    slug: "self-help-groups-weaving",
    category: "special-reports",
    district: "barpeta",
    kind: "story",
    headline: {
      en: "Special report: How Barpeta's weaving groups sell beyond the state",
      as: "বিশেষ প্ৰতিবেদন: বৰপেটাৰ তাঁতশাল গোটে কেনেকৈ ৰাজ্যৰ বাহিৰত বিক্ৰী কৰে",
    },
    subheadline: { en: "Online orders reach three new states", as: "অনলাইন অৰ্ডাৰ তিনিখন নতুন ৰাজ্যলৈ" },
    publishedAt: "2026-11-25T18:00:00+05:30",
    reads: 6100,
    tone: "red",
  },
  {
    slug: "digital-payments-weekly-markets",
    category: "technology",
    district: "tinsukia",
    kind: "story",
    headline: {
      en: "More traders at weekly markets accept digital payments",
      as: "সাপ্তাহিক বজাৰত ডিজিটেল পেমেণ্ট লোৱা ব্যৱসায়ী বাঢ়িছে",
    },
    subheadline: { en: "Small vendors say QR codes speed up sales", as: "কিউআৰ ক'ডে বিক্ৰী সোনকাল কৰে বুলি সৰু ব্যৱসায়ীৰ মত" },
    publishedAt: "2026-11-25T14:30:00+05:30",
    reads: 1700,
    tone: "teal",
  },
  {
    slug: "national-rail-timetable",
    category: "national",
    kind: "story",
    breaking: true,
    headline: {
      en: "New rail timetable adds two trains for the Northeast",
      as: "নতুন ৰেল সময়সূচীত উত্তৰ-পূবৰ বাবে দুখন ৰেল",
    },
    subheadline: { en: "Changes take effect next month", as: "অহা মাহৰ পৰা সলনি কাৰ্যকৰী" },
    publishedAt: "2026-11-25T11:00:00+05:30",
    reads: 7200,
    tone: "navy",
  },
  {
    slug: "climate-talks-summary",
    category: "international",
    kind: "story",
    headline: {
      en: "What this year's climate talks mean for flood-prone regions",
      as: "বানপীড়িত অঞ্চলৰ বাবে এইবাৰৰ জলবায়ু আলোচনাৰ অৰ্থ",
    },
    subheadline: { en: "An explainer for readers in Assam", as: "অসমৰ পাঠকৰ বাবে এক ব্যাখ্যা" },
    publishedAt: "2026-11-24T19:00:00+05:30",
    reads: 2300,
    tone: "green",
  },
];

const reporters = ["Ananya Bora", "Rupam Gogoi", "Priyanka Das", "Kamal Hazarika", "Nilima Saikia"];

export const stories: Story[] = seeds.map((s, i) => ({
  ...s,
  reporter: s.reporter ?? reporters[i % reporters.length],
  tags: s.tags ?? [s.category, ...(s.district ? [s.district] : [])],
  body: placeholderBody,
}));

export const byDate = [...stories].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const mostRead = [...stories].sort((a, b) => b.reads - a.reads).slice(0, 5);
export const breaking = byDate.filter((s) => s.breaking);

export function categoryOf(slug: string) {
  return categories.find((c) => c.slug === slug);
}
export function districtOf(slug?: string) {
  return slug ? districts.find((d) => d.slug === slug) : undefined;
}
export function storyOf(slug: string) {
  return stories.find((s) => s.slug === slug);
}
