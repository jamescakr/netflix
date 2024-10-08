import React from "react";
import MovieSlider from "../../../../common/MovieSlider/MovieSlider";
import { useTopRatedMoviesQuery } from "../../../../hooks/useTopRatedMovies";
import { Alert } from "bootstrap";
import { responsive } from "../../../../constants/responsive";

const TopRatedSlide = () => {
  const { data, isLoading, isError, error } = useTopRatedMoviesQuery();

  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  return (
    <div>
      <MovieSlider
        title="Top Rated Movies"
        movies={data.results}
        responsive={responsive}
      />
    </div>
  );
};

export default TopRatedSlide;
