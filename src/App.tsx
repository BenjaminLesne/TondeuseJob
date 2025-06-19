import { BoardWithCoordinates } from "./components/BoardWithCoordinates";
import { Header } from "./components/Header";
import "./App.css";
import { Button } from "./components/ui/button";
import defaultInstructionsUrl from "./assets/data.txt";
import { useState } from "react";
import type { Data } from "./lib/types";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  CoordinateSchema,
  DirectionSchema,
  InstructionSchema,
} from "./lib/schemas";
import { numberToBoardCoordinate, splitInHalf } from "./lib/utils";

// const mockData: Data = {
//   maxCoordinates: { x: 5, y: 10 },
//   mowers: [
//     {
//       start: { x: 10, y: 2, direction: "N" },
//       instructions: ["L", "F", "R", "R", "F", "F", "L", "F", "R", "F", "F"],
//     },
//     {
//       start: { x: 10, y: 75, direction: "S" },
//       instructions: ["L", "F", "R", "R", "F", "F", "L", "F", "R", "F", "F"],
//     },
//   ],
// };

const loadDefaultInstructions = async (
  setState: React.Dispatch<React.SetStateAction<Data | null>>
) => {
  try {
    const res = await fetch(defaultInstructionsUrl);
    if (!res.ok) throw new Error("Failed to load file");
    const text = await res.text(); // optionally use the content
    const textAsArrayOfLines = text.split("\n");
    const lineOne = textAsArrayOfLines[0];
    const lineTwo = textAsArrayOfLines[1];
    const lineThree = textAsArrayOfLines[2];
    const lineFour = textAsArrayOfLines[3];
    const lineFive = textAsArrayOfLines[4];

    const [xAsString, yAsString] = splitInHalf(lineOne)

    const maxCoordinates = {
      x: numberToBoardCoordinate(CoordinateSchema.parse(xAsString)),
      y: numberToBoardCoordinate(CoordinateSchema.parse(yAsString)),
    };
    const mower1 = {
      start: {
        x: numberToBoardCoordinate(CoordinateSchema.parse(lineTwo.charAt(0))),
        y: numberToBoardCoordinate(CoordinateSchema.parse(lineTwo.charAt(1))),
        direction: DirectionSchema.parse(lineTwo.charAt(3)),
      },
      instructions: InstructionSchema.array().parse(lineThree.split("")),
    };

    const mower2 = {
      start: {
        x: numberToBoardCoordinate(CoordinateSchema.parse(lineFour.charAt(0))),
        y: numberToBoardCoordinate(CoordinateSchema.parse(lineFour.charAt(1))),
        direction: DirectionSchema.parse(lineFour.charAt(3)),
      },
      instructions: InstructionSchema.array().parse(lineFive.split("")),
    };

    const mowers = [mower1, mower2];

    setState({
      maxCoordinates,
      mowers,
    });
  } catch (err) {
    console.error(err);
    toast.error("Une erreur est survenue", {});
  }
};

function App() {
  const [data, setData] = useState<Data | null>(null);
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <main className="px-3 py-8">
        <h1 className="text-4xl text-center">Vos tondeuses à gazon</h1>
        <Button onClick={() => loadDefaultInstructions(setData)}>
          Lancer les instructions par défaut
        </Button>
        {!!data && <BoardWithCoordinates
          key={JSON.stringify(data)}
          maxCoordinates={data.maxCoordinates}
          mowers={data.mowers}
        />}
      </main>
      <Toaster richColors position="bottom-center" />
    </div>
  );
}

export default App;
