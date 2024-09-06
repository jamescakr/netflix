import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import { Alert, Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import MovieCard from "../../common/MovieCard/MovieCard";
import ReactPaginate from "react-paginate";
import "./MoviePage.style.css";

const MoviePage = () => {
  const [query, setQuery] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const keyword = query.get("q");

  const handlePageClick = ({ selected }) => {
    console.log(page);

    setPage(selected + 1);
  };

  const { data, isLoading, isError, error } = useSearchMovieQuery({ keyword, page });
  console.log("dataaa", data);

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
  };

  if (isLoading) {
    return <h>loading...</h>;
  }
  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }
  if (!data || data.results.length === 0) {
    return <h1>no results</h1>;
  }

  const sortedMovies = data.results.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.popularity - b.popularity;
    } else {
      return b.popularity - a.popularity;
    }
  });

  const filteredMovies = selectedGenre
    ? sortedMovies.filter((movie) => movie.genre_ids.includes(selectedGenre))
    : sortedMovies;

  return (
    <Container>
      <Row>
        <Col lg={4} xs={12}>
          <Dropdown onSelect={handleSortChange}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Popularity
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="desc">most popular</Dropdown.Item>
              <Dropdown.Item eventKey="asc">less popular</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <div className="d-flex flex-column align-items-start mt-3">
            <div className="col-md-4">
              <Button className="mb-2 w-100" onClick={() => handleGenreClick(null)}>
                All
              </Button>
              <Button className="mb-2 w-100" onClick={() => handleGenreClick(28)}>
                Action
              </Button>
              <Button className="mb-2 w-100" onClick={() => handleGenreClick(35)}>
                Comedy
              </Button>
              <Button className="mb-2 w-100" onClick={() => handleGenreClick(18)}>
                Drama
              </Button>
              <Button className="mb-2 w-100" onClick={() => handleGenreClick(12)}>
                Adventure
              </Button>
              <Button className="mb-2 w-100" onClick={() => handleGenreClick(16)}>
                Animation
              </Button>
              <Button className="mb-2 w-100" onClick={() => handleGenreClick(27)}>
                Horror
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={8} xs={12}>
          <Row>
            {filteredMovies.map((movie, index) => (
              <Col key={index}>
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
