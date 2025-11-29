// src/config/signals.js

// Orden en el que quieres que aparezcan en selects / resumen
export const SIGNAL_ORDER = [
  "inicio_plc1500",
  "sensor_carrera_1500",
  "sensor_capacitivo_1500",
  "inicio_plc1200",
  "sensor_carrera_1200",
  "sensor_capacitivo_1200",
];

export const SIGNALS = {
  // -------------------------------------------------------
  // PLC1500 → Colores cálidos muy diferentes entre sí
  // -------------------------------------------------------
  inicio_plc1500: {
    id: "inicio_plc1500",
    label: "Inicio PLC 1500",
    group: "PLC1500",
    type: "Entrada",
    color: "#F4C20D", // amarillo dorado (muy visible)
    description:
      "Botón enclavado para iniciar el proceso del PLC1500.",
  },

  sensor_carrera_1500: {
    id: "sensor_carrera_1500",
    label: "Sensor carrera 1500",
    group: "PLC1500",
    type: "Sensor",
    color: "#DB4437", // rojo coral intenso
    description:
      "Sensor final de carrera del PLC1500 (posición del actuador).",
  },

  sensor_capacitivo_1500: {
    id: "sensor_capacitivo_1500",
    label: "Sensor capacitivo 1500",
    group: "PLC1500",
    type: "Sensor",
    color: "#F27C22", // naranja fuerte
    description:
      "Sensor capacitivo del PLC1500 para detección de presencia.",
  },

  // -------------------------------------------------------
  // PLC1200 → Colores fríos muy diferentes
  // -------------------------------------------------------
  inicio_plc1200: {
    id: "inicio_plc1200",
    label: "Inicio PLC 1200",
    group: "PLC1200",
    type: "Entrada",
    color: "#4285F4", // azul cielo brillante
    description:
      "Botón para iniciar el proceso del PLC1200.",
  },

  sensor_carrera_1200: {
    id: "sensor_carrera_1200",
    label: "Sensor carrera 1200",
    group: "PLC1200",
    type: "Sensor",
    color: "#0F9D58", // verde profundo
    description:
      "Sensor final de carrera del PLC1200.",
  },

  sensor_capacitivo_1200: {
    id: "sensor_capacitivo_1200",
    label: "Sensor capacitivo 1200",
    group: "PLC1200",
    type: "Sensor",
    color: "#AB47BC", // morado suave muy distinguible
    description:
      "Sensor capacitivo del PLC1200 para detectar presencia.",
  },
};