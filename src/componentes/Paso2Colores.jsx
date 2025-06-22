// src/components/Paso2Colores.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Paso2Colores({ cantidadTotal, colores, setColores, siguiente }) {
  const [color, setColor] = useState("");
  const [cantidad, setCantidad] = useState("");
  const navigate = useNavigate();

  const totalAsignado = colores.reduce((sum, c) => sum + c.cantidad, 0);
  const restante = cantidadTotal - totalAsignado;

  const agregarColor = () => {
    if (!color || !cantidad) return;
    const numCantidad = Number(cantidad);
    if (numCantidad <= 0 || numCantidad > restante) return;
    if (colores.find(c => c.color === color)) return;
    setColores([...colores, { color, cantidad: numCantidad }]);
    setColor("");
    setCantidad("");
  };

  const eliminarColor = (c) => {
    setColores(colores.filter(item => item.color !== c));
  };

  const continuar = () => {
    if (restante === 0) navigate(siguiente);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Paso 2: Ingresar Colores</h2>
      <p>Total por asignar: {restante}</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min={1}
          className="border p-2 rounded w-1/3"

          
        />
        <button
          onClick={agregarColor}
          disabled={restante <= 0}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      <ul className="list-disc pl-6">
        {colores.map((c, i) => (
          <li key={i} className="flex justify-between">
            <span>{c.color}: {c.cantidad}</span>
            <button onClick={() => eliminarColor(c.color)} className="text-red-600 hover:underline">Eliminar</button>
          </li>
        ))}
      </ul>

      <button
        onClick={continuar}
        disabled={restante !== 0}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Aceptar
      </button>
    </div>
  );
}