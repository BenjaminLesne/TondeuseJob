export type CssCoordinate = number & { __brand: "CssCoordinate" };
export type BoardCoordinate = number & { __brand: "BoardCoordinate" };
export type Instruction = "R" | "L" | "F";

export type Data = {
  maxCoordinates: { x: BoardCoordinate; y: BoardCoordinate };
  mowers: [
    {
      start: { x: BoardCoordinate; y: BoardCoordinate };
      instructions: Instruction[];
    }
  ];
};

export type Mower = {
  start: { x: BoardCoordinate; y: BoardCoordinate };
  instructions: Instruction[];
}