// Tipos para el chatbot
export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  isOpen: boolean
}

// Tipos para la navegación
export interface NavigationProps {
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

// Tipos para los minerales 3D
export interface Mineral3D {
  id: string
  name: string
  formula: string
  geometry: 'box' | 'cone' | 'octahedron' | 'dodecahedron' | 'cube'
  color: string
  opacity: number
}

// Tipos para las secciones de contenido
export interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
}

// Tipos para los elementos de características
export interface FeatureItem {
  icon: string
  title: string
  description: string
}

// Tipos para la tabla de clasificación
export interface RockType {
  class: string
  rock: string
  origin: string
  chemicalComposition: string
  description: string
  image?: string
}

// Tipos para el estado de la aplicación
export interface AppState {
  activeSection: string
  chatOpen: boolean
  currentMineral: string
  isRotating: boolean
}

// Tipos para los compuestos químicos
export interface ChemicalCompound {
  id: string
  name: string
  formula: string
  category: 'carbonate' | 'sulfate' | 'silicate' | 'oxide' | 'evaporite'
  color: string
  geometry: 'box' | 'cone' | 'octahedron' | 'dodecahedron' | 'cube' | 'sphere'
  opacity: number
  description: string
  properties: string[]
  uses: string[]
  formation: string
}