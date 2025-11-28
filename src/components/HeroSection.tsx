'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeroSectionProps {
  onExploreClick: () => void
}

const quickNavItems = [
  { id: 'que-son', icon: 'help', label: '¿Qué son?', description: 'Definición básica' },
  { id: 'formacion', icon: 'history_edu', label: 'Formación', description: 'Ciclo sedimentario' }, // Icono más narrativo
  { id: 'diagenesis', icon: 'compress', label: 'Diagénesis', description: 'Litificación' },
  { id: 'ambientes', icon: 'terrain', label: 'Ambientes', description: 'Lugar de depósito' }, // Icono más natural
  { id: 'tipos', icon: 'grid_view', label: 'Tipos', description: 'Clasificación' },
]

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Ajuste de offset para el header fijo si existe
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 1. FONDO DE IMAGEN CON OVERLAY */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1491466424936-e304919aada7?q=80&w=2070&auto=format&fit=crop"
          alt="Fondo Geológico - Estratos Sedimentarios (The Wave)"
          fill
          priority
          className="object-cover opacity-20 sm:opacity-30"
          sizes="100vw"
          quality={90}
        />
        {/* Gradiente superpuesto para suavizar */}
        <div className="absolute inset-0 bg-gradient-to-b from-beige-light/90 via-beige-base/95 to-beige-light"></div>
        {/* Overlay adicional para móviles */}
        <div className="absolute inset-0 bg-beige-base/30 sm:bg-transparent"></div>
      </div>

      {/* 2. ELEMENTOS DECORATIVOS FLOTANTES (Fondo) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] text-ocre-base/5 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold select-none rotate-12 hidden sm:block">SiO₂</div>
        <div className="absolute bottom-[20%] right-[5%] text-brown-base/5 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold select-none -rotate-12 hidden sm:block">CaCO₃</div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <div className={`relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>

        {/* TÍTULO con animaciones sutiles */}
        <div className="mb-10 md:mb-14">
          <span className="inline-block py-1.5 px-4 rounded-full bg-ocre-base/10 text-ocre-dark text-xs sm:text-sm font-bold tracking-widest mb-6 border border-ocre-base/20 animate-fade-in-up transition-all duration-300 shadow-sm backdrop-blur-sm">
            GEOLOGÍA Y CIENCIAS DE LA TIERRA
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-brown-base mb-6 leading-tight tracking-tight drop-shadow-sm">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-brown-base/80 mb-2">Rocas</span>
            {/* Texto con gradiente de textura */}
            <span className="bg-gradient-to-r from-ocre-dark via-ocre-base to-brown-base bg-clip-text text-transparent relative inline-block pb-2">
              Sedimentarias
              {/* Subrayado decorativo */}
              <svg className="absolute w-full h-2 sm:h-3 -bottom-1 left-0 text-ocre-base opacity-60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99996C18.4477 9.99996 47.0751 0.518625 105.344 0.999961C193.652 1.72929 203.061 5.89437 200.279 8.00018" stroke="currentColor" strokeWidth="2 sm:3"></path></svg>
            </span>
          </h1>
        </div>

        {/* SUBTÍTULO */}
        <div className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-lg sm:text-xl md:text-2xl text-brown-base/80 mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            El archivo histórico de nuestro planeta. Descubre cómo el tiempo, la presión y el agua convierten la arena en piedra.
          </p>

          <button
            onClick={onExploreClick}
            className="group relative inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-brown-base text-white rounded-full text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ocre-base to-ocre-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="material-symbols-outlined relative z-10 transition-transform group-hover:rotate-45">explore</span>
            <span className="relative z-10">Comenzar Exploración</span>
          </button>
        </div>

        {/* NAVEGACIÓN RÁPIDA (Tarjetas Glassmorphism Mejoradas) */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 px-4">
            {quickNavItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/50 transition-all duration-300 hover:-translate-y-2 text-center ring-1 ring-white/20"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-ocre-base to-ocre-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white ring-2 ring-white/50">
                  <span className="material-symbols-outlined text-2xl sm:text-3xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-brown-base text-sm sm:text-base mb-1 group-hover:text-ocre-base transition-colors duration-200">{item.label}</h3>
                <span className="text-xs text-brown-base/70 hidden sm:block lg:block font-medium">{item.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SCROLL INDICATOR sin parpadeos */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-60 animate-bounce">
          <span className="material-symbols-outlined text-4xl text-brown-base">keyboard_arrow_down</span>
        </div>

      </div>
    </section>
  )
}