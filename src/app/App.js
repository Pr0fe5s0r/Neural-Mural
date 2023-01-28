import { Routes, Route } from "react-router-dom";
import MintPageOne from "../pages/mint-1";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MintPageOne />} exact />
    </Routes>
  );
}

export default App;
