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
