import { Outlet } from "react-router-dom";
import { SessionProvider } from "./auth/session-provider";

function App() {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
}

export default App;
