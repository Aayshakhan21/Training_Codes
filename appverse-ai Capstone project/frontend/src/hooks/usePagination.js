export function usePagination(totalPages, currentPage, onPageChange) {
  const pages = [];
  const delta = 2;

  for (
    let pageIndex = Math.max(0, currentPage - delta);
    pageIndex <= Math.min(totalPages - 1, currentPage + delta);
    pageIndex += 1
  ) {
    pages.push(pageIndex);
  }

  return { pages, hasPrev: currentPage > 0, hasNext: currentPage < totalPages - 1 };
}
