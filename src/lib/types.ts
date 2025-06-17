import type { z } from "zod";
import type { DirectionSchema, InstructionSchema } from "./schemas";

export type CssCoordinate = number & { __brand: "CssCoordinate" };
export type BoardCoordinate = number & { __brand: "BoardCoordinate" };
export type Instruction = z.infer<typeof InstructionSchema>;
export type Direction = z.infer<typeof DirectionSchema>;


export type Data = {
  maxCoordinates: {
    x: BoardCoordinate;
    y: BoardCoordinate;
  };
  mowers: {
    start: { x: BoardCoordinate; y: BoardCoordinate; direction: Direction };
    instructions: Instruction[];
  }[];
};

export type Mower = {
  start: { x: BoardCoordinate; y: BoardCoordinate; direction: Direction };
  instructions: Instruction[];
};
