import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  BoardCoordinate,
  CssCoordinate,
  Direction,
  Instruction,
} from "./types";
import { match, P } from "ts-pattern";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GetBoardCssCoordinatesFromBoardCoordinatesArgs = {
  x: number;
  y: number;
  squareSize: number;
};
export function getCssCoordinatesFromBoardCoordinates({
  squareSize,
  x,
  y,
}: GetBoardCssCoordinatesFromBoardCoordinatesArgs) {
  const coordinates = {
    x: numberToCssCoordinate(x * squareSize),
    y: numberToCssCoordinate(y * squareSize),
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
  startDirection: Direction;
  instructions: Instruction[];
};

export function getMowerAnimationSteps({
  startCoordinates,
  startDirection,
  instructions,
}: GetMowerAnimationStepsArgs): MowerAnimationStep[] {
  const animationSteps: MowerAnimationStep[] = [];
  const currentPosition = { ...startCoordinates };
  let currentDirection = startDirection;

  animationSteps.push({ ...currentPosition, direction: currentDirection });

  for (const instruction of instructions) {
     match(instruction)
      .with("R", () =>
        match(currentDirection)
          .with("N", () => currentDirection = "E")
          .with("E", () => currentDirection = "S")
          .with("S", () => currentDirection = "W")
          .with("W", () => currentDirection = "N")
          .exhaustive()
      )
      .with("L", () =>
        match(currentDirection)
          .with("N", () => currentDirection = "W")
          .with("E", () => currentDirection = "N")
          .with("S", () => currentDirection = "E")
          .with("W", () => currentDirection = "S")
          .exhaustive()
      )
      .with("F", () =>
        match(currentDirection)
          .with("N", () => {
            currentPosition.y = numberToBoardCoordinate(currentPosition.y + 1);
          })
          .with("E", () => {
            currentPosition.x = numberToBoardCoordinate(currentPosition.x + 1);
          })
          .with("S", () => {
            currentPosition.y = numberToBoardCoordinate(currentPosition.y - 1);
          })
          .with("W", () => {
            currentPosition.x = numberToBoardCoordinate(currentPosition.x - 1);
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
