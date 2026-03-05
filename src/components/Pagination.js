import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useData } from './providers';

export function Pagination() {
  const [pages, setPages] = useState([]);
  const { apiURL, info, activePage, setActivePage, setApiURL } = useData();
  const prevIndex = activePage - 1;
  const nextIndex = activePage + 1;
  const hasPrev = prevIndex >= 0;
  const hasNext = nextIndex < pages.length;

  const handlePageChange = useCallback(
    (index) => {
      const urlWithPage = new URL(apiURL);

      if (index === 0) {
        urlWithPage.searchParams.delete('page');
      } else {
        urlWithPage.searchParams.set('page', index + 1);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActivePage(index);
      setApiURL(urlWithPage.toString());
      window.history.pushState(
        {},
        '',
        `${window.location.pathname}${urlWithPage.search}`
      );
    },
    [apiURL, setActivePage, setApiURL]
  );

  const onFirstClick = useCallback(() => {
    handlePageChange(0);
  }, [handlePageChange]);

  const onPrevClick = useCallback(() => {
    handlePageChange(activePage - 1);
  }, [handlePageChange, activePage]);

  const onNextClick = useCallback(() => {
    handlePageChange(activePage + 1);
  }, [handlePageChange, activePage]);

  const onLastClick = useCallback(() => {
    handlePageChange(pages.length - 1);
  }, [handlePageChange, pages.length]);

  useEffect(() => {
    const createdPages = Array.from({ length: info.pages || 0 }, (_, i) => i);

    setPages(createdPages);
  }, [info]);

  if (pages.length <= 1) return null;

  return (
    <StyledPagination>
      {hasPrev && (
        <>
          {prevIndex !== 0 && (
            <>
              <Page onClick={onFirstClick}>« First</Page>
              <Ellipsis>...</Ellipsis>
            </>
          )}

          <Page onClick={onPrevClick}>{prevIndex + 1}</Page>
        </>
      )}

      <Page active>{activePage + 1}</Page>

      {hasNext && (
        <>
          <Page onClick={onNextClick}>{nextIndex + 1}</Page>

          {nextIndex !== pages.length - 1 && (
            <>
              <Ellipsis>...</Ellipsis>
              <Page onClick={onLastClick}>Last »</Page>
            </>
          )}
        </>
      )}
    </StyledPagination>
  );
}

const StyledPagination = styled.div`
  width: 100%;
  text-align: center;
`;

const Page = styled.span`
  color: #fff;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  transition: color 0.2s;
  ${({ active }) => active && 'color: #83bf46'};

  &:hover {
    color: #83bf46;
  }
`;

const Ellipsis = styled(Page)`
  cursor: default;

  &:hover {
    color: #fff;
  }
`;
