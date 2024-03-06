import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

type PagePaginationType = {
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const PagePagination: React.FC<PagePaginationType> = (props) => {
  const { currentPage, totalPages, pageNumbers, setCurrentPage } = props;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              setCurrentPage((prev) => (prev - 1 === 0 ? 1 : prev - 1))
            }
            isActive={currentPage === 1}
            className={currentPage === 1 ? "hidden" : "cursor-pointer"}
          />
        </PaginationItem>

        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setCurrentPage(page)}
              isActive={currentPage === page}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setCurrentPage((prev) =>
                prev + 1 > totalPages ? totalPages : prev + 1
              )
            }
            isActive={currentPage === totalPages}
            className={currentPage === totalPages ? "hidden" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PagePagination;
