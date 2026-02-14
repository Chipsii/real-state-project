import React, { useMemo } from "react";

const fallbackScores = [
  {
    icon: "flaticon-walking",
    type: "Walk Score",
    score: 57,
    description: "Somewhat Walkable",
  },
  {
    icon: "flaticon-bus",
    type: "Transit Score",
    score: 27,
    description: "Some Transit",
  },
  {
    icon: "flaticon-bike",
    type: "Bike Score",
    score: 45,
    description: "Somewhat Bikeable",
  },
];

const WalkScore = ({ property }) => {
  const scores = useMemo(() => {
  
    const ws = property?.walkScore;
    if (!ws) return fallbackScores;

    return [
      {
        icon: "flaticon-walking",
        type: "Walk Score",
        score: ws.walk?.score ?? 0,
        description: ws.walk?.description ?? "",
      },
      {
        icon: "flaticon-bus",
        type: "Transit Score",
        score: ws.transit?.score ?? 0,
        description: ws.transit?.description ?? "",
      },
      {
        icon: "flaticon-bike",
        type: "Bike Score",
        score: ws.bike?.score ?? 0,
        description: ws.bike?.description ?? "",
      },
    ];
  }, [property]);

  return (
    <>
      {scores.map((score, index) => (
        <div
          key={index}
          className={`walkscore d-sm-flex align-items-center ${
            index < 2 ? "mb20" : ""
          }`}
        >
          <span className={`icon mr15 mb10-sm ${score.icon}`} />
          <div className="details">
            <p className="dark-color fw600 mb-2">{score.type}</p>
            <p className="text mb-0">
              {`${score.score} / 100 (${score.description})`}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default WalkScore;
