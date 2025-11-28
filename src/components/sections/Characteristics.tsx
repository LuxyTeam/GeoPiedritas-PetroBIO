'use client'

import React from 'react'
import { characteristics } from '@/data/sedimentaryData'

export default function Characteristics() {
    return (
        <section id="caracteristicas" className="section-box p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 scroll-mt-24 opacity-0 transition-all duration-700">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-base mb-4 sm:mb-6">Características Principales</h2>
                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-ocre-base to-ocre-dark mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {characteristics.map((char, index) => (
                    <div
                        key={char.title}
                        className="group hover:scale-105 transition-all duration-300"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <div className="card-icon p-6 sm:p-8 h-full rounded-2xl lg:rounded-3xl group-hover:shadow-2xl transition-all duration-300">
                            <div className="text-center lg:text-left">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-20 bg-gradient-to-br from-ocre-base to-ocre-dark rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-4 sm:mb-6 shadow-lg">
                                    <span className="material-symbols-outlined text-white text-2xl sm:text-3xl group-hover:rotate-12 transition-transform duration-300">
                                        {char.icon}
                                    </span>
                                </div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brown-base mb-3 sm:mb-4">{char.title}</h3>
                                <p className="text-brown-base/80 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{char.description}</p>
                                <ul className="space-y-2 sm:space-y-3 text-left">
                                    {char.details.map((detail, detailIndex) => (
                                        <li key={detailIndex} className="text-brown-base text-xs sm:text-sm flex items-start">
                                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-ocre-base rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{detail}</span>
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
