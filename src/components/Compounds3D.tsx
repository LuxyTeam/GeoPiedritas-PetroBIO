'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ChemicalCompound } from '@/types'

// Carga dinámica del componente 3D para mejorar el rendimiento inicial
const SimpleMineral3D = dynamic(() => import('./SimpleMineral3D'), {
  loading: () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-ocre-base border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-brown-base font-bold">Cargando motor 3D...</p>
      </div>
    </div>
  ),
  ssr: false // No renderizar en servidor ya que usa window/canvas
})

// Datos de compuestos químicos importantes
const compounds: ChemicalCompound[] = [
  {
    id: 'calcite',
    name: 'Calcita',
    formula: 'CaCO₃',
    category: 'carbonate',
    color: '#f0f8ff',
    geometry: 'dodecahedron',
    opacity: 0.85,
    description: 'Mineral principal de las rocas carbonatadas. Forma cristales romboédricos y reacciona vigorosamente con ácido clorhídrico.',
    properties: ['Dureza 3', 'Reacción con HCl', 'Solubilidad en agua ácida'],
    uses: ['Cemento', 'Industria química', 'Piedra caliza'],
    formation: 'Precipitación química en ambientes marinos y alteración de depósitos orgánicos.'
  },
  {
    id: 'quartz',
    name: 'Cuarzo',
    formula: 'SiO₂',
    category: 'silicate',
    color: '#ffffff',
    geometry: 'octahedron',
    opacity: 0.7,
    description: 'Mineral más abundante en la corteza terrestre. Forma cristales hexagonales y es muy resistente a la meteorización.',
    properties: ['Dureza 7', 'Inerte químicamente', 'Alta resistencia'],
    uses: ['Industria del vidrio', 'Construcción', 'Electrónica'],
    formation: 'Cristalización del magma y precipitación en ambientes sedimentarios.'
  },
  {
    id: 'halite',
    name: 'Halita (Sal)',
    formula: 'NaCl',
    category: 'evaporite',
    color: '#e8f4fd',
    geometry: 'cube',
    opacity: 0.8,
    description: 'Mineral evaporítico que forma cristales cúbicos. Se origina por evaporación de agua de mar en ambientes áridos.',
    properties: ['Dureza 2-2.5', 'Sabor salado', 'Soluble en agua'],
    uses: ['Industria alimentaria', 'Conservación de alimentos', 'Industria química'],
    formation: 'Evaporación de aguas marinas en cuencas cerradas con clima árido.'
  },
  {
    id: 'gypsum',
    name: 'Yeso',
    formula: 'CaSO₄·2H₂O',
    category: 'sulfate',
    color: '#f5f5dc',
    geometry: 'cone',
    opacity: 0.9,
    description: 'Mineral sulfato que forma cristales prismáticos. Es blando (se raya con la uña) y común en depósitos evaporíticos.',
    properties: ['Dureza 1.5-2', 'Flexible', 'Se disuelve lentamente'],
    uses: ['Construcción (escayola)', 'Fertilizantes', 'Industria química'],
    formation: 'Evaporación de aguas ricas en sulfato de calcio en ambientes marinos.'
  },
  {
    id: 'pyrite',
    name: 'Pirita',
    formula: 'FeS₂',
    category: 'oxide',
    color: '#ffd700',
    geometry: 'box',
    opacity: 0.9,
    description: 'Sulfuro de hierro conocido como "oro de los tontos" por su color dorado. Forma cristales cúbicicos.',
    properties: ['Dureza 6-6.5', 'Brillo metálico', 'No magnético'],
    uses: ['Producción de ácido sulfúrico', 'Minería de hierro', 'Producción de azufre'],
    formation: 'Precipitación química en ambientes anaeróbicos y alteración hidrotermal.'
  },
  {
    id: 'dolomite',
    name: 'Dolomita',
    formula: 'CaMg(CO₃)₂',
    category: 'carbonate',
    color: '#faf0e6',
    geometry: 'dodecahedron',
    opacity: 0.8,
    description: 'Carbonato doble de calcio y magnesio. Menos reactivo que la calcita y forma cristales romboédricos.',
    properties: ['Dureza 3.5-4', 'Reacción débil con HCl', 'Densidad mayor que calcita'],
    uses: ['Agregado en construcción', 'Refractarios', 'Magnesio metálico'],
    formation: 'Alteración metasomática de la caliza o precipitación directa en lagunas.'
  }
]

const categoryIcons: Record<string, string> = {
  carbonate: 'gps_fixed',
  sulfate: 'science',
  silicate: 'diamond',
  oxide: 'stars',
  evaporite: 'local_drink'
}

const categoryColors: Record<string, string> = {
  carbonate: 'from-blue-400 to-blue-600',
  sulfate: 'from-green-400 to-green-600',
  silicate: 'from-purple-400 to-purple-600',
  oxide: 'from-yellow-400 to-orange-500',
  evaporite: 'from-cyan-400 to-cyan-600'
}

export default function Compounds3D() {
  const router = useRouter()
  // Aunque visualmente ya no se marca, mantenemos el estado por si la lógica lo requiere en el futuro
  const [selectedCompound, setSelectedCompound] = useState<ChemicalCompound>(compounds[0])
  const [show3DModel, setShow3DModel] = useState(false)
  const [selected3DCompound, setSelected3DCompound] = useState<ChemicalCompound | null>(null)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Vista en cuadrícula */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {compounds.map((compound, index) => (
          <div
            key={compound.id}
            // MODIFICACIÓN: Se eliminó la lógica condicional del ring (borde) de selección
            className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            onClick={() => setSelectedCompound(compound)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border-0 hover:border hover:border-stone-200/50">
              {/* Header con gradiente */}
              <div className={`p-5 bg-gradient-to-r ${categoryColors[compound.category]} text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="material-symbols-outlined text-3xl mb-3 block opacity-90">
                      {categoryIcons[compound.category]}
                    </span>
                    <h3 className="font-bold text-xl mb-1">{compound.name}</h3>
                    <p className="text-base opacity-90 font-mono tracking-wide">{compound.formula}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="material-symbols-outlined text-2xl">view_in_ar</span>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <p className="text-stone-600 text-sm mb-5 leading-relaxed line-clamp-3">
                  {compound.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-2 tracking-wider">Categoría</p>
                    <span className="inline-block px-3 py-1.5 bg-stone-50 text-stone-700 rounded-full text-sm font-medium capitalize shadow-sm">
                      {compound.category}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-3 tracking-wider">Propiedades</p>
                    <div className="flex flex-wrap gap-2">
                      {compound.properties.slice(0, 2).map((prop, idx) => (
                        <span key={idx} className="text-xs bg-gradient-to-r from-ocre-100 to-ocre-50 text-ocre-800 px-3 py-1.5 rounded-full font-medium shadow-sm">
                          {prop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botón de ver modelo 3D */}
                <button
                  onClick={() => {
                    if (compound.formula === 'SiO₂') {
                      // Redirección al modelo 3D avanzado de SiO2
                      router.push('/sio2-model')
                    } else if (compound.formula === 'CaCO₃') {
                      // Redirección al modelo 3D avanzado de Calcita
                      router.push('/calcite-model')
                    } else {
                      // Usar modelo simple para otros compuestos
                      setSelected3DCompound(compound)
                      setShow3DModel(true)
                    }
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-ocre-base to-ocre-dark text-white py-3 px-4 rounded-2xl font-semibold text-sm hover:from-ocre-dark hover:to-ocre-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined">3d_rotation</span>
                  Ver Modelo 3D
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para visualización 3D simple */}
      {show3DModel && (
        <SimpleMineral3D
          compound={selected3DCompound || compounds[0]}
          isOpen={show3DModel}
          onClose={() => {
            setShow3DModel(false)
            setSelected3DCompound(null)
          }}
        />
      )}

      {/* Nota: El modelo 3D avanzado de SiO₂ ahora se abre en página separada */}
    </div>
  )
}