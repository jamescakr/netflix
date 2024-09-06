import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import "./MovieDetailPage.style.css";
import GenreBadgeList from "../Homepage/components/GenreBadgeList";
import { Badge, Button, Col, Row, Modal } from "react-bootstrap";
import YouTube from "react-youtube";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [poster, setPoster] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState(null);
  const [releaseDate, setReleaseDate] = useState("");
  const [overview, setOverview] = useState("");
  const [runtime, setRuntime] = useState("");
  const [tagline, setTagline] = useState("");
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [trailerId, setTrailerId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await api.get(`/movie/${id}`);
        let data = response.data;
        console.log(data);
        setPoster(data.poster_path);
        setTitle(data.title);
        setGenre(data.genres);
        setReleaseDate(data.release_date);
        setOverview(data.overview);
        setRuntime(data.runtime);
        setTagline(data.tagline);

        let reviewResponse = await api.get(`/movie/${id}/reviews`);
        setReviews(reviewResponse.data.results);

        let recommendationResponse = await api.get(`/movie/${id}/recommendations`);
        setRecommendations(recommendationResponse.data.results);

        let videoResponse = await api.get(`/movie/${id}/videos`);
        const trailer = videoResponse.data.results.find(
          (video) => video.type === "Trailer"
        );
        setTrailerId(trailer ? trailer.key : "");
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const Review = ({ review }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
      setShowMore(!showMore);
    };

    return (
      <div className="review">
        <h5>{review.author}</h5>
        <p>{showMore ? review.content : `${review.content.slice(0, 200)}...`}</p>
        {review.content.length > 200 && (
          <Button variant="link" onClick={toggleShowMore}>
            {showMore ? "Show less" : "More"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Row>
      <Row className="structure">
        <Col className="custom-col">
          <img
            className="image-size"
            src={`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${poster}`}
          />
        </Col>
        <Col>
          <GenreBadgeList
            genres={genre ? genre.map((genreItem) => genreItem.name) : []}
          />
          <h1>{title}</h1>
          <h3>{tagline}</h3>
          <div className="overview">{overview}</div>
          <div className="display">
            <Badge bg="success">Release Date</Badge>
            <div>{releaseDate}</div>
          </div>
          <div className="display">
            <Badge bg="success">Running Time</Badge>
            <div>{runtime} min</div>
          </div>
          <Button variant="primary" onClick={handleShowModal} disabled={!trailerId}>
            Watch Trailer
          </Button>
        </Col>
        <Col>
          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => <Review key={review.id} review={review} />)
          ) : (
            <p>No reviews available</p>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Recommendation</h3>
          <Row>
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <Col key={rec.id} xs={12} md={3} className="mb-4">
                  <img
                    src={`https://www.themoviedb.org/t/p/w200/${rec.poster_path}`}
                    alt={rec.title}
                  />
                  <p>{rec.title}</p>
                </Col>
              ))
            ) : (
              <p>No recommendations available</p>
            )}
          </Row>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body style={{ padding: 0, width: "640px", height: "360px" }}>
          {trailerId ? (
            <YouTube videoId={trailerId} className="w-100" />
          ) : (
            <p>No trailer available</p>
          )}
        </Modal.Body>
      </Modal>
    </Row>
  );
};
export default MovieDetailPage;
