'use client'

import { useEffect, useRef } from 'react'
import Compounds3D from './Compounds3D'
import IntroSection from './sections/IntroSection'
import SedimentationCycle from './sections/SedimentationCycle'
import RockClassification from './sections/RockClassification'
import Diagenesis from './sections/Diagenesis'
import Environments from './sections/Environments'
import Characteristics from './sections/Characteristics'
import DetailedTable from './sections/DetailedTable'

export default function ContentSections() {
  const sectionsRef = useRef<HTMLDivElement>(null)

  // Observador de intersección para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Seleccionamos las secciones dentro del ref para ser más específicos
    const sections = sectionsRef.current?.querySelectorAll('section[id]')
    sections?.forEach((section) => observer.observe(section))

    return () => {
      sections?.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <div ref={sectionsRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <IntroSection />

      {/* SECCIÓN 2: Compuestos Químicos */}
      <section id="compuestos" className="section-box p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 scroll-mt-24 opacity-0 transition-all duration-700">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-base mb-4 sm:mb-6">Compuestos Químicos</h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-ocre-base to-ocre-dark mx-auto rounded-full"></div>
        </div>

        <p className="text-center text-brown-base/80 mb-8 sm:mb-12 text-sm sm:text-base lg:text-lg max-w-5xl mx-auto px-4">
          Explora los compuestos químicos más importantes en rocas sedimentarias con modelos 3D interactivos.
        </p>

        {/* Contenedor de compuestos */}
        <Compounds3D />
      </section>

      <SedimentationCycle />
      <Environments />
      <Diagenesis />
      <Characteristics />
      <RockClassification />
      <DetailedTable />
    </div>
  )
}