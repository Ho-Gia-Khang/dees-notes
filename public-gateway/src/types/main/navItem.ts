import type { Icon } from "../shared/common";

export interface INavItem {
  label: string;
  icon: Icon;
  to: string;
  level: ENavLevel;
  children?: INavItem[];
}

export enum ENavLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
}
