import { BoardWithCoordinates } from "./components/BoardWithCoordinates";
import { Header } from "./components/Header";
import "./App.css";
import { Button } from "./components/ui/button";
import defaultInstructionsUrl from "./assets/data.txt";
import { type ChangeEvent, useState } from "react";
import type { Data } from "./lib/types";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  CoordinateSchema,
  DirectionSchema,
  InstructionSchema,
} from "./lib/schemas";
import { numberToBoardCoordinate, splitInHalf } from "./lib/utils";

const loadDefaultInstructions = async (
  setState: React.Dispatch<React.SetStateAction<Data | null>>
) => {
  try {
    const res = await fetch(defaultInstructionsUrl);
    if (!res.ok) throw new Error("Failed to load file");
    const text = await res.text();
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

const loadInstructionsFromFile = async (
  file: File,
  setState: React.Dispatch<React.SetStateAction<Data | null>>
) => {
  try {
    const text = await file.text();
    const textAsArrayOfLines = text.split("\n");
    const lineOne = textAsArrayOfLines[0];
    const lineTwo = textAsArrayOfLines[1];
    const lineThree = textAsArrayOfLines[2];
    const lineFour = textAsArrayOfLines[3];
    const lineFive = textAsArrayOfLines[4];

    const [xAsString, yAsString] = splitInHalf(lineOne);

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
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <main className="px-3 py-8">
        <h1 className="text-4xl text-center">Vos tondeuses à gazon</h1>
        <div className="flex justify-center flex-col max-w-sm mx-auto items-center gap-y-4 py-4">
          <Button
            className="w-full"
            onClick={() => loadDefaultInstructions(setData)}
          >
            Lancer les instructions par défaut
          </Button>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">
              Charger les instructions depuis un fichier
            </Label>
            <Input
              onChange={handleFileChange}
              id="picture"
              type="file"
              accept=".txt"
            />
          </div>
          {file && (
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => loadInstructionsFromFile(file, setData)}
            >
              Lancer les instructions depuis le fichier
            </Button>
          )}
        </div>
        <div className="py-5"></div>
        {!!data && (
          <BoardWithCoordinates
            key={JSON.stringify(data)}
            maxCoordinates={data.maxCoordinates}
            mowers={data.mowers}
          />
        )}
      </main>
      <Toaster richColors position="bottom-center" />
    </div>
  );
}

export default App;
