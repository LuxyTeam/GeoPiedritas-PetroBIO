'use client'

import React from 'react'
import { rockTypes } from '@/data/sedimentaryData'

export default function DetailedTable() {
    // Función para obtener el nombre legible de la clase
    const getClassDisplayName = (className: string) => {
        const classNames: { [key: string]: string } = {
            'clasticas': 'Clásticas',
            'quimicas': 'Químicas',
            'bioquimicas': 'Bioquímicas'
        }
        return classNames[className] || className
    }

    return (
        <section id="tabla" className="section-box p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 scroll-mt-24 opacity-0 transition-all duration-700">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-base mb-4 sm:mb-6">Tabla Clasificatoria Detallada</h2>
                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-ocre-base to-ocre-dark mx-auto rounded-full"></div>
            </div>

            <div className="overflow-x-auto rounded-2xl lg:rounded-3xl shadow-2xl">
                <table
                    className="w-full bg-white min-w-[800px]"
                    role="table"
                    aria-label="Tabla de clasificación de rocas sedimentarias"
                >
                    <thead>
                        <tr className="bg-gradient-to-r from-ocre-base to-ocre-dark text-white">
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg">Clase</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg">Roca</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg">Origen</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg">Composición</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg hidden lg:table-cell">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rockTypes.map((rock, index) => (
                            <tr
                                key={rock.rock}
                                className={`border-b border-gray-100 hover:bg-ocre-light/30 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                                    }`}
                            >
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                                    <span className={`inline-block px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${rock.class === 'clasticas'
                                        ? 'bg-amber-100 text-amber-800'
                                        : rock.class === 'quimicas'
                                            ? 'bg-cyan-100 text-cyan-800'
                                            : 'bg-lime-100 text-lime-800'
                                        }`}>
                                        {getClassDisplayName(rock.class)}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 font-bold text-brown-base text-sm sm:text-base lg:text-lg">{rock.rock}</td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-brown-base/80 leading-relaxed text-xs sm:text-sm lg:text-base hidden sm:table-cell">{rock.origin}</td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-brown-base/80 leading-relaxed text-xs sm:text-sm lg:text-base hidden lg:table-cell">{rock.chemicalComposition}</td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-brown-base/80 leading-relaxed text-xs sm:text-sm hidden xl:table-cell">{rock.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Nota móvil sobre la tabla */}
                <div className="sm:hidden bg-amber-50 border-l-4 border-amber-400 p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="material-symbols-outlined text-amber-400">info</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-amber-700">
                                <strong>Nota:</strong> Desliza horizontalmente para ver todas las columnas de la tabla.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
