import { useHaptic } from "use-haptic";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const { vibe } = useHaptic();
  return (
    <main>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <button className="haptic-btn" onClick={vibe}>
        Click me
      </button>

      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </main>
  );
}

export default App;