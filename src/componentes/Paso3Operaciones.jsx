import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const opcionesBase = [
  "bolsillos", "cerrada", "cremallera", "puño", "caucho abajo",
  "línea", "tulas", "cuello", "despunte", "bolsillo atrás"
];

const operacionesPorDefecto = [
  { nombre: "bolsillos", valor: 850 },
  { nombre: "cerrada", valor: 1100 },
  { nombre: "cremallera", valor: 520 },
  { nombre: "puño", valor: 150 },
  { nombre: "caucho abajo", valor: 100 },
  { nombre: "línea", valor: 250 },
  { nombre: "tulas", valor: 100 },
];

export default function Paso3Operaciones({ operaciones, setOperaciones, siguiente }) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    if (operaciones.length === 0) {
      setOperaciones(operacionesPorDefecto);
    }
  }, []);

  const agregarOperacion = () => {
    if (!nombre.trim() || !valor || isNaN(valor)) return;

    if (operaciones.find(o => o.nombre === nombre.trim())) return;

    setOperaciones([...operaciones, { nombre: nombre.trim(), valor: Number(valor) }]);
    setNombre("");
    setValor("");
  };

  const eliminarOperacion = (n) => {
    setOperaciones(operaciones.filter(op => op.nombre !== n));
  };

  const continuar = () => {
    if (operaciones.length > 0) navigate(siguiente);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800">Operaciones</h2>

      <div className="flex flex-col gap-4">
        <input
          list="operaciones-lista"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de operación"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <datalist id="operaciones-lista">
          {opcionesBase.map((op, i) => (
            <option key={i} value={op} />
          ))}
        </datalist>

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          min={0}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <button
          onClick={agregarOperacion}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Agregar Operación
        </button>
      </div>

      {operaciones.length > 0 && (
        <ul className="space-y-2 mt-4">
          {operaciones.map((op, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded shadow-sm"
            >
              <span className="text-gray-700">{op.nombre}: <strong>${op.valor}</strong></span>
              <button
                onClick={() => eliminarOperacion(op.nombre)}
                className="text-sm text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={continuar}
        disabled={operaciones.length === 0}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        Aceptar
      </button>
    </div>
  );
}
