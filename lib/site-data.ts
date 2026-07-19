export const orgInfo = {
  name: "Sanatan Samaj Australia",
  shortName: "SSA",
  mantra: "धर्मो रक्षति रक्षितः",
  associationNumber: "A06140",
  phone: "0433 677 022",
  email: "sanatansamajaus@gmail.com",
  addressLines: ["47 Murrijinelle Circuit,", "Bonner ACT 2914, Australia"],
  bank: {
    accountName: "Sanatan Samaj Australia",
    bsb: "032713",
    accountNumber: "508265",
  },
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/membership", label: "Membership" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

export const heroSlides = [
  {
    sanskrit: '"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"',
    translation:
      "You have a right to your actions alone, never to their fruits.",
    source: "Bhagavad Gita 2.47",
    image: "/krishna.webp",
  },
  {
    sanskrit: '"वसुधैव कुटुम्बकम्"',
    translation: "The world is one family.",
    source: "Maha Upanishad",
    image: "/dashain.webp",
  },
  {
    sanskrit: '"ॐ नमः शिवाय"',
    translation: "I bow to Shiva, the auspicious one within all.",
    source: "Shiva Panchakshara Mantra",
    image: "/shiva.jpg",
  },
  {
    sanskrit: '"सत्यमेव जयते"',
    translation: "Truth alone triumphs.",
    source: "Mundaka Upanishad",
    image: "/teej.webp",
  },
];

export const features = [
  {
    title: "Spiritual Events",
    desc: "Experience sacred ceremonies and spiritual gatherings that connect us to our roots.",
  },
  {
    title: "Community Support",
    desc: "Join a loving community dedicated to personal growth and mutual support.",
  },
  {
    title: "Cultural Programs",
    desc: "Celebrate and preserve the rich traditions of Hindu culture through engaging programs.",
  },
];

export const yearEvents = [
  {
    name: "Maghe Sankranti",
    date: "Jan 14, 2026",
    desc: "Marks the start of longer days, celebrated with warm foods and holy dips.",
  },
  {
    name: "Maha Shivaratri",
    date: "Feb 15, 2026",
    desc: "Night-long vigil and prayers dedicated to Lord Shiva.",
  },
  {
    name: "Holi (Fagu Purnima)",
    date: "Mar 3, 2026",
    desc: "Festival of colours celebrating the triumph of good over evil.",
  },
  {
    name: "Nepali New Year 2083",
    date: "Apr 14, 2026",
    desc: "Community gathering to welcome the new year.",
  },
  {
    name: "Buddha Jayanti",
    date: "May 1, 2026",
    desc: "Celebrating the birth of Lord Buddha.",
  },
  {
    name: "Ganga Dashahara",
    date: "Jun 19, 2026",
    desc: "Honouring the sacred descent of the river Ganga.",
  },
  {
    name: "Guru Purnima",
    date: "Jul 18, 2026",
    desc: "A day to honour teachers and spiritual guides.",
  },
  {
    name: "Teej",
    date: "Aug 15, 2026",
    desc: "Festival dedicated to Goddess Parvati.",
  },
  {
    name: "Shree Krishna Janmashtami",
    date: "Sep 5, 2026",
    desc: "Celebrating the birth of Lord Krishna.",
  },
  {
    name: "Dashain",
    date: "Oct 11–20, 2026",
    desc: "The biggest and longest Hindu festival of the year.",
  },
  {
    name: "Tihar",
    date: "Nov 8–12, 2026",
    desc: "Festival of lights honouring Goddess Lakshmi and siblings.",
  },
  {
    name: "Vivaha Panchami",
    date: "Dec 13, 2026",
    desc: "Commemorating the divine marriage of Ram and Sita.",
  },
];

// Upcoming festivals shown on the home page (subset of the full year calendar)
export const upcomingFestivals = yearEvents.slice(7, 11);

export const objectives = [
  {
    n: "1",
    text: "Spread Sanatan culture and Sanatan religious scriptures.",
  },
  {
    n: "2",
    text: "Encourage observance and celebration of Hindu festivals.",
  },
  {
    n: "3",
    text: "Build a Pashupatinath Temple in the ACT for Sanatan religious activities.",
  },
  {
    n: "4",
    text: "Collaborate with other associations in organising activities to advance community welfare.",
  },
];

export const team = ["President", "Secretary", "Treasurer", "Cultural Coordinator"];

export const benefits = [
  "Access to spiritual events, pujas and festival celebrations",
  "A supportive community that stands with you and your family",
  "Priority updates on the Pashupatinath Temple project",
  "Opportunities to volunteer and contribute through seva",
];

export const membershipPlans = [
  { key: "single", label: "Annual Member – Single", price: "$15 pa", amount: 15 },
  { key: "family", label: "Annual Member – Family", price: "$25 pa", amount: 25 },
  { key: "life", label: "Life Member", price: "$250 one-off", amount: 250 },
] as const;

export const donationAmounts = [25, 50, 100, 250];

export const socials = [
  { label: "Facebook", initial: "f" },
  { label: "Instagram", initial: "i" },
  { label: "Twitter", initial: "t" },
];

export type PastEvent = {
  slug: string;
  day: string;
  month: string;
  dateLabel: string;
  title: string;
  location: string;
  desc: string;
  photoCount: number;
  cover: string;
};

export const pastEvents: PastEvent[] = [
  {
    slug: "nepali-new-year-2026",
    day: "14",
    month: "APR",
    dateLabel: "April 14, 2026",
    title: "Nepali New Year 2083 Celebration",
    location: "Yarralumla, Canberra ACT",
    desc: "Our community welcomed the year 2083 with prayers, traditional food, music and dance at Yarralumla.",
    photoCount: 12,
    cover: "/dashain.webp",
  },
  {
    slug: "gai-jatra-2025",
    day: "10",
    month: "AUG",
    dateLabel: "August 10, 2025",
    title: "Gai Jatra Community Gathering",
    location: "Bonner Community Hall, ACT",
    desc: "A joyful procession and community feast honouring the Gai Jatra tradition at Bonner Community Hall.",
    photoCount: 12,
    cover: "/teej.webp",
  },
  {
    slug: "janmashtami-2025",
    day: "16",
    month: "AUG",
    dateLabel: "August 16, 2025",
    title: "Krishna Janmashtami Celebration",
    location: "Yarralumla, Canberra ACT",
    desc: "Devotional singing, a midnight puja and prasad marked the birth of Lord Krishna.",
    photoCount: 12,
    cover: "/krishna.webp",
  },
];

export function getPastEvent(slug: string) {
  return pastEvents.find((e) => e.slug === slug);
}
