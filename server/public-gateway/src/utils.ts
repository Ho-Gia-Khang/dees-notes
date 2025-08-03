import type { ApiListRequest } from "./types/shared/common";

export function getLocalStorage(key: string): any | undefined {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(`Error parsing localStorage value for key "${key}":`, e);
      return undefined;
    }
  }
}

export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting localStorage value for key "${key}":`, e);
  }
}

export function clearLocalStorage(keys: string[]) {
  keys.forEach((key) => localStorage.removeItem(key));
}

export function delayMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildSearchParams<T extends ApiListRequest>(
  request: T,
  customParams?: URLSearchParams,
): URLSearchParams | undefined {
  if (!request) {
    return;
  }

  let params = customParams;
  if (!customParams) {
    params = new URLSearchParams();
  }

  params!.append("pageSize", request.pageSize.toString());
  params!.append("page", request.page.toString());

  // if (request.sorts?.length) {
  //   const sorts: string[] = [];
  //   request.sorts.forEach((s) => {
  //     if (s.order === "ascend") {
  //       sorts.push(`${s.field} asc`);
  //     } else if (s.order === "descend") {
  //       sorts.push(`${s.field} desc`);
  //     }
  //   });
  //   params!.append("sort", JSON.stringify(sorts));
  // }

  // if (request.search?.length) {
  //   const search = request.search.map((s) => [s.operation, s.field, s.condition]);
  //   params!.append("search", JSON.stringify(search));
  // }

  // if (request.createdFrom) {
  //   params!.append("createdFrom", request.createdFrom);
  // }

  // if (request.createdTo) {
  //   params!.append("createdTo", request.createdTo);
  // }

  return params;
}
