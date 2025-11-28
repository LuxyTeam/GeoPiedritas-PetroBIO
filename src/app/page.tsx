'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ContentSections from '@/components/ContentSections'
import Chatbot from '@/components/Chatbot'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>('')
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Intersection Observer para detectar la sección activa
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <main id="main-content" className="min-h-screen lg:pl-16" role="main">
      {/* Navegación fija */}
      <Navigation
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      {/* Sección principal */}
      <HeroSection onExploreClick={() => scrollToSection('que-son')} />

      {/* Secciones de contenido */}
      <ContentSections />

      {/* Footer */}
      <Footer />

      {/* Chatbot flotante */}
      <Chatbot
        isOpen={isChatOpen}
        onToggle={toggleChat}
      />
    </main>
  )
}