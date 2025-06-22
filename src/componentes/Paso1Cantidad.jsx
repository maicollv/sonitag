// src/components/Paso1Cantidad.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Paso1Cantidad({ cantidadTotal, setCantidadTotal, nombreCorte, setNombreCorte, siguiente }) {
  const navigate = useNavigate();

  const handleAceptar = () => {
    if (!nombreCorte || cantidadTotal <= 0) {
      alert("Por favor, ingresa un nombre y una cantidad válida.");
      return;
    }
    navigate(siguiente);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paso 1: Crear Corte</h2>

      <div>
        <label className="font-bold block mb-1">Nombre del Corte:</label>
        <input
          type="text"
          value={nombreCorte}
          onChange={(e) => setNombreCorte(e.target.value)}
          placeholder="Ej: Corte Azul 1"
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="font-bold block mb-1">Cantidad Total de Chaquetas:</label>
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidadTotal}
          onChange={(e) => setCantidadTotal(Number(e.target.value))}
          min={1}
          className="border p-2 rounded w-1/3"
        />
      </div>

      <button
        onClick={handleAceptar}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Aceptar
      </button>
    </div>
  );
}
