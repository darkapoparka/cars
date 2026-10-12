export const getPaginationCopy = (locale?: string) => {
  const isBg = locale?.trim().toLowerCase().startsWith("bg") ?? false;

  return isBg
    ? {
        nav: "Страници с резултати от обяви",
        next: "Напред",
        nextLabel: "Следваща страница с резултати",
        pageLabel: (page: number) => `Страница ${page} с резултати`,
        previous: "Назад",
        previousLabel: "Предишна страница с резултати",
      }
    : {
        nav: "Marketplace result pages",
        next: "Next",
        nextLabel: "Next results page",
        pageLabel: (page: number) => `Results page ${page}`,
        previous: "Previous",
        previousLabel: "Previous results page",
      };
};

export const getVisiblePages = (currentPage: number, totalPages: number) => {
  const visibleCount = Math.min(5, totalPages);
  const firstPage = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - visibleCount + 1)
  );

  return Array.from({ length: visibleCount }, (_, index) => firstPage + index);
};


/** Use the same native five-page window, with every admitted page anchor retained. */
export const getNativeMarketplacePaginationSlots = (currentPage: number, totalPages: number, maximumPages: number) => {
  if (!Number.isInteger(maximumPages) || maximumPages < totalPages || maximumPages < 0 || !Number.isInteger(totalPages) || totalPages < 0) throw new Error("Native pagination exceeds the admitted inventory");
  const visible = new Set(getVisiblePages(currentPage, totalPages));
  return Array.from({ length: maximumPages }, (_, index) => ({ page: index + 1, hidden: !visible.has(index + 1) }));
};
