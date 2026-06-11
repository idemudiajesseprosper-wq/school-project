const siteUrl = "https://winnersfoundationschool.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/student/",
        "/teacher/",
        "/applicant/",
        "/login/",
        "/verify-email",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
