import { useEffect, useRef } from "react";
import { Stage, Layer, Circle, Image, Text, Rect } from "react-konva";
import mowerPictureUrl from "../assets/mower.png";
import useImage from "use-image";

type MowerProps = {
  width: number;
};
const Mower = ({ width }: MowerProps) => {
  const [mowerImage] = useImage(mowerPictureUrl);

  return (
    <Image
      x={0}
      y={0}
      image={mowerImage}
      scaleX={0.5}
      scaleY={0.5}
      width={width}
      height={width * 1.5}
    />
  );
};

const boardSize = 400;

type BoardWithCoordinatesProps = {
  maxCoordinate: number;
};
export const BoardWithCoordinates = ({
  maxCoordinate,
}: BoardWithCoordinatesProps) => {
  const squareSize = boardSize / maxCoordinate;

  return (
    <>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {[...Array(maxCoordinate)].map((_, i) =>
            [...Array(maxCoordinate)].map((_, j) => (
              <Rect
                key={`${i}-${j}`}
                x={j * squareSize}
                y={i * squareSize}
                width={squareSize}
                height={squareSize}
                fill={(i + j) % 2 === 0 ? "white" : "black"}
              />
            ))
          )}

          {[...Array(maxCoordinate)].map((_, i) => (
            <Text
              key={`y-${i}`}
              text={`${maxCoordinate - (i + 1)}`}
              x={boardSize + 10}
              y={i * squareSize + squareSize / 2 - 10}
              fontSize={20}
            />
          ))}

          {[...Array(maxCoordinate)].map((_, j) => (
            <Text
              key={`x-${j}`}
              text={`${j}`}
              x={j * squareSize + squareSize / 2 - 10}
              y={boardSize + 10}
              fontSize={20}
            />
          ))}
        </Layer>

        <Layer>
          <Mower width={squareSize * 1.25} />
        </Layer>
      </Stage>
    </>
  );
};
