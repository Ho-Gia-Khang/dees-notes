export type Icon = "media" | "home" | "document" | "player" | "upload" | "library" | "editor";

export interface ApiListResponse<T> {
  items: T[];
  total: number;
}
