import { BoardWithCoordinates } from "./components/BoardWithCoordinates";
import { Header } from "./components/Header";
import "./App.css";
import { Button } from "./components/ui/button";
import defaultInstructionsUrl from "./assets/data.txt";
import { useState } from "react";
import type { Data } from "./lib/types";

const mockData: Data = {
  maxCoordinates: { x: 5, y: 10 },
  mowers: [
    {
      start: { x: 10, y: 2, direction: "N" },
      instructions: ["L", "F", "R", "R", "F", "F", "L", "F", "R", "F", "F"],
    },
    {
      start: { x: 10, y: 75, direction: "S" },
      instructions: ["L", "F", "R", "R", "F", "F", "L", "F", "R", "F", "F"],
    },
  ],
}

const loadDefaultInstructions = async () => {
  try {
    const res = await fetch(defaultInstructionsUrl);
    if (!res.ok) throw new Error("Failed to load file");
    const text = await res.text(); // optionally use the content
    // console.log(text);
  } catch (err) {
    console.error(err);
  }
};

function App() {
  const [data, setData] = useState<Data>(mockData);


  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <main className="px-3 py-8">
        <h1 className="text-4xl text-center">Vos tondeuses à gazon</h1>
        <Button onClick={loadDefaultInstructions}>
          Lancer les instructions par défaut
        </Button>
        <BoardWithCoordinates
          maxCoordinates={data.maxCoordinates}
          mowers={data.mowers}
        />
      </main>
    </div>
  );
}

export default App;
