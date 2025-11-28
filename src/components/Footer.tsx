'use client'

import { useState, useEffect } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <footer className={`relative mt-12 sm:mt-16 lg:mt-20 transition-all duration-1000 border-t border-ocre-base/10 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Fondo decorativo suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-beige-light via-beige-base to-beige-card opacity-60"></div>
      
      <div className="relative z-10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Identidad de Marca */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-ocre-base to-ocre-dark rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6 sm:w-8 sm:h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351A2.43 2.43 0 0 0 14.1 20.932l3.473-1.737a2.515 2.515 0 0 0 1.251-2.185v-4.004a2.5 2.5 0 0 0-1.251-2.186l-3.474-1.737a2.5 2.5 0 0 0-2.516 0l-3.473 1.737a2.515 2.515 0 0 0-1.251 2.185v4.004a2.5 2.5 0 0 0 1.251 2.186l3.474 1.737a2.43 2.43 0 0 0 2.632 0Zm-.724-.038a.987.987 0 0 0-.987.001L6.35 20.59a.992.992 0 0 0-.498.875v4.004a.999.999 0 0 0 .498.876l3.473 1.737a.992.992 0 0 0 1.004 0l3.474-1.737a.999.999 0 0 0 .498-.876v-4.004a.992.992 0 0 0-.498-.875l-3.474-1.737a.987.987 0 0 0-.987-.001ZM12 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-brown-base">GeoPiedritas</h3>
              <p className="text-xs sm:text-sm text-brown-base/70 font-medium tracking-wide uppercase">Rocas Sedimentarias Educativo</p>
            </div>
          </div>
          
          {/* Descripción */}
          <p className="text-brown-base/80 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed px-4">
            Plataforma educativa interactiva para el estudio y comprensión de las rocas sedimentarias,
            su formación, clasificación e importancia geológica.
          </p>
          
          {/* Separador */}
          <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-ocre-base/20 mx-auto rounded-full mb-6 sm:mb-8"></div>
          
          {/* Footer Inferior: Copyright y Etiqueta */}
          <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 text-brown-base/60">
              <span className="material-symbols-outlined text-sm sm:text-lg">copyright</span>
              <span>{currentYear} - Todos los derechos reservados</span>
            </div>
            
            <div className="hidden xs:block w-1 h-1 bg-ocre-base rounded-full"></div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-brown-base/60">
              <span className="material-symbols-outlined text-sm sm:text-lg">school</span>
              <span>Contenido educativo</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}