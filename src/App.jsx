import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import AppRouter from "./componentes/AppRouter";

export default function App() {
  const [cortes, setCortes] = useState(() => {
    const guardados = localStorage.getItem("cortes");
    return guardados ? JSON.parse(guardados) : [];
  });

  const [corteActual, setCorteActual] = useState({ nombreCorte: "", cantidadTotal: 0, colores: [], operaciones: [] });
  const [corteIndex, setCorteIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("cortes", JSON.stringify(cortes));
  }, [cortes]);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={
          <AppRouter
            cortes={cortes}
            setCortes={setCortes}
            corteActual={corteActual}
            setCorteActual={setCorteActual}
            corteIndex={corteIndex}
            setCorteIndex={setCorteIndex}
          />
        } />
      </Routes>
    </Router>
  );
}
