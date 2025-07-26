export function getPaginationMeta(total: number, skip: number, limit: number) {
  return {
    total,
    limit,
    skip,
    currentPage: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit),
  };
}
