import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Lista de colores predefinidos ordenados
const coloresBase = [
  "amarillo", "azul bebe", "azul oscuro", "azul petroleo", "azul rey",
  "Barney", "Benetton", "blanco", "fucsia", "gris oscuro", "gris ratón",
  "guayaba", "lila", "morado", "naranja", "negro", "palo de rosa",
  "rojo", "rosado", "salmon", "turqueza", "verde cali", "verde menta",
  "verde militar", "verde neon", "verde petroleo", "Vinotinto"
].sort((a, b) => a.localeCompare(b));

export default function Paso2Colores({ cantidadTotal, colores, setColores, siguiente }) {
  const [color, setColor] = useState("");
  const [cantidad, setCantidad] = useState("");
  const navigate = useNavigate();

  const totalAsignado = colores.reduce((sum, c) => sum + c.cantidad, 0);
  const restante = cantidadTotal - totalAsignado;

  const agregarColor = () => {
    const colorNombre = color.trim().toLowerCase();
    const numCantidad = Number(cantidad);

    if (!colorNombre || isNaN(numCantidad) || numCantidad <= 0 || numCantidad > restante) return;

    // Contar cuántos colores existentes empiezan con este nombre
    const existentes = colores.filter(c => c.color.startsWith(colorNombre));
    let nombreFinal = colorNombre;

    if (existentes.length > 0) {
      // El primero se queda igual, los siguientes van con número
      nombreFinal = `${colorNombre} ${existentes.length}`;
    }

    setColores([...colores, { color: nombreFinal, cantidad: numCantidad }]);
    setColor("");
    setCantidad("");
  };

  const eliminarColor = (nombreColor) => {
    setColores(colores.filter(item => item.color !== nombreColor));
  };

  const continuar = () => {
    if (restante === 0) navigate(siguiente);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Paso 2: Ingresar Colores</h2>
      <p className="text-center text-gray-600">
        Total por asignar: <strong>{restante}</strong>
      </p>

      <div className="flex flex-col gap-4">
        <input
          list="lista-colores"
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <datalist id="lista-colores">
          {coloresBase.map((c, i) => (
            <option key={i} value={c} />
          ))}
        </datalist>

        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min={1}
          max={restante}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <button
          onClick={agregarColor}
          disabled={restante <= 0}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Agregar Color
        </button>
      </div>

      {colores.length > 0 && (
        <ul className="space-y-2 mt-4">
          {colores.map((c, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded shadow-sm"
            >
              <span className="capitalize text-gray-700">
                {c.color}: <strong>{c.cantidad}</strong>
              </span>
              <button
                onClick={() => eliminarColor(c.color)}
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
        disabled={restante !== 0}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        Aceptar
      </button>
    </div>
  );
}
