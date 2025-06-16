import { BoardWithCoordinates } from "./components/BoardWithCoordinates";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <main className="px-3 py-8">
        <h1 className="text-4xl text-center">Vos tondeuses à gazon</h1>
        <BoardWithCoordinates />
      </main>
    </div>
  );
}

export default App;
