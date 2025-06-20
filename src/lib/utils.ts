import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  BoardCoordinate,
  CssCoordinate,
  Direction,
  Instruction,
} from "./types";
import { match } from "ts-pattern";
import { EvenLengthStringSchema } from "./schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GetBoardCssCoordinatesFromBoardCoordinatesArgs = {
  x: BoardCoordinate;
  y: BoardCoordinate;
  squareSize: number;
  maxY: BoardCoordinate;
};
export function getCssCoordinatesFromBoardCoordinates({
  squareSize,
  x,
  y,
  maxY,
}: GetBoardCssCoordinatesFromBoardCoordinatesArgs) {
  const coordinates = {
    x: numberToCssCoordinate(x * squareSize),
    y: numberToCssCoordinate((maxY - y) * squareSize),
  };

  return coordinates;
}

type MowerAnimationStep = {
  x: BoardCoordinate;
  y: BoardCoordinate;
  direction: Direction;
};

type GetMowerAnimationStepsArgs = {
  startCoordinates: { x: BoardCoordinate; y: BoardCoordinate };
  maxCoordinates: { x: BoardCoordinate; y: BoardCoordinate };
  startDirection: Direction;
  instructions: Instruction[];
};

export function getMowerAnimationSteps({
  startCoordinates,
  startDirection,
  instructions,
  maxCoordinates,
}: GetMowerAnimationStepsArgs): MowerAnimationStep[] {
  const animationSteps: MowerAnimationStep[] = [];
  const currentPosition = { ...startCoordinates };
  let currentDirection = startDirection;

  animationSteps.push({ ...currentPosition, direction: currentDirection });

  for (const instruction of instructions) {
    match(instruction)
      .with("R", () =>
        match(currentDirection)
          .with("N", () => (currentDirection = "E"))
          .with("E", () => (currentDirection = "S"))
          .with("S", () => (currentDirection = "W"))
          .with("W", () => (currentDirection = "N"))
          .exhaustive()
      )
      .with("L", () =>
        match(currentDirection)
          .with("N", () => (currentDirection = "W"))
          .with("E", () => (currentDirection = "N"))
          .with("S", () => (currentDirection = "E"))
          .with("W", () => (currentDirection = "S"))
          .exhaustive()
      )
      .with("F", () =>
        match(currentDirection)
          .with("N", () => {
            const possibleY = currentPosition.y + 1;
            const newY =
              possibleY > maxCoordinates.y ? maxCoordinates.y : possibleY;
            currentPosition.y = numberToBoardCoordinate(newY);
          })
          .with("E", () => {
            const possibleX = currentPosition.x + 1;
            const newX =
              possibleX > maxCoordinates.x ? maxCoordinates.x : possibleX;
            currentPosition.x = numberToBoardCoordinate(newX);
          })
          .with("S", () => {
            const possibleY = currentPosition.y - 1;
            const newY = possibleY < 0 ? 0 : possibleY;
            currentPosition.y = numberToBoardCoordinate(newY);
          })
          .with("W", () => {
            const possibleX = currentPosition.x - 1;
            const newX = possibleX < 0 ? 0 : possibleX;
            currentPosition.x = numberToBoardCoordinate(newX);
          })
          .exhaustive()
      )
      .exhaustive();

    animationSteps.push({ ...currentPosition, direction: currentDirection });
  }

  return animationSteps;
}

export function numberToCssCoordinate(number: number) {
  return number as CssCoordinate;
}

export function numberToBoardCoordinate(number: number) {
  return number as BoardCoordinate;
}

export function splitInHalf(string: string): [string, string] {
  EvenLengthStringSchema.parse(string);
  const mid = string.length / 2;
  return [string.slice(0, mid), string.slice(mid)];
}

export const getShortestRotation = (current: number, target: number) => {
  const diff = target - current;
  if (diff > 180) {
    return current + (diff - 360);
  }
  if (diff < -180) {
    return current + (diff + 360);
  }
  return current + diff;
};
