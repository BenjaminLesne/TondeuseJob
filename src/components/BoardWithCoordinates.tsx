import { Stage, Layer, Image, Text, Rect, Group } from "react-konva";
import mowerPictureUrl from "../assets/mower.png";
import useImage from "use-image";
import type {
  BoardCoordinate,
  CssCoordinate,
  Direction,
  Mower,
} from "@/lib/types";
import { ImageWithTypeSafety } from "./ImageWithTypeSafety";
import {
  getCssCoordinatesFromBoardCoordinates,
  numberToCssCoordinate,
} from "@/lib/utils";

const DIRECTION_TO_ROTATION = {
  N: 180,
  E: 90,
  S: 0,
  W: 270,
};

type MowerProps = {
  squareSize: number;
  boardSize: number;
  x: BoardCoordinate;
  y: BoardCoordinate;
  direction: Direction;
};
const MowerUI = ({ boardSize, squareSize, x, y, direction }: MowerProps) => {
  const [mowerImage] = useImage(mowerPictureUrl);
  
  if (!mowerImage) return;

  const width = squareSize * 0.6;
  const height = width * 1.5;

  const coordinates = getCssCoordinatesFromBoardCoordinates({
    x,
    y,
    boardSize,
    squareSize,
  });
  const xCoordinate = numberToCssCoordinate(coordinates.x + width / 2);
  const yCoordinate = numberToCssCoordinate(coordinates.y + height / 2);

  return (
    <ImageWithTypeSafety
      x={xCoordinate}
      y={yCoordinate}
      image={mowerImage}
      width={width}
      height={height}
      offsetX={width / 2}
      offsetY={height / 2}
      rotation={DIRECTION_TO_ROTATION[direction]}
    />
  );
};

type BoardWithCoordinatesProps = {
  maxCoordinates: { x: number; y: number };
  mowers: Mower[];
};
export const BoardWithCoordinates = ({
  maxCoordinates,
  mowers = [],
}: BoardWithCoordinatesProps) => {
  const boardSize = 400;
  const squareSize = boardSize / maxCoordinates.x;
  const max = maxCoordinates.x;


  // TODO:
  // center mower in square
  // => create function getting board coordinates and return css coordinates (x, y)
  // make a button to use default instructions (test file)
  // add input to upload txt file with instructions
  // find a way to make the board responsive
  // => https://konvajs.org/docs/sandbox/Responsive_Canvas.html

  return (
    <div className="flex border-2 border-gray-300 rounded-lg p-4">
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
            const direction = mower.start.direction;

            return (
              <MowerUI
                key={index}
                squareSize={squareSize}
                boardSize={boardSize}
                x={x}
                y={y}
                direction={direction}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};
