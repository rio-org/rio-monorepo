import { useCallback, useEffect, useMemo, useState } from 'react';

export const usePagination = <T = unknown>({
  items,
  resultsPerPage = 10
}: {
  items?: T[] | null;
  resultsPerPage?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil((items?.length || 0) / resultsPerPage);

  const pages = useMemo(() => {
    const visible = [currentPage];
    let pagesToAdd = Math.min(8, pageCount - 1);
    let [first, last] = [currentPage, currentPage];
    while (pagesToAdd > 0) {
      if (first > 0) {
        visible.unshift(--first);
        pagesToAdd--;
      }
      if (pagesToAdd > 0 && last < pageCount - 1) {
        visible.push(++last);
        pagesToAdd--;
      }
    }
    return visible;
  }, [pageCount, currentPage]);

  const currentPageItems = useMemo(
    () => items?.slice(currentPage * 10, (currentPage + 1) * 10),
    [items, currentPage]
  );

  const handleSetPage = useCallback(
    (pageNum: number) => {
      if (pageNum < 0 || pageNum >= pageCount) return;
      setCurrentPage(pageNum);
    },
    [pageCount]
  );

  const goToFirstPage = useCallback(() => setCurrentPage(0), []);

  const goToLastPage = useCallback(
    () => setCurrentPage(pageCount - 1),
    [pageCount]
  );

  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => (p >= pageCount - 1 ? pageCount - 1 : p + 1));
  }, [pageCount]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage <= 0 ? 0 : prevPage - 1));
  }, []);

  useEffect(() => {
    if (pageCount <= 0) return setCurrentPage(0);
    if (currentPage > pageCount - 1) setCurrentPage(pageCount - 1);
  }, [currentPage, pageCount]);

  return useMemo(
    () => ({
      currentPage,
      currentPageItems,
      hasNextPage: currentPage < pageCount - 1,
      pageCount,
      pages,
      setCurrentPage,
      goToFirstPage,
      goToLastPage,
      goToNextPage,
      goToPreviousPage
    }),
    [
      currentPage,
      currentPageItems,
      pageCount,
      pages,
      handleSetPage,
      goToFirstPage,
      goToLastPage,
      goToNextPage,
      goToPreviousPage
    ]
  );
};
