export interface NavConfig {
  path: string;
  value: string;
  icon: string;
  children?: {
    path: string;
    queryParams?: Record<string, unknown>;
    value: string;
    i18nKey?: string;
  }[];
}
