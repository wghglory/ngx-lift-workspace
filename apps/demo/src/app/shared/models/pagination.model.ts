export interface PaginationResponse<T> {
  results: T[];
  info: Info;
}

interface Info {
  seed: string;
  results: number;
  page: number;
  version: string;
  total?: number; // fake resultTotal
}
