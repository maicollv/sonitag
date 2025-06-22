import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Paso1Cantidad from "./Paso1Cantidad";
import Paso2Colores from "./Paso2Colores";
import Paso3Operaciones from "./Paso3Operaciones";
import Paso4Resumen from "./Paso4Resumen";

export default function AppRouter({ cortes, setCortes, corteActual, setCorteActual, corteIndex, setCorteIndex }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const guardados = localStorage.getItem("cortes");
    if (guardados) {
      setCortes(JSON.parse(guardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cortes", JSON.stringify(cortes));
  }, [cortes]);

  const nuevoCorte = () => {
    setCorteActual({ nombreCorte: "", cantidadTotal: 0, colores: [], operaciones: [] });
    setCorteIndex(null);
    navigate("/paso1");
  };

  const editarCorte = (i) => {
    setCorteActual(cortes[i]);
    setCorteIndex(i);
    navigate("/paso4");
  };

  const eliminarCorte = (i) => {
    const restantes = [...cortes];
    restantes.splice(i, 1);
    setCortes(restantes);
  };

  const guardarCorte = (resumenFinal) => {
    const corteGuardado = {
      ...corteActual,
      resumen: resumenFinal
    };

    if (corteIndex !== null) {
      const actualizados = [...cortes];
      actualizados[corteIndex] = corteGuardado;
      setCortes(actualizados);
    } else {
      setCortes([...cortes, corteGuardado]);
    }

    setCorteActual({ nombreCorte: "", cantidadTotal: 0, colores: [], operaciones: [] });
    setCorteIndex(null);
    navigate("/");
  };

  return (
    <main className="p-4 max-w-4xl mx-auto">
      {location.pathname !== "/" && (
        <nav className="flex gap-4 mb-4 text-sm text-gray-600">
          <span className={location.pathname === "/paso1" ? "font-bold underline text-blue-600 cursor-pointer" : "cursor-pointer"} onClick={() => navigate("/paso1")}>Paso 1</span>
          <span className={location.pathname === "/paso2" ? "font-bold underline text-blue-600 cursor-pointer" : "cursor-pointer"} onClick={() => navigate("/paso2")}>Paso 2</span>
          <span className={location.pathname === "/paso3" ? "font-bold underline text-blue-600 cursor-pointer" : "cursor-pointer"} onClick={() => navigate("/paso3")}>Paso 3</span>
          <span className={location.pathname === "/paso4" ? "font-bold underline text-blue-600 cursor-pointer" : "cursor-pointer"} onClick={() => navigate("/paso4")}>Paso 4</span>
        </nav>
      )}
      <h1 className="text-2xl font-bold mb-4">Sistema de Corte de Chaquetas</h1>

      {location.pathname === "/" ? (
        <>
          <button onClick={nuevoCorte} className="mb-4 bg-green-700 text-white px-4 py-2 rounded">+ Nuevo Corte</button>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Cortes Guardados</h2>
            <ul className="list-disc pl-5">
              {cortes.map((corte, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>
                    {corte.nombreCorte || `Corte #${i + 1}`} – {corte.colores.length} colores / {corte.operaciones.length} operaciones
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => editarCorte(i)} className="text-blue-600 hover:underline">Modificar</button>
                    <button onClick={() => eliminarCorte(i)} className="text-red-600 hover:underline">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/paso1" element={
              <Paso1Cantidad
                cantidadTotal={corteActual.cantidadTotal}
                setCantidadTotal={(v) => setCorteActual({ ...corteActual, cantidadTotal: v })}
                nombreCorte={corteActual.nombreCorte}
                setNombreCorte={(v) => setCorteActual({ ...corteActual, nombreCorte: v })}
                siguiente="/paso2"
              />
            } />
            <Route path="/paso2" element={
              <Paso2Colores
                cantidadTotal={corteActual.cantidadTotal}
                colores={corteActual.colores}
                setColores={(v) => setCorteActual({ ...corteActual, colores: v })}
                siguiente="/paso3"
              />
            } />
            <Route path="/paso3" element={
              <Paso3Operaciones
                operaciones={corteActual.operaciones}
                setOperaciones={(v) => setCorteActual({ ...corteActual, operaciones: v })}
                siguiente="/paso4"
              />
            } />
            <Route path="/paso4" element={
              <Paso4Resumen
                colores={corteActual.colores}
                operaciones={corteActual.operaciones}
                resumen={corteActual.resumen}
                setResumen={(v) => setCorteActual({ ...corteActual, resumen: v })}
                onGuardar={guardarCorte}
              />
            } />
          </Routes>
        </>
      )}
    </main>
  );
}
