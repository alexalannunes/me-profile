import { clx } from "./lib/classnames";

function App() {
  return (
    <h1 className={`text-3xl ${clx("font-semibold", "text-red-300")}`}>
      Hello world!
    </h1>
  );
}

export default App;
