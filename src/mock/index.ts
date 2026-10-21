import goldPrice from "./goldPrice.json";
import silverPrice from "./silverPrice.json";
import plans from "./plans.json";
import banners from "./banners.json";
import faq from "./faq.json";
import testimonials from "./testimonials.json";
import news from "./news.json";
import transactions from "./transactions.json";
import users from "./users.json";
import orders from "./orders.json";
import kyc from "./kyc.json";
import messages from "./messages.json";
import settings from "./settings.json";

export type Price = { today: number; yesterday: number; updatedAt: string; history: { date: string; price: number }[] };
export type Plan = { id: string; name: string; metal: string; price: number; period: string; features: string[]; popular?: boolean };
export type Banner = { id: string; image: string; title: string; subtitle: string; enabled: boolean };
export type Faq = { id: string; q: string; a: string };
export type Testimonial = { id: string; name: string; city: string; rating: number; review: string; photo: string };
export type News = { id: string; title: string; category: string; date: string; excerpt: string };
export type Txn = { id: string; userEmail: string; type: string; metal: string; grams: number; amount: number; date: string; status: string };
export type User = {
  id: string; name: string; email: string; phone: string; password: string; active: boolean;
  wallet: number; gold: number; silver: number; invested: number;
  pan: string; aadhaar: string; address: string; bank: string; kyc: string;
};
export type Order = { id: string; userEmail: string; item: string; qty: number; status: string; date: string };
export type Kyc = { id: string; userEmail: string; pan: string; aadhaar: string; status: string; date: string };
export type Message = { id: string; name: string; email: string; subject: string; message: string; date: string; reply?: string };
export type Settings = {
  businessName: string; address: string; phone: string; email: string; footer: string;
  social: { facebook: string; instagram: string; twitter: string; youtube: string };
  walletRequests: { id: string; userEmail: string; type: string; amount: number; status: string; date: string }[];
};

export const defaults = {
  goldPrice: goldPrice as Price,
  silverPrice: silverPrice as Price,
  plans: plans as Plan[],
  banners: banners as Banner[],
  faq: faq as Faq[],
  testimonials: testimonials as Testimonial[],
  news: news as News[],
  transactions: transactions as Txn[],
  users: users as User[],
  orders: orders as Order[],
  kyc: kyc as Kyc[],
  messages: messages as Message[],
  settings: settings as Settings,
};
export type Defaults = typeof defaults;
