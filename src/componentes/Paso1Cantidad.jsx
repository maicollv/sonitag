import { useNavigate } from "react-router-dom";

export default function Paso1Cantidad({
  cantidadTotal,
  setCantidadTotal,
  nombreCorte,
  setNombreCorte,
  siguiente,
}) {
  const navigate = useNavigate();

  const handleAceptar = () => {
    if (!nombreCorte.trim() || cantidadTotal <= 0) {
      alert("Por favor, ingresa un nombre y una cantidad válida.");
      return;
    }
    navigate(siguiente);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800">Crear Nuevo Corte</h2>

      <div>
        <label className="font-medium text-gray-700 block mb-1">Nombre del Corte:</label>
        <input
          type="text"
          value={nombreCorte}
          onChange={(e) => setNombreCorte(e.target.value)}
          placeholder="Ej: Corte Azul 1"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div>
        <label className="font-medium text-gray-700 block mb-1">Cantidad Total de Chaquetas:</label>
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidadTotal > 0 ? cantidadTotal : ""}
          onChange={(e) => setCantidadTotal(Number(e.target.value))}
          min={1}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <button
        onClick={handleAceptar}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        Aceptar
      </button>
    </div>
  );
}
