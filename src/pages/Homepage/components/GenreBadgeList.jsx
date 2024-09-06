import React from "react";
import { Badge } from "react-bootstrap";

const GenreBadgeList = ({ genres }) => {
  return (
    <div>
      {genres.map((genre, index) => (
        <Badge bg="danger" key={index}>
          {genre}
        </Badge>
      ))}
    </div>
  );
};

export default GenreBadgeList;
