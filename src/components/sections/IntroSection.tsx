'use client'

import React from 'react'

export default function IntroSection() {
    return (
        <section
            id="que-son"
            className="section-box p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 scroll-mt-24 opacity-0 transition-all duration-700"
            aria-labelledby="que-son-title"
            role="region"
        >
            {/* Encabezado */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <h2 id="que-son-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-base mb-4">¿Qué son las rocas sedimentarias?</h2>
                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-ocre-base to-ocre-dark mx-auto rounded-full"></div>
            </div>

            {/* Contenedor Principal: Imagen izq / Contenido der */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                {/* COLUMNA IMAGEN (Ocupa 5 columnas en desktop) */}
                <div className="lg:col-span-5 order-1 lg:order-1">
                    <div className="relative group w-full h-64 sm:h-80 lg:h-[400px] xl:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        <img
                            src="/images/estratificacion-rocas.jpg"
                            alt="Estratos de Roca Sedimentaria"
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'https://placehold.co/400x600/5d4037/ffffff?text=Roca+Sedimentaria'
                            }}
                        />
                        {/* Overlay gradiente para profundidad */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brown-base/60 via-transparent to-transparent opacity-60"></div>

                        {/* Etiqueta flotante sobre la imagen */}
                        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                            <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-lg">
                                <p className="text-brown-base text-xs sm:text-sm font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-ocre-base">layers</span>
                                    Estratificación visible
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA TEXTO (Ocupa 7 columnas en desktop) */}
                <div className="lg:col-span-7 order-2 lg:order-2 flex flex-col justify-center">
                    <p className="text-brown-base leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl font-medium">
                        Las rocas sedimentarias son como las páginas de un libro de historia: se forman a partir de la <span className="text-ocre-base font-bold">acumulación, compactación y cementación</span> de sedimentos a lo largo de millones de años.
                    </p>

                    <p className="text-brown-base/80 mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider font-bold">
                        Estos sedimentos provienen de:
                    </p>

                    {/* Grid de 3 tarjetas pequeñas */}
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
                        {[
                            { title: 'Rocas Previas', icon: 'landscape', color: 'text-emerald-700', bg: 'bg-emerald-50', desc: 'Fragmentos erosionados' },
                            { title: 'Minerales', icon: 'science', color: 'text-sky-700', bg: 'bg-sky-50', desc: 'Disueltos en agua' },
                            { title: 'Orgánicos', icon: 'pets', color: 'text-amber-700', bg: 'bg-amber-50', desc: 'Fósiles y restos' }
                        ].map((card) => (
                            <div key={card.title} className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${card.bg} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                                    <span className={`material-symbols-outlined text-lg sm:text-2xl ${card.color}`}>{card.icon}</span>
                                </div>
                                <h4 className="font-bold text-brown-base text-xs sm:text-sm mb-1">{card.title}</h4>
                                <p className="text-xs text-stone-500 hidden xs:block">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Caja de Dato Importante "Highlight" */}
                    <div className="relative bg-ocre-base/10 p-4 sm:p-6 lg:p-8 rounded-2xl border-l-4 border-ocre-base">
                        <span className="material-symbols-outlined absolute top-4 sm:top-6 right-4 sm:right-6 text-ocre-base/20 text-4xl sm:text-6xl -rotate-12 select-none">lightbulb</span>
                        <div className="relative z-10">
                            <h3 className="text-ocre-dark font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined">info</span>
                                ¿Por qué son importantes?
                            </h3>
                            <p className="text-brown-base text-sm sm:text-base leading-relaxed">
                                Cubren el <strong className="text-brown-dark">75% de la superficie continental</strong>. Son la clave para entender el pasado de la Tierra, ya que son las únicas que pueden contener <strong>fósiles</strong> y reservas de energía como petróleo y gas.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
