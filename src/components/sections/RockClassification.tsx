'use client'

import React, { useState } from 'react'
import { rockTypes } from '@/data/sedimentaryData'

export default function RockClassification() {
    const [activeTab, setActiveTab] = useState('clasticas')

    const filteredRocks = rockTypes.filter(rock =>
        activeTab === 'all' || rock.class.toLowerCase() === activeTab.toLowerCase()
    )

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
        <section id="tipos" className="section-box p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 scroll-mt-24 opacity-0 transition-all duration-700">
            <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-base mb-4 sm:mb-6">Clasificación de Rocas Sedimentarias</h2>
                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-ocre-base to-ocre-dark mx-auto rounded-full mb-6 sm:mb-8"></div>

                <p className="text-center text-brown-base/80 text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-4">
                    No todas las rocas sedimentarias son iguales. Los geólogos las dividen en grandes grupos según el mecanismo que las creó.
                </p>
            </div>

            {/* Pestañas de navegación (Tabs) */}
            <div className="flex justify-center mb-8 sm:mb-12">
                <div
                    className="bg-stone-100 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 sm:gap-2 shadow-inner max-w-full overflow-x-auto"
                    role="tablist"
                    aria-label="Clasificación de rocas sedimentarias"
                >
                    {[
                        { id: 'all', label: 'Ver Todas', icon: 'grid_view' },
                        { id: 'clasticas', label: 'Clásticas', icon: 'landscape' },
                        { id: 'quimicas', label: 'Químicas', icon: 'science' },
                        { id: 'organicas', label: 'Orgánicas', icon: 'forest' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            id={`rock-tab-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`rock-panel-${tab.id}`}
                            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                                ? 'bg-white text-brown-base shadow-md scale-100 ring-1 ring-black/5'
                                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm sm:text-xl">{tab.icon}</span>
                            <span className="hidden xs:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de rocas */}
            <div
                id={`rock-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`rock-tab-${activeTab}`}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
            >
                {filteredRocks.map((rock) => {
                    // Lógica de estilos según el tipo de roca
                    const getTypeStyles = (type: string) => {
                        const t = type.toLowerCase();
                        if (t.includes('clasticas') || t.includes('clástica')) return {
                            border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-900', icon: 'landscape', badge: 'bg-amber-200'
                        };
                        if (t.includes('quimicas') || t.includes('química') || t.includes('evaporita')) return {
                            border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-900', icon: 'science', badge: 'bg-cyan-200'
                        };
                        if (t.includes('organicas') || t.includes('orgánica')) return {
                            border: 'border-stone-500', bg: 'bg-stone-50', text: 'text-stone-900', icon: 'forest', badge: 'bg-stone-200'
                        };
                        return {
                            border: 'border-gray-500', bg: 'bg-gray-50', text: 'text-gray-900', icon: 'help', badge: 'bg-gray-200'
                        };
                    };

                    const style = getTypeStyles(rock.class);

                    return (
                        <div
                            key={rock.rock}
                            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col"
                            role="article"
                            aria-label={`Roca: ${rock.rock}`}
                        >
                            {/* Indicador de color lateral */}
                            <div className={`absolute top-0 bottom-0 left-0 w-2 ${style.bg.replace('50', '500')}`}></div>

                            <div className="p-4 sm:p-6 lg:p-8 pl-6 sm:pl-8 flex-grow">
                                {/* Encabezado de la Tarjeta */}
                                <div className="flex justify-between items-start mb-4 sm:mb-6">
                                    <div className="min-w-0 flex-1">
                                        <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-xs font-bold tracking-wider mb-2 ${style.bg} ${style.text}`}>
                                            <span className="material-symbols-outlined text-xs">{style.icon}</span>
                                            {getClassDisplayName(rock.class)}
                                        </span>
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brown-base group-hover:text-ocre-base transition-colors">
                                            {rock.rock}
                                        </h3>
                                    </div>
                                    {/* Icono decorativo grande y sutil */}
                                    <span className={`material-symbols-outlined text-3xl sm:text-4xl lg:text-5xl opacity-10 group-hover:opacity-20 transition-opacity ${style.text} flex-shrink-0 ml-2`}>
                                        {style.icon}
                                    </span>
                                </div>

                                {/* Grid de detalles (Origen y Composición) */}
                                <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
                                    <div className="bg-stone-50 p-3 sm:p-4 rounded-xl">
                                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Origen</p>
                                        <p className="text-brown-base text-xs sm:text-sm font-medium leading-snug">{rock.origin}</p>
                                    </div>
                                    <div className="bg-stone-50 p-3 sm:p-4 rounded-xl">
                                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Composición</p>
                                        <p className="text-brown-base text-xs sm:text-sm font-medium leading-snug">{rock.chemicalComposition}</p>
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div>
                                    <p className="text-xs font-bold text-stone-400 uppercase mb-2">Características</p>
                                    <p className="text-brown-base/80 text-xs sm:text-sm leading-relaxed">
                                        {rock.description}
                                    </p>
                                </div>
                            </div>

                            {/* Footer decorativo (opcional) */}
                            <div className={`h-1 w-full sm:h-1.5 ${style.bg} opacity-50`}></div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}
