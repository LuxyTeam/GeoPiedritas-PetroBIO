'use client'

import React from 'react'
import { rockTypes } from '@/data/sedimentaryData'

export default function DetailedTable() {
    // Función para obtener el nombre legible de la clase
    const getClassDisplayName = (className: string) => {
        const classNames: { [key: string]: string } = {
            'clasticas': 'Clásticas',
            'quimicas': 'Químicas',
            'organicas': 'Orgánicas'
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
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center font-bold text-sm sm:text-base lg:text-lg w-[15%]">Clase</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg w-[15%]">Roca</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center font-bold text-sm sm:text-base lg:text-lg w-[15%]">Imagen</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg w-[20%]">Origen</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg w-[20%]">Composición</th>
                            <th scope="col" className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-bold text-sm sm:text-base lg:text-lg hidden lg:table-cell w-[15%]">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rockTypes.map((rock, index) => (
                            <tr
                                key={rock.rock}
                                className={`border-b border-gray-100 hover:bg-ocre-light/30 transition-all duration-300 align-middle ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                                    }`}
                            >
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center align-middle">
                                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm ${rock.class === 'clasticas'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                        : rock.class === 'quimicas'
                                            ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                                            : 'bg-stone-100 text-stone-800 border border-stone-200'
                                        }`}>
                                        {getClassDisplayName(rock.class)}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 font-bold text-brown-base text-sm sm:text-base lg:text-lg align-middle">{rock.rock}</td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 align-middle">
                                    <div className="flex justify-center items-center">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-md border-2 border-white ring-1 ring-gray-200 relative bg-gray-100 group">
                                            {rock.image ? (
                                                <img
                                                    src={rock.image}
                                                    alt={rock.rock}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.style.display = 'none'
                                                        target.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                                                        if (target.parentElement) {
                                                            target.parentElement.innerHTML = '<span class="material-symbols-outlined text-gray-400">image_not_supported</span>'
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <span className="material-symbols-outlined">image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-brown-base/80 leading-relaxed text-xs sm:text-sm lg:text-base hidden sm:table-cell align-middle">{rock.origin}</td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-brown-base/80 leading-relaxed text-xs sm:text-sm lg:text-base hidden lg:table-cell align-middle">{rock.chemicalComposition}</td>
                                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-brown-base/80 leading-relaxed text-xs sm:text-sm hidden xl:table-cell align-middle">{rock.description}</td>
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
