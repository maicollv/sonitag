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
    const confirmado = window.confirm("¿Quieres eliminar el corte?");
    if(confirmado){
      const restantes = [...cortes];
      restantes.splice(i, 1);
      setCortes(restantes);
    }
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
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 max-w-4xl mx-auto">
      {location.pathname !== "/" && (
        <nav className="flex flex-wrap justify-center gap-4 mb-6">
          {[
            { path: "/paso1", label: "Crear corte" },
            { path: "/paso2", label: "Ingresar Colores" },
            { path: "/paso3", label: "Operaciones" },
            { path: "/paso4", label: "Resumen" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

      )}
      <h1 className="text-2xl font-bold mb-4">Sistema de pago de cortes</h1>

      {location.pathname === "/" ? (
        <>
          <button onClick={nuevoCorte}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition shadow-md"
          >
            + Nuevo Corte
          </button>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Cortes Guardados</h2>
            <div className="grid gap-4">
              {cortes.map((corte, i) => (
                <div key={i} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center transition hover:shadow-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {corte.nombreCorte || `Corte #${i + 1}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {corte.colores.length} colores • {corte.operaciones.length} operaciones
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editarCorte(i)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => eliminarCorte(i)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
