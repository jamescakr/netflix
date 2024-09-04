import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import { Alert, Container, Row, Col } from "react-bootstrap";
import MovieCard from "../../common/MovieCard/MovieCard";
import ReactPaginate from "react-paginate";

const MoviePage = () => {
  const [query, setQuery] = useSearchParams();
  const [page, setPage] = useState(1);
  const keyword = query.get("q");

  const handlePageClick = ({ selected }) => {
    console.log(page);

    setPage(selected + 1);
  };

  const { data, isLoading, isError, error } = useSearchMovieQuery({ keyword, page });
  console.log("dataaa", data);

  if (isLoading) {
    return <h>loading...</h>;
  }
  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }
  if (!data || data.results.length === 0) {
    return <h1>no results</h1>;
  }

  return (
    <Container>
      <Row>
        <Col lg={4} xs={12}></Col>
        <Col lg={8} xs={12}>
          <Row>
            {data?.results.map((movie, index) => (
              <Col>
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        </Col>
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={data?.total_pages}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
          forcePage={page - 1}
        />
      </Row>
    </Container>
  );
};

export default MoviePage;
