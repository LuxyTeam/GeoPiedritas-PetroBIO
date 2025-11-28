'use client'

import React from 'react'
import { environments } from '@/data/sedimentaryData'

export default function Environments() {
    return (
        <section id="ambientes" className="section-box p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 scroll-mt-24 opacity-0 transition-all duration-700">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-base mb-4 sm:mb-6">Ambientes Sedimentarios</h2>
                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-ocre-base to-ocre-dark mx-auto rounded-full"></div>
            </div>

            <p className="text-center text-brown-base/80 mb-8 sm:mb-12 text-sm sm:text-base lg:text-lg max-w-5xl mx-auto px-4">
                Los ambientes de deposición determinan las características finales de las rocas sedimentarias, creando patrones únicos en cada tipo de ambiente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {environments.map((env, index) => (
                    <div
                        key={env.type}
                        className="group hover:scale-105 transition-all duration-300"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <div className={`h-full p-6 sm:p-8 bg-gradient-to-br ${env.color} rounded-2xl lg:rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
                            <div className="relative">
                                <span className="material-symbols-outlined text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 block group-hover:rotate-12 transition-transform">
                                    {env.icon}
                                </span>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">{env.type}</h3>
                                <p className="text-white/90 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{env.description}</p>
                                <ul className="space-y-2 sm:space-y-3">
                                    {env.characteristics.map((char, charIndex) => (
                                        <li key={charIndex} className="text-white/80 text-xs sm:text-sm flex items-start">
                                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/70 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1"></span>
                                            <span className="leading-relaxed">{char}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
