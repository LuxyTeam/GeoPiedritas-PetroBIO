'use client'

import { useState, useEffect } from 'react'
import { NavigationProps } from '@/types' // Asumiendo que esta interfaz existe

const navigationGroups = [
  {
    title: 'Básicos',
    items: [
      { id: 'que-son', label: '¿Qué son?', icon: 'help' },
      { id: 'compuestos', label: 'Compuestos', icon: 'science' },
      { id: 'formacion', label: 'Formación', icon: 'history_edu' },
    ],
  },
  {
    title: 'Procesos',
    items: [
      { id: 'ambientes', label: 'Ambientes', icon: 'terrain' },
      { id: 'diagenesis', label: 'Diagénesis', icon: 'compress' },
    ],
  },
  {
    title: 'Detalles',
    items: [
      { id: 'caracteristicas', label: 'Características', icon: 'science' },
      { id: 'tipos', label: 'Tipos', icon: 'category' },
      { id: 'tabla', label: 'Tabla', icon: 'table_chart' },
    ],
  },
]

// Aplana todos los ítems para uso en mobile y lógica de sección activa
const navigationItems = navigationGroups.flatMap(group => group.items)


export default function Navigation({ activeSection, onSectionClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Header siempre visible para evitar problemas de layout
  const isVisible = true

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', updateScrollProgress)

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
    }
  }, [])

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId)
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* 1. Barra de progreso de scroll (Permanece en top-0) */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-ocre-base to-ocre-dark transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* 2. Header Superior */}
      <header className="fixed top-[3px] left-0 right-0 z-40 bg-white/70 backdrop-blur-xl border-b border-ocre-base/10 shadow-lg">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">

          {/* Logo Expandido */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 group hover:scale-[1.02] transition-all duration-300 focus-visible:focus min-w-0"
          >
            <div className="relative flex-shrink-0">
              {/* Icono de la App */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
                <img src="/icons/icon-transparent.png" alt="GeoPiedritas Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="text-left min-w-0">
              {/* Texto más grande */}
              <span className="text-lg font-bold text-brown-base block group-hover:text-ocre-base transition-colors duration-300 truncate">
                GeoPiedritas
              </span>
            </div>
          </button>

          {/* Botón menú móvil (ajustado al nuevo tamaño) */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden relative text-brown-base hover:text-ocre-base focus-visible:focus group w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ocre-base/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-300">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* 3. Sidebar minimalista siempre fijo */}
      {/* Altura fija del Header: 57px (móvil) / 65px (desktop) */}
      <nav className={`fixed top-[57px] sm:top-[65px] left-0 h-[calc(100vh-57px)] sm:h-[calc(100vh-65px)] w-16 bg-white border-r border-gray-200 shadow-lg z-30 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-2 h-full pt-6">

          {/* Solo iconos de navegación con animaciones sutiles */}
          <div className="space-y-3">
            {navigationItems.map((item, index) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center transform hover:scale-105 ${activeSection === item.id
                    ? 'bg-ocre-base text-white shadow-md' // Estilo ajustado al tema
                    : 'text-brown-base hover:bg-ocre-light/50 hover:text-ocre-dark'
                    }`}
                  title={item.label}
                >
                  <span className="material-symbols-outlined text-xl transition-transform duration-200">{item.icon}</span>
                </button>

                {/* Tooltip sutil */}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-brown-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-brown-dark"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. Overlay para cerrar menú móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  )
}