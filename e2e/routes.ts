import { ARTICLES } from "../src/data/articles";

export const ROUTES = [
  "/",
  "/markets",
  "/accounts",
  "/platforms",
  "/tools",
  "/education",
  ...ARTICLES.map((a) => `/education/${a.slug}`),
  "/calendar",
  "/open-account",
  "/contact",
  "/about",
  "/legal",
];
