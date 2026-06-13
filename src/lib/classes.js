export const CLASS_OPTIONS = [
  "Nursery 1",
  "Nursery 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
];

const CLASS_ALIASES = new Map([
  ["JSS1", "JSS 1"],
  ["JSS2", "JSS 2"],
  ["JSS3", "JSS 3"],
  ["JS 1", "JSS 1"],
  ["JS 2", "JSS 2"],
  ["JS 3", "JSS 3"],
  ["SS1", "SSS 1"],
  ["SS2", "SSS 2"],
  ["SS3", "SSS 3"],
  ["SS 1", "SSS 1"],
  ["SS 2", "SSS 2"],
  ["SS 3", "SSS 3"],
  ["SSS1", "SSS 1"],
  ["SSS2", "SSS 2"],
  ["SSS3", "SSS 3"],
]);

function cleanClassName(className) {
  return String(className || "")
    .trim()
    .replace(/\s+/g, " ");
}

export function normalizeClassName(className) {
  const cleaned = cleanClassName(className);
  if (!cleaned) return "";

  return CLASS_ALIASES.get(cleaned.toUpperCase()) || cleaned;
}

export function normalizeClassList(classes = []) {
  return Array.from(
    new Set(
      classes.map((className) => normalizeClassName(className)).filter(Boolean),
    ),
  );
}

export function classQueryValues(classes = []) {
  const normalizedClasses = normalizeClassList(classes);
  const values = new Set(normalizedClasses);

  for (const [alias, canonical] of CLASS_ALIASES.entries()) {
    if (values.has(canonical)) values.add(alias);
  }

  return Array.from(values);
}
