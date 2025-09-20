import { useState, useEffect } from "react";
import "./style.css";

export default function Paso4Resumen({
  colores = [],
  operaciones = [],
  onGuardar,
  resumen = [],
  setResumen = () => {}
}) {
  const [tabla, setTabla] = useState([]);

  const colorFromString = (str) => {
    if (!str) return { bg: "#fff", border: "#ddd", text: "#111" };
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
    const bg = `hsl(${h} 70% 92%)`;
    const border = `hsl(${h} 60% 35%)`;
    return { bg, border };
  };

  useEffect(() => {
    if (Array.isArray(resumen) && resumen.length > 0) {
      const clon = resumen.map((fila) => {
        const filaNueva = { color: fila.color || "" };
        operaciones.forEach((op) => {
          const cell = fila[op.nombre];
          if (Array.isArray(cell)) {
            filaNueva[op.nombre] = cell.map((p) => ({
              nombre: p?.nombre || "",
              cantidad: Number(p?.cantidad) || 0,
              total:
                Number(p?.total) || (Number(p?.cantidad) || 0) * op.valor,
            }));
          } else {
            const cantidadColor =
              Number(colores.find((c) => c.color === fila.color)?.cantidad) ||
              0;
            filaNueva[op.nombre] = [
              {
                nombre: "",
                cantidad: cantidadColor,
                total: cantidadColor * op.valor,
              },
            ];
          }
        });
        return filaNueva;
      });
      setTabla(clon);
      setResumen(clon);
    } else {
      const inicial = (colores || []).map((c) => {
        const fila = { color: c.color };
        operaciones.forEach((op) => {
          const cantidadColor = Number(c.cantidad) || 0;
          fila[op.nombre] = [
            {
              nombre: "",
              cantidad: cantidadColor,
              total: cantidadColor * op.valor,
            },
          ];
        });
        return fila;
      });
      setTabla(inicial);
      setResumen(inicial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colores, operaciones]);

  const guardarTabla = (nueva) => {
    setTabla(nueva);
    setResumen(nueva);
  };

  const agregarOperario = (color, opNombre) => {
    const nueva = tabla.map((fila) => {
      if (fila.color !== color) return fila;
      const arr = Array.isArray(fila[opNombre]) ? [...fila[opNombre]] : [];
      arr.push({ nombre: "", cantidad: 0, total: 0 });
      return { ...fila, [opNombre]: arr };
    });
    guardarTabla(nueva);
  };

  const eliminarOperario = (color, opNombre, index) => {
    const nueva = tabla.map((fila) => {
      if (fila.color !== color) return fila;
      const arr = [...(fila[opNombre] || [])];
      arr.splice(index, 1);
      return { ...fila, [opNombre]: arr.length ? arr : [] };
    });
    guardarTabla(nueva);
  };

  const actualizarPersona = (color, opNombre, index, campo, valor) => {
    const nueva = tabla.map((fila) => {
      if (fila.color !== color) return fila;
      const arr = [...(fila[opNombre] || [])];
      const persona = { ...arr[index] };

      if (campo === "nombre") {
        persona.nombre = valor;
      } else if (campo === "cantidad") {
        let nuevaCantidad = parseInt(valor, 10);
        if (Number.isNaN(nuevaCantidad)) nuevaCantidad = 0;
        const valorOp =
          operaciones.find((o) => o.nombre === opNombre)?.valor || 0;
        persona.cantidad = nuevaCantidad;
        persona.total = nuevaCantidad * valorOp;
      }

      arr[index] = persona;
      return { ...fila, [opNombre]: arr };
    });

    guardarTabla(nueva);
  };

  const calcularPagoPorPersona = () => {
    const pagos = {};
    tabla.forEach((fila) => {
      operaciones.forEach((op) => {
        (fila[op.nombre] || []).forEach((p) => {
          if (!p?.nombre) return;
          pagos[p.nombre] =
            (pagos[p.nombre] || 0) + Number(p.total || 0);
        });
      });
    });
    return pagos;
  };

  const pagos = calcularPagoPorPersona();

  // ---------- RENDER ----------
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Agregar operarios y Calcular Pagos
      </h2>

      <div className="tabla-contenedor">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr>
              <th
                className="sticky left-0 top-0 z-40 bg-gray-800 text-white border p-2 w-28 text-center"
                style={{ minWidth: 120 }}
              >
                Color
              </th>
              {operaciones.map((op, i) => (
                <th
                  key={i}
                  className="sticky top-0 bg-gray-800 text-white border p-2 text-center"
                  style={{ minWidth: 220 }}
                >
                  {op.nombre}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tabla.map((fila, rowIndex) => {
              const band = colorFromString(String(fila.color));
              return (
                <tr key={rowIndex}>
                  <td
                    className="sticky left-0 z-30 border p-2 font-semibold text-center"
                    style={{
                      background: band.bg,
                      borderLeft: `6px solid ${band.border}`,
                      minWidth: 120,
                      color: "#000",
                    }}
                  >
                    {fila.color}
                  </td>

                  {operaciones.map((op, colIndex) => {
                    const personas = fila[op.nombre] || [];
                    return (
                      <td key={colIndex} className="border p-2 align-top">
                        {personas.map((p, idx) => (
                          <div key={idx} className="mb-2">
                            {/* cantidad + nombre + botones en la misma fila */}
                            <div className="celda">
                              <input
                                type="number"
                                min={0}
                                value={p.cantidad}
                                onChange={(e) =>
                                  actualizarPersona(
                                    fila.color,
                                    op.nombre,
                                    idx,
                                    "cantidad",
                                    e.target.value
                                  )
                                }
                                placeholder="#"
                              />

                              <input
                                type="text"
                                value={p.nombre}
                                onChange={(e) =>
                                  actualizarPersona(
                                    fila.color,
                                    op.nombre,
                                    idx,
                                    "nombre",
                                    e.target.value
                                  )
                                }
                                placeholder="Nombre"
                              />

                              <button
                                onClick={() =>
                                  eliminarOperario(fila.color, op.nombre, idx)
                                }
                                className="text-red-600 font-bold"
                                title="Eliminar operario"
                              >
                                ✕
                              </button>

                              <button
                                onClick={() =>
                                  agregarOperario(fila.color, op.nombre)
                                }
                                className="text-green-600 font-bold"
                                title="Agregar operario"
                              >
                                +
                              </button>
                            </div>

                            {/* total debajo */}
                            <div className="total">${p.total}</div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-bold">Pagos Totales por Persona:</h3>
        <ul className="list-disc pl-6 text-sm">
          {Object.keys(pagos).length === 0 ? (
            <li className="text-gray-500">Aún no hay pagos registrados</li>
          ) : (
            Object.entries(pagos).map(([nombre, total], i) => (
              <li key={i}>
                {nombre}: ${total}
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => typeof onGuardar === "function" && onGuardar(tabla)}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Guardar Corte
        </button>

        <button
          onClick={() => { setTabla(tabla); setResumen(tabla); }}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Sincronizar
        </button>
      </div>
    </div>
  );
}
