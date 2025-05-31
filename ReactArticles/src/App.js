import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./components/MyRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <MyRoutes />
    </BrowserRouter>
  );
}

export default App;
