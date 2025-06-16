import { Stage, Layer, Image, Text, Rect, Group } from "react-konva";
import mowerPictureUrl from "../assets/mower.png";
import useImage from "use-image";
import type { BoardCoordinate, Mower } from "@/lib/types";

type MowerProps = {
  width: number;
  x: BoardCoordinate;
  y: BoardCoordinate;
};
const MowerUI = ({ width, x, y }: MowerProps) => {
  const [mowerImage] = useImage(mowerPictureUrl);

  return (
    <Image
      x={x}
      y={y}
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
  maxCoordinates: { x: number; y: number };
  mowers: Mower[];
};
export const BoardWithCoordinates = ({
  maxCoordinates,
  mowers = [],
}: BoardWithCoordinatesProps) => {
  const squareSize = boardSize / maxCoordinates.x;
  const max = maxCoordinates.x;

  console.log("mowers.length", mowers);

  // TODO:
  // center mower in square
  // => create function getting board coordinates and return css coordinates (x, y)
  // make a button to use default instructions (test file)
  // add input to upload txt file with instructions
  // find a way to make the board responsive
  // => https://konvajs.org/docs/sandbox/Responsive_Canvas.html

  return (
    <>
      <Stage width={1280} height={1280}>
        <Layer>
          {[...Array(max)].map((_, i) =>
            [...Array(max)].map((_, j) => (
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

          {[...Array(max)].map((_, i) => (
            <Text
              key={`y-${i}`}
              text={`${max - (i + 1)}`}
              x={boardSize + 10}
              y={i * squareSize + squareSize / 2 - 10}
              fontSize={20}
            />
          ))}

          {[...Array(max)].map((_, j) => (
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
          {mowers.map((mower, index) => {
            const x = mower.start.x;
            const y = mower.start.y;

            return <MowerUI key={index} width={squareSize} x={x} y={y} />;
          })}

        </Layer>
      </Stage>
    </>
  );
};
