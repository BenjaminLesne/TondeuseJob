import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BoardCoordinate, CssCoordinate, Instruction } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GetBoardCssCoordinatesFromBoardCoordinatesArgs = {
  x: number; // Board x coordinate
  y: number; // Board y coordinate
  squareSize: number; // Size of each square in pixels
  boardSize: number; // Total size of the board in pixels
};
export function getCssCoordinatesFromBoardCoordinates({
  boardSize,
  squareSize,
  x,
  y,
}: GetBoardCssCoordinatesFromBoardCoordinatesArgs) {
  const coordinates = {
    x: numberToCssCoordinate(0),
    y: numberToCssCoordinate(0),
  };

  return coordinates;
}

type GetBoardCoordinateFromInstructionArgs = {
  instruction: Instruction; // Instruction string to parse
};
export function getBoardCoordinateFromInstruction({
  instruction,
}: GetBoardCoordinateFromInstructionArgs) {

  const coordinate = {
    x: numberToBoardCoordinate(0),
    y: numberToBoardCoordinate(0),
  };

  return coordinate;
}

export function numberToCssCoordinate(number: number) {
  return number as CssCoordinate;
}

export function numberToBoardCoordinate(number: number) {
  return number as BoardCoordinate;
}