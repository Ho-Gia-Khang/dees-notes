export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeFileName(fileName?: string): string {
  if (!fileName) {
    return "";
  }

  return fileName.replace(/\s+/g, "_");
}
