export function publicPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (!basePath || !path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  return `${basePath}${path}`;
}
