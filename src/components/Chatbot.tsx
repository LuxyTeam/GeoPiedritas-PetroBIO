'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Send,
  X,
  MessageCircle,
  Minimize2,
  Sparkles,
  Map,
  Layers,
  Search,
  Pickaxe
} from 'lucide-react'

// --- Tipos e Interfaces ---
interface Message {
  id: number
  text: React.ReactNode // Permitimos nodos para formateo (negritas, etc)
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatbotProps {
  // Propiedades opcionales para personalización externa
  primaryColor?: string
  // Propiedades opcionales para control externo del estado
  isOpen?: boolean
  onToggle?: () => void
}

export default function GeoBot({ primaryColor = '#d97706', isOpen: externalIsOpen, onToggle: externalOnToggle }: ChatbotProps) {
  // --- Estados ---
  // Usar estado externo si se proporciona, sino usar estado interno
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalOnToggle ? () => externalOnToggle() : setInternalIsOpen

  const [isHovered, setIsHovered] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy GeoBot 🪨. Tu asistente geológico virtual. Pregúntame sobre rocas, fósiles o procesos sedimentarios.",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Referencias para auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // --- Efectos ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // --- Lógica del Bot ---
  const generateResponse = async (text: string) => {
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      })

      const data = await response.json()

      let responseText = "Lo siento, tuve un problema geológico interno. ¿Podrías intentar de nuevo? 🌋"

      if (response.ok && data.text) {
        responseText = data.text
      }

      const newMessage: Message = {
        id: Date.now(),
        text: formatText(responseText),
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newMessage])
    } catch (error) {
      console.error('Error fetching chat response:', error)
      const errorMessage: Message = {
        id: Date.now(),
        text: "Parece que perdí la conexión con el núcleo. Intenta más tarde. 🔌",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Pequeña utilidad para convertir **texto** en negritas
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-brown-base font-bold">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputValue.trim()
    if (!text) return

    const newMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    generateResponse(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // --- Formateo de Hora ---
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Mexico_City'
    }).format(date)
  }

  // --- Renderizado ---
  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-slate-800">

      {/* Botón Flotante (Launcher) */}
      <div className={`transition-all duration-300 transform ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <button
          onClick={externalOnToggle || (() => setInternalIsOpen(true))}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-ocre-base to-ocre-dark text-white"
        >
          <MessageCircle size={32} className={`transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} />

          {/* Tooltip */}
          <div className="absolute right-full mr-4 bg-white text-slate-700 px-4 py-2 rounded-xl shadow-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ¡Hablemos de Geología! 🌋
          </div>
        </button>
      </div>

      {/* Ventana del Chat */}
      <div
        className={`
          fixed bottom-6 right-6 sm:absolute sm:bottom-0 sm:right-0
          flex flex-col
          w-[calc(100vw-48px)] h-[calc(100vh-120px)] sm:w-[380px] sm:h-[600px]
          bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-beige-card
          transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-20 pointer-events-none'}
        `}
      >

        {/* Header */}
        <div className="relative bg-gradient-to-r from-ocre-base to-ocre-dark p-5 flex items-center justify-between shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border-2 border-white/60 shadow-md overflow-hidden p-1">
                <img src="/icons/icon-transparent.png" alt="GeoBot" className="w-full h-full object-contain" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 border-2 border-white rounded-full shadow-md"></div>
            </div>
            <div className="text-white">
              <h3 className="font-black text-xl leading-tight drop-shadow-lg tracking-wide">GeoBot</h3>
              <p className="text-xs text-amber-100 opacity-95 font-semibold drop-shadow-md">Experto en Rocas</p>
            </div>
          </div>

          <div className="flex gap-1">
            <button
              onClick={externalOnToggle || (() => setInternalIsOpen(false))}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Decoración de fondo del header */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 bg-beige-base p-4 overflow-y-auto scroll-smooth custom-scrollbar relative">
          {/* Patrón de fondo más visible */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5d4037 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="flex flex-col gap-4 relative z-10 pb-2">
            <div className="text-center text-xs text-brown-base my-2 flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-ocre-base/60"></span>
              <span>Hoy</span>
              <span className="h-px w-12 bg-ocre-base/60"></span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                  {/* Burbuja */}
                  <div
                    className={`
                      px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed
                      ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-ocre-dark to-brown-base text-white rounded-br-none'
                        : 'bg-white text-brown-base border-2 border-beige-card rounded-tl-none'}
                    `}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-brown-base mt-1 px-1 font-medium">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Indicador de escritura (Typing Bubble) */}
            {isTyping && (
              <div className="flex w-full justify-start animate-fade-in">
                <div className="bg-white border-2 border-beige-card px-4 py-3 rounded-2xl rounded-tl-none shadow-md flex items-center gap-1.5 h-[46px]">
                  <span className="w-2 h-2 bg-ocre-base rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-ocre-base rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-ocre-base rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sugerencias Rápidas */}
        <div className="bg-beige-base px-3 py-2 flex flex-wrap gap-2 border-t-2 border-beige-card">
          <SuggestionChip icon={<Sparkles size={14} />} label="Diagénesis" onClick={() => handleSend("¿Qué es la diagénesis?")} disabled={isTyping} />
          <SuggestionChip icon={<Layers size={14} />} label="Tipos de Roca" onClick={() => handleSend("Tipos de rocas sedimentarias")} disabled={isTyping} />
          <SuggestionChip icon={<Search size={14} />} label="Fósiles" onClick={() => handleSend("¿Qué son los fósiles?")} disabled={isTyping} />
          <SuggestionChip icon={<Map size={14} />} label="Estratos" onClick={() => handleSend("Cuéntame sobre estratos")} disabled={isTyping} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 pt-2 border-t-2 border-beige-card shrink-0">
          <div className={`
            flex items-center gap-2 bg-beige-light rounded-full px-4 py-2 border-2 border-ocre-base/40 transition-colors
            ${isTyping ? 'opacity-50 cursor-not-allowed' : 'focus-within:border-ocre-base focus-within:border-opacity-100'}
          `}>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Escribe tu duda geológica..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-brown-base placeholder:text-brown-base/60"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className={`
                p-2 rounded-full transition-all duration-200
                ${inputValue.trim() && !isTyping
                  ? 'bg-ocre-base text-white hover:bg-ocre-dark shadow-md hover:scale-105 active:scale-95'
                  : 'bg-beige-card text-brown-base cursor-default'}
              `}
            >
              <Send size={16} className={inputValue.trim() ? 'ml-0.5' : ''} />
            </button>
          </div>

          <div className="text-center mt-2">
            <p className="text-[10px] text-brown-base font-medium">
              GeoBot puede cometer errores. Verifica la info importante.
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}

// --- Componente Auxiliar para Chips ---
const SuggestionChip = ({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border-2 border-ocre-base/40 shrink-0
      ${disabled
        ? 'opacity-50 cursor-not-allowed bg-beige-light text-brown-base/60'
        : 'bg-white text-brown-base hover:bg-ocre-base/10 hover:text-ocre-dark hover:border-ocre-base hover:shadow-md'}
    `}
  >
    <span className="text-ocre-base">{icon}</span>
    {label}
  </button>
)