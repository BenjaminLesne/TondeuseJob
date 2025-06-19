import {
  Stage,
  Layer,
  Image,
  Text,
  Rect,
  Group,
  type KonvaNodeComponent,
   
} from "react-konva";
import mowerPictureUrl from "../assets/mower.png";
import useImage from "use-image";
import type {
  BoardCoordinate,
  CssCoordinate,
  Direction,
  Instruction,
  Mower,
} from "@/lib/types";
import { ImageWithTypeSafety } from "./ImageWithTypeSafety";
import {
  getCssCoordinatesFromBoardCoordinates,
  numberToCssCoordinate,
} from "@/lib/utils";
import { useEffect, useRef, useState, type Ref } from "react";
import Konva from 'konva';

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
  instructions: Instruction[];
};
const MowerUI = ({
  boardSize,
  squareSize,
  x,
  y,
  direction,
  instructions,
}: MowerProps) => {
  const [mowerImage] = useImage(mowerPictureUrl);
  const imageRef = useRef<typeof ImageWithTypeSafety>(null);

 

  const width = squareSize * 0.6;
  const height = width * 1.5;

  const coordinates = getCssCoordinatesFromBoardCoordinates({
    x,
    y,
    boardSize,
    squareSize,
  });
  const xCoordinate = numberToCssCoordinate(coordinates.x + squareSize / 2);
  const yCoordinate = numberToCssCoordinate(coordinates.y + squareSize / 2);

  // TODO: animate each instruction step
  // there is a syntax with an await somewhere, it could be nice to await each instruction
  
  // useEffect(() => {
  //   const amplitude = 100;
  //   const period = 2000; // in milliseconds

  //   const anim = new Konva.Animation((frame) => {
  //     imageRef.current.x(
  //       amplitude * Math.sin((frame.time * 2 * Math.PI) / period) +
  //       window.innerWidth / 2
  //     );
  //   }, imageRef.current.getLayer());

  //   anim.start();

  //   return () => {
  //     anim.stop();
  //   };
  // }, []);

  if (!mowerImage) return null;

  return (
    <ImageWithTypeSafety
      ref={imageRef}
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
  const [stageSize, setStageSize] = useState({
    width: 1000,
    height: 1000,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<Layer>(null);

  const boardSize = Math.max(stageSize.width, stageSize.height);
  const potentialSquareSize = boardSize / maxCoordinates.x;
  const squareSize = Math.min(
    SQUARE_SIZE_MAX,
    Math.max(SQUARE_SIZE_MIN, potentialSquareSize)
  );
  const xMax = maxCoordinates.x;
  const yMax = maxCoordinates.y;

  useEffect(() => {
    if (!boardRef.current) return;
    const boardSizeValues = boardRef.current.getClientRect();
    setStageSize((prev) => ({
      ...prev,
      width: boardSizeValues.width,
      height: boardSizeValues.height,
    }));
  }, []);

  // TODO:
  // position mowers to right board coordinates on start

  return (
    <div
      className="border-2 border-gray-300 rounded-lg overflow-x-scroll w-full"
      ref={containerRef}
    >
      <Stage
        width={stageSize.width + 50}
        height={stageSize.height + 50}
        className="p-4"
      >
        <Layer ref={boardRef}>
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
            const instructions = mower.instructions;

            return (
              <MowerUI
                key={index}
                squareSize={squareSize}
                boardSize={boardSize}
                x={x}
                y={y}
                direction={direction}
                instructions={instructions}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};
