// src/pages/About.jsx
import yayoImg from "../assets/yayo.jpg";
import luisImg from "../assets/luis.jpeg";
import vicenteImg from "../assets/chente.jpeg";


export default function About() {
  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      {/* Título y descripción larga */}
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">
          Sobre nosotros
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Somos estudiantes de ingeniería enfocados en ciberseguridad
          que buscan conectar el mundo de OT (Operational Technology)
          con el mundo de IT (Information Technology). Nuestro objetivo
          es demostrar que es posible monitorear y proteger entornos
          industriales de forma moderna, visual y segura, integrando
          PLCs, redes industriales, servicios en la nube y buenas
          prácticas de seguridad.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Este proyecto conecta datos reales de los PLC S7-1200 y
          S7-1500 con AWS DynamoDB, exponiendo la información a través
          de una API segura y visualizándola en un dashboard web
          responsivo. Buscamos que este tipo de soluciones sirvan como
          puente entre las áreas de automatización, TI y ciberseguridad,
          mostrando que se pueden tomar decisiones técnicas con
          información clara, en tiempo casi real y con una interfaz
          amigable.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Además de la parte técnica, este proyecto representa nuestro
          interés por profesionalizar la seguridad en entornos
          industriales: entender los riesgos, monitorear el estado de
          los equipos, detectar comportamientos anómalos y, sobre todo,
          hacerlo de una forma que cualquier operador, ingeniero o
          responsable de planta pueda entender y utilizar en su día a
          día.
        </p>
      </section>

      {/* Equipo */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Equipo de proyecto
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Ingeniero Yayo */}
          <div className="rounded-xl border bg-white shadow-sm p-4 flex flex-col items-center text-center">
            <div>
              <img
              src={yayoImg}
              alt="Yayo"
              className="mb-3 h-20 w-20 rounded-full object-cover border border-slate-300"
            />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Ingeniero Yayo
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sistema Operativos y Servidores<br />
              Integración de sistemas operativos y gestión de servidores.
            </p>
          </div>

          {/* Ingeniero Luis Martínez */}
          <div className="rounded-xl border bg-white shadow-sm p-4 flex flex-col items-center text-center">
            <div>
              <img
              src={luisImg}
              alt="Luis"
              className="mb-3 h-20 w-20 rounded-full object-cover border border-slate-300"
            />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Ingeniero Luis Martínez
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ciberseguridad &amp; FullStack<br />
              Arquitectura en la nube, APIs, monitoreo y configuración de PLC.
            </p>
          </div>

          {/* Ingeniero Vicente Cruz */}
          <div className="rounded-xl border bg-white shadow-sm p-4 flex flex-col items-center text-center">
            <div>
              <img
              src={vicenteImg}
              alt="Vicente"
              className="mb-3 h-20 w-20 rounded-full object-cover border border-slate-300"
            />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Ingeniero Vicente Cruz
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Redes &amp; Plataforma<br />
              Infraestructura, comunicación OT/IT y soporte.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}