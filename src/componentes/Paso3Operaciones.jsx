// src/components/Paso3Operaciones.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const opcionesBase = [
  "bolsillos", "cerrada", "cremallera", "puño", "caucho abajo",
  "línea", "tulas", "cuello", "despunte", "bolsillo atrás"
];

export default function Paso3Operaciones({ operaciones, setOperaciones, siguiente }) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [valor, setValor] = useState("");

  const agregarOperacion = () => {
    if (!nombre || !valor) return;
    if (operaciones.find(o => o.nombre === nombre)) return;
    setOperaciones([...operaciones, { nombre, valor: Number(valor) }]);
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Paso 3: Operaciones</h2>
      <div className="flex gap-2">
        <select value={nombre} onChange={(e) => setNombre(e.target.value)} className="border p-2 rounded w-1/2">
          <option value="">Selecciona una operación</option>
          {opcionesBase.map((op, i) => (
            <option key={i} value={op}>{op}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="border p-2 rounded w-1/3"
          min={0}
        />
        <button onClick={agregarOperacion} className="bg-green-600 text-white px-3 py-2 rounded">Agregar</button>
      </div>

      <ul className="list-disc pl-6">
        {operaciones.map((op, i) => (
          <li key={i} className="flex justify-between">
            <span>{op.nombre}: ${op.valor}</span>
            <button onClick={() => eliminarOperacion(op.nombre)} className="text-red-600 hover:underline">Eliminar</button>
          </li>
        ))}
      </ul>

      <button
        onClick={continuar}
        disabled={operaciones.length === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Aceptar
      </button>
    </div>
  );
}