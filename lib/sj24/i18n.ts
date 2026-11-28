export type Lang = "en" | "as";
export type Text = { en: string; as: string };

export function getLang(value: string | string[] | undefined): Lang {
  return value === "as" ? "as" : "en";
}

export function t(text: Text, lang: Lang) {
  return text[lang] || text.en;
}

/** Adds ?lang=as to internal links while the reader is in Assamese. */
export function href(path: string, lang: Lang) {
  if (lang === "en") return path;
  return path.includes("?") ? `${path}&lang=as` : `${path}?lang=as`;
}

export const ui = {
  tagline: { en: "The truth is rising.", as: "এখন দেশ, অজস্ৰ কণ্ঠ।" },
  breaking: { en: "Breaking", as: "শেহতীয়া" },
  search: { en: "Search news", as: "বাতৰি বিচাৰক" },
  latest: { en: "Latest news", as: "শেহতীয়া বাতৰি" },
  mostRead: { en: "Most read", as: "সৰ্বাধিক পঠিত" },
  trending: { en: "Trending", as: "আলোচিত" },
  districts: { en: "District news", as: "জিলাৰ বাতৰি" },
  allDistricts: { en: "All districts", as: "সকলো জিলা" },
  northeast: { en: "Across the Northeast", as: "উত্তৰ-পূবৰ বাতৰি" },
  video: { en: "Video news", as: "ভিডিঅ' বাতৰি" },
  gallery: { en: "Photo gallery", as: "ফটো গেলেৰী" },
  opinion: { en: "Editorial and opinion", as: "সম্পাদকীয় আৰু মতামত" },
  special: { en: "Special reports", as: "বিশেষ প্ৰতিবেদন" },
  rural: { en: "Rural and community", as: "গ্ৰাম্য আৰু সমাজ" },
  readMore: { en: "Read more", as: "আৰু পঢ়ক" },
  by: { en: "By", as: "প্ৰতিবেদক" },
  share: { en: "Share", as: "শ্বেয়াৰ" },
  print: { en: "Print", as: "প্ৰিণ্ট" },
  related: { en: "Related news", as: "সম্পৰ্কীয় বাতৰি" },
  correction: { en: "Correction", as: "সংশোধন" },
  sponsored: { en: "Sponsored", as: "পৃষ্ঠপোষকতা" },
  advert: { en: "Advertisement", as: "বিজ্ঞাপন" },
  reporterTitle: { en: "Report from your district", as: "আপোনাৰ জিলাৰ পৰা খবৰ দিয়ক" },
  reporterBody: {
    en: "SJ24 is building a network of district reporters across Assam. Send us your details and an editor will get in touch.",
    as: "SJ24 এ অসমৰ সকলো জিলাত প্ৰতিবেদকৰ এক নেটৱৰ্ক গঢ়িছে। আপোনাৰ বিৱৰণ পঠিয়াওক, এজন সম্পাদকে যোগাযোগ কৰিব।",
  },
  joinTeam: { en: "Become a reporter", as: "প্ৰতিবেদক হওক" },
  preview: {
    en: "Design preview: every story on this site is sample text, not real news.",
    as: "ডিজাইনৰ নমুনা: এই ছাইটৰ সকলো বাতৰি নমুনা লেখা, প্ৰকৃত বাতৰি নহয়।",
  },
  publisher: {
    en: "A digital news initiative of Gousamuh Gramaya Foundation, a Section 8 company.",
    as: "গৌসমূহ গ্ৰাম্য ফাউণ্ডেশ্যনৰ এক ডিজিটেল বাতৰি উদ্যোগ।",
  },
  noStories: { en: "No stories here yet.", as: "ইয়াত এতিয়াও কোনো বাতৰি নাই।" },
  results: { en: "Results for", as: "ফলাফল" },
  dark: { en: "Dark mode", as: "আন্ধাৰ ম'ড" },
  newsroom: { en: "Newsroom login", as: "নিউজৰুম লগইন" },
} satisfies Record<string, Text>;
