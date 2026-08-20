"use client";

export const DIRECTORY_PAGE_SIZE = 6;
export const DIRECTORY_DUMMY_PAGES = 5;

export function directoryPageItems<T>(items: T[], page: number, pageSize = DIRECTORY_PAGE_SIZE) {
  if (!items.length) return [];
  const realPages = Math.max(1, Math.ceil(items.length / pageSize));
  const sourcePage = ((Math.max(1, page) - 1) % realPages) + 1;
  const start = (sourcePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function DirectoryPagination({
  page,
  onPage,
  noun,
}: {
  page: number;
  onPage: (next: number) => void;
  noun: string;
}) {
  const totalPages = DIRECTORY_DUMMY_PAGES;
  const dummyTotal = totalPages * DIRECTORY_PAGE_SIZE;
  const from = (page - 1) * DIRECTORY_PAGE_SIZE + 1;
  const to = page * DIRECTORY_PAGE_SIZE;

  return (
    <nav className="directory-pagination" aria-label={`${noun} pagination`}>
      <p>Showing {from}–{to} of {dummyTotal} {noun}</p>
      <div>
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
          <button
            type="button"
            key={number}
            className={number === page ? "is-current" : undefined}
            aria-current={number === page ? "page" : undefined}
            onClick={() => onPage(number)}
          >
            {number}
          </button>
        ))}
        <button type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
      <small> pagination — extra pages reuse illustrative profiles.</small>
    </nav>
  );
}
