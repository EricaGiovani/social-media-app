export function getReturnTo(fallback = "/feed") {
  const value = new URLSearchParams(window.location.search).get("returnTo");
  return value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : fallback;
}