import { Stage, Layer, Image, Text, Rect, Group, type KonvaNodeComponent } from "react-konva";
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
import { useEffect, useRef, useState, type Ref } from "react";

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

const SQUARE_SIZE_MAX = 100;
const SQUARE_SIZE_MIN = 50;

type BoardWithCoordinatesProps = {
  maxCoordinates: { x: number; y: number };
  mowers: Mower[];
};
export const BoardWithCoordinates = ({
  maxCoordinates,
  mowers = [],
}: BoardWithCoordinatesProps) => {
  // State to track current scale and dimensions
  const [stageSize, setStageSize] = useState({
    width: 1000,
    height: 1000,
    scale: 1,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<Layer>(null)

  const boardSize = Math.max(stageSize.width, stageSize.height);
  const potentialSquareSize = boardSize / maxCoordinates.x;
  const squareSize = Math.min(
    SQUARE_SIZE_MAX,
    Math.max(SQUARE_SIZE_MIN, potentialSquareSize)
  );
  const xMax = maxCoordinates.x;
  const yMax = maxCoordinates.y;

  // Define virtual size for our scene
  const sceneWidth = 1000;
  const sceneHeight = 1000;

  // Reference to parent container


  // Function to handle resize
  const updateSize = () => {
    if (!containerRef.current) return;

    // Get container width
    const containerWidth = containerRef.current.offsetWidth;

    // Calculate scale
    const scale = containerWidth / sceneWidth;

    // Update state with new dimensions
    setStageSize({
      width: sceneWidth * scale,
      height: sceneHeight * scale,
      scale: scale,
    });
  };

  // Update on mount and when window resizes
  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);
  useEffect(() => {
    if(!testRef.current) return;
    const boardSizeValues = testRef.current.getClientRect()
    setStageSize(prev => ({
      ...prev,
      width: boardSizeValues.width,
      height: boardSizeValues.height,
    }))
    console.log(testRef.current.getClientRect());
  }, []);

  // TODO:
  // center mower in square
  // => create function getting board coordinates and return css coordinates (x, y)
  // make a button to use default instructions (test file)
  // add input to upload txt file with instructions
  // find a way to make the board responsive
  // => https://konvajs.org/docs/sandbox/Responsive_Canvas.html

  return (
    <div
      className="border-2 border-gray-300 rounded-lg overflow-x-scroll w-full"
      ref={containerRef}
    >
      <Stage
        width={stageSize.width + 50}
        height={stageSize.height + 50}
        // scaleX={stageSize.scale}
        // scaleY={stageSize.scale}
        className="p-4"
      >
        <Layer ref={testRef} name="board" >
          {[...Array(yMax)].map((_, i) =>
            [...Array(xMax)].map((_, j) => (
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
        </Layer>

        <Layer>
          {[...Array(yMax)].map((_, i) => (
            <Text
              key={`yAxis-${i}`}
              text={`${yMax - (i + 1)}`}
              x={stageSize.width + 10}
              y={i * squareSize + squareSize / 2 - 10}
              fontSize={20}
            />
          ))}

          {[...Array(xMax)].map((_, j) => (
            <Text
              key={`xAxis-${j}`}
              text={`${j}`}
              x={j * squareSize + squareSize / 2 - 10}
              y={stageSize.height + 10}
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
