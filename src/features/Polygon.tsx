import React, { FC, useMemo } from 'react';

interface PolygonProps {
  sides: number;
  radius: number;
}

const randomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 80%)`;
};

const Polygon: FC<PolygonProps> = ({ sides, radius }) => {
  const fillColor = useMemo(() => randomPastelColor(), [sides, radius]);

  const points = Array.from({ length: sides }, (_, i) => {
    const angle = (i * 360) / sides;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={radius * 2} height={radius * 2} viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}>
      <polygon points={points} fill={fillColor} stroke="black" />
    </svg>
  );
};

export default Polygon;
