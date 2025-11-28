'use client'

import React from 'react'

export default function Diagenesis() {
    return (
        <section id="diagenesis" className="section-box p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 scroll-mt-24 opacity-0 transition-all duration-700">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-base mb-4 sm:mb-6">Diagénesis: Procesos Post-Deposicionales</h2>
                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-ocre-base to-ocre-dark mx-auto rounded-full"></div>
            </div>

            <p className="text-center text-brown-base/80 mb-8 sm:mb-12 text-sm sm:text-base lg:text-lg max-w-5xl mx-auto px-4">
                La diagénesis abarca las modificaciones físicas, químicas y biológicas que transforman el sedimento suelto en roca consolidada, afectando sus propiedades petrofísicas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
                {[
                    {
                        title: 'Compactación',
                        icon: 'compress',
                        color: 'from-red-400 to-red-600',
                        desc: 'Reducción del espacio entre granos debido al peso de los sedimentos suprayacentes. Aumenta la densidad y reduce la porosidad/permeabilidad.'
                    },
                    {
                        title: 'Cementación',
                        icon: 'construction',
                        color: 'from-green-400 to-green-600',
                        desc: 'Precipitación de minerales (calcita, sílice) que rellena poros y consolida la roca, reduciendo drásticamente la porosidad y permeabilidad.'
                    },
                    {
                        title: 'Disolución',
                        icon: 'leak_add',
                        color: 'from-blue-400 to-blue-600',
                        desc: 'Eliminación de minerales inestables por fluidos circulantes, lo que puede generar <strong>porosidad secundaria</strong> y mejorar la permeabilidad localmente.'
                    }
                ].map((process, index) => (
                    <div
                        key={process.title}
                        className="group hover:scale-105 transition-all duration-300"
                        style={{ animationDelay: `${index * 200}ms` }}
                    >
                        <div className={`p-6 sm:p-8 lg:p-10 bg-gradient-to-br ${process.color} rounded-2xl lg:rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/10 rounded-full -mr-8 sm:-mr-10 lg:-mr-12 -mt-8 sm:-mt-10 lg:-mt-12"></div>
                            <div className="relative">
                                <span className="material-symbols-outlined text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 block group-hover:rotate-12 transition-transform">
                                    {process.icon}
                                </span>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">{process.title}</h3>
                                <p className="text-white/90 leading-relaxed text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: process.desc }}></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-ocre-light/20 to-ocre-base/20 p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-xl">
                <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brown-base mb-6 sm:mb-8 lg:mb-10 text-center">Impacto en Propiedades Físicas</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                    {[
                        {
                            title: 'Porosidad',
                            icon: 'grid_view',
                            desc: 'Es el volumen de espacios vacíos para almacenar fluidos. La compactación y cementación la <strong class="text-red-600">disminuyen</strong>, pero la disolución puede <strong class="text-green-600">aumentarla</strong> (porosidad secundaria).'
                        },
                        {
                            title: 'Permeabilidad',
                            icon: 'water_full',
                            desc: 'Capacidad de la roca para permitir el flujo de fluidos. Se <strong class="text-red-600">reduce</strong> por cementación y compactación, perdiendo la conectividad entre poros.'
                        }
                    ].map((property, index) => (
                        <div key={property.title} className="feature-item group p-4 sm:p-6 lg:p-8 flex-col lg:flex-row text-center lg:text-left">
                            <span className="material-symbols-outlined text-3xl sm:text-4xl lg:text-5xl text-ocre-base group-hover:scale-110 transition-transform duration-300 mb-4 lg:mb-0 lg:mr-6 flex-shrink-0">
                                {property.icon}
                            </span>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brown-base mb-3 sm:mb-4">{property.title}</h3>
                                <p className="text-brown-base text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: property.desc }}></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
