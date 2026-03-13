export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function paginate(
  page: number = 1,
  limit: number = 10,
): PaginationParams {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit));
  return {
    page: validPage,
    limit: validLimit,
    offset: (validPage - 1) * validLimit,
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const pages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
}
