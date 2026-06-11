const siteUrl = "https://winnersfoundationschool.com";

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.9 },
  { path: "/admissions", priority: 0.9 },
  { path: "/apply", priority: 0.8 },
  { path: "/gallery", priority: 0.7 },
  { path: "/careers", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

export default function sitemap() {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.priority,
  }));
}
