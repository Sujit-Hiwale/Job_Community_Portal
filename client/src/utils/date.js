export function timeAgo(input) {
  if (!input) return "just now";

  let date =
    input instanceof Date
      ? input
      : typeof input === "number"
      ? new Date(input)
      : typeof input === "string"
      ? new Date(input)
      : input?.seconds
      ? new Date(input.seconds * 1000)
      : null;

  if (!date || isNaN(date.getTime())) return "just now";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const units = [
    { name: "week", secs: 604800 },
    { name: "day", secs: 86400 },
    { name: "hour", secs: 3600 },
    { name: "minute", secs: 60 },
    { name: "second", secs: 1 },
  ];

  for (let u of units) {
    const v = Math.floor(seconds / u.secs);
    if (v >= 1) return `${v} ${u.name}${v > 1 ? "s" : ""} ago`;
  }

  return "just now";
}

function normalizeToDate(input) {
  if (!input) return null;

  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(input);
  if (typeof input === "string") return new Date(input);

  // Firestore Admin SDK
  if (input._seconds) return new Date(input._seconds * 1000);
  if (input.seconds) return new Date(input.seconds * 1000);

  return null;
}

export function formatBlogTime(input) {
  const date = normalizeToDate(input);
  if (!date || isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return "Just now";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
