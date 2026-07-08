/** Splits a `/`-separated folder path into its segments, dropping empty ones from leading/trailing/doubled slashes. */
export function splitFolderPath(path: string): string[] {
  return path.split('/').filter(Boolean);
}
