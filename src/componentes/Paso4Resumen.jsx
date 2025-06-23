// src/components/Paso4Resumen.jsx
import { useState, useEffect } from "react";

export default function Paso4Resumen({ colores, operaciones, onGuardar, resumen = [], setResumen = () => {} }) {
  const [tabla, setTabla] = useState([]);

  useEffect(() => {
    if (resumen.length > 0) {
      const clon = resumen.map(fila => {
        const nuevaFila = { color: fila.color };
        operaciones.forEach(op => {
          const celda = fila[op.nombre] || { nombre: "", total: 0 };
          nuevaFila[op.nombre] = { ...celda };
        });
        return nuevaFila;
      });
      setTabla(clon);
    } else {
      const inicial = colores.map(c => {
        const fila = { color: c.color };
        operaciones.forEach(op => {
          fila[op.nombre] = { nombre: "", total: 0 };
        });
        return fila;
      });
      setTabla(inicial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actualizarNombre = (color, op, nombre) => {
    const nueva = tabla.map(fila => {
      if (fila.color !== color) return fila;
      const nuevaFila = { ...fila };
      nuevaFila[op] = {
        nombre,
        total: nombre ? operaciones.find(o => o.nombre === op).valor * colores.find(c => c.color === color).cantidad : 0
      };
      return nuevaFila;
    });
    setTabla(nueva);
    setResumen(nueva);
  };

  const calcularPagoPorPersona = () => {
    const pagos = {};
    tabla.forEach(fila => {
      operaciones.forEach(op => {
        const { nombre, total } = fila[op.nombre];
        if (!nombre) return;
        pagos[nombre] = (pagos[nombre] || 0) + total;
      });
    });
    return pagos;
  };

  const pagos = calcularPagoPorPersona();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Agregar operario y Calcular Pagos</h2>

      <table className="w-full table-fixed border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-16">Color</th>
            {operaciones.map((op, i) => (
              <th key={i} className="border p-2 w-16 overflow-hidden truncate">{op.nombre}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.map((fila, i) => (
            <tr key={i}>
              <td className="border p-2 font-semibold">{fila.color}</td>
              {operaciones.map((op, j) => (
                <td key={j} className="border p-2 w-16 overflow-hidden">
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="Nombre"
                    value={fila[op.nombre].nombre}
                    onChange={(e) => actualizarNombre(fila.color, op.nombre, e.target.value)}
                    className="border px-1 py-1 text-xs rounded truncate"
                    style={{ width: "100px" }}  // 👈 ¡Aquí forzamos el ancho real!
                  />

                  <div className="text-xs text-gray-600 truncate max-w-14">${fila[op.nombre].total}</div>

                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h3 className="font-bold">Pagos Totales por Persona:</h3>
        <ul className="list-disc pl-6">
          {Object.entries(pagos).map(([nombre, total], i) => (
            <li key={i}>{nombre}: ${total}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onGuardar(tabla)}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
      >
        Guardar Corte
      </button>
    </div>
  );
}