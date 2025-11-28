'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Mineral3D } from '@/types'

// Importar Three.js solo cuando sea necesario
let THREE: typeof import('three') | null = null
import * as THREE_TYPES from 'three'

interface MineralVisualization3DProps {
  onMineralChange?: (mineralName: string) => void
}

const minerals: Mineral3D[] = [
  {
    id: 'halite',
    name: 'Halita (Sal de roca)',
    formula: 'NaCl',
    geometry: 'box',
    color: '#e8f4fd',
    opacity: 0.8,
  },
  {
    id: 'gypsum',
    name: 'Yeso',
    formula: 'CaSO₄·2H₂O',
    geometry: 'cone',
    color: '#f5f5dc',
    opacity: 0.9,
  },
  {
    id: 'quartz',
    name: 'Cuarzo',
    formula: 'SiO₂',
    geometry: 'octahedron',
    color: '#ffffff',
    opacity: 0.7,
  },
  {
    id: 'calcite',
    name: 'Calcita',
    formula: 'CaCO₃',
    geometry: 'dodecahedron',
    color: '#f0f8ff',
    opacity: 0.85,
  },
  {
    id: 'pyrite',
    name: 'Pirita',
    formula: 'FeS₂',
    geometry: 'cube',
    color: '#ffd700',
    opacity: 0.9,
  },
]

const mineralIcons = {
  halite: 'science',
  gypsum: 'landscape',
  quartz: 'diamond',
  calcite: 'gps_fixed',
  pyrite: 'stars'
}

export default function MineralVisualization3D({ onMineralChange }: MineralVisualization3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const mineralRef = useRef<any>(null)
  const animationIdRef = useRef<number | null>(null)
  const controlsRef = useRef<any>(null)
  
  const [currentMineral, setCurrentMineral] = useState(minerals[0])
  const [isRotating, setIsRotating] = useState(true)
  const [loading, setLoading] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(1)
  const [showWireframe, setShowWireframe] = useState(false)
  const [particles, setParticles] = useState<any[]>([])

  // Crear sistema de partículas mejorado
  const createParticles = useCallback((scene: any) => {
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      colors[i * 3] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.4
      colors[i * 3 + 2] = 0.4 + Math.random() * 0.6
    }
    
    const geometry = new (THREE as any).BufferGeometry()
    geometry.setAttribute('position', new (THREE as any).BufferAttribute(positions, 3))
    geometry.setAttribute('color', new (THREE as any).BufferAttribute(colors, 3))
    
    const material = new (THREE as any).PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    })
    
    const particleSystem = new (THREE as any).Points(geometry, material)
    scene.add(particleSystem)
    
    return particleSystem
  }, [])

  useEffect(() => {
    if (!mountRef.current) return

    const initThreeJS = async () => {
      try {
        // Cargar Three.js dinámicamente para mejor rendimiento
        if (!THREE) {
          THREE = await import('three')
        }
        
        initializeThreeJS()
        setupControls()
        createMineral(currentMineral)
        createParticleSystem()
        animate()
        handleResize()
        
        setLoading(false)
        
        return () => {
          cleanup()
        }
      } catch (error) {
        console.error('Error inicializando Three.js:', error)
        setLoading(false)
      }
    }

    const cleanupFn = initThreeJS()
    
    return () => {
      cleanupFn.then(cleanup => cleanup && cleanup())
    }
  }, [])

  // Crear mineral cuando cambia la selección
  useEffect(() => {
    if (sceneRef.current) {
      createMineral(currentMineral)
      onMineralChange?.(currentMineral.name)
    }
  }, [currentMineral, onMineralChange])

  const initializeThreeJS = () => {
    if (!mountRef.current) return

    // Crear escena con fondo gradiente
    const scene = new (THREE as any).Scene()
    scene.background = new (THREE as any).Color(0xf8f9fa)
    scene.fog = new (THREE as any).Fog(0xf8f9fa, 10, 50)
    sceneRef.current = scene

    // Crear cámara con mejor perspectiva
    const camera = new (THREE as any).PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(3, 2, 3)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Crear renderer con configuraciones mejoradas
    const renderer = new (THREE as any).WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = (THREE as any).PCFSoftShadowMap
    renderer.toneMapping = (THREE as any).ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Añadir iluminación avanzada
    setupAdvancedLighting()

    // Manejar redimensionamiento
    window.addEventListener('resize', handleResize)
  }

  const setupAdvancedLighting = () => {
    if (!sceneRef.current) return

    // Luz ambiental suave
    const ambientLight = new (THREE as any).AmbientLight(0xffffff, 0.4)
    sceneRef.current.add(ambientLight)

    // Luz direccional principal con sombras suaves
    const directionalLight = new (THREE as any).DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.camera.left = -10
    directionalLight.shadow.camera.right = 10
    directionalLight.shadow.camera.top = 10
    directionalLight.shadow.camera.bottom = -10
    sceneRef.current.add(directionalLight)

    // Luz de relleno
    const fillLight = new (THREE as any).DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(-5, 3, -5)
    sceneRef.current.add(fillLight)

    // Luz puntual principal
    const pointLight1 = new (THREE as any).PointLight(0xffffff, 0.8, 100)
    pointLight1.position.set(0, 5, 0)
    pointLight1.castShadow = true
    sceneRef.current.add(pointLight1)

    // Luz puntual de color
    const pointLight2 = new (THREE as any).PointLight(0xd19762, 0.6, 50)
    pointLight2.position.set(-3, 2, 3)
    sceneRef.current.add(pointLight2)

    // Luz hemisférica para ambiente general
    const hemisphereLight = new (THREE as any).HemisphereLight(0xffffff, 0x444444, 0.6)
    hemisphereLight.position.set(0, 20, 0)
    sceneRef.current.add(hemisphereLight)
  }

  const setupControls = () => {
    // Aquí se podrían añadir controles de OrbitControls de Three.js
    // Por simplicidad, mantenemos la rotación automática
  }

  const createParticleSystem = () => {
    if (!sceneRef.current) return
    
    const particleSystem = createParticles(sceneRef.current)
    setParticles([particleSystem])
  }

  const createMineral = (mineral: Mineral3D) => {
    if (!sceneRef.current || !mineralRef.current) return

    // Remover mineral anterior
    sceneRef.current.remove(mineralRef.current)

    // Crear geometría según el tipo con más opciones
    let geometry: any
    
    switch (mineral.geometry) {
      case 'box':
        geometry = new (THREE as any).BoxGeometry(1.5, 1.5, 1.5)
        break
      case 'cone':
        geometry = new (THREE as any).ConeGeometry(1, 2, 8)
        break
      case 'octahedron':
        geometry = new (THREE as any).OctahedronGeometry(1.2)
        break
      case 'dodecahedron':
        geometry = new (THREE as any).DodecahedronGeometry(1.1)
        break
      case 'cube':
        geometry = new (THREE as any).BoxGeometry(1.3, 1.3, 1.3)
        break
      default:
        geometry = new (THREE as any).BoxGeometry(1, 1, 1)
    }

    // Crear material avanzado con efectos
    const material = new (THREE as any).MeshPhongMaterial({
      color: mineral.color,
      transparent: true,
      opacity: mineral.opacity,
      shininess: mineral.id === 'quartz' ? 200 : 100,
      wireframe: showWireframe,
      emissive: mineral.id === 'pyrite' ? new (THREE as any).Color(0x222200) : new (THREE as any).Color(0x000000),
      emissiveIntensity: mineral.id === 'pyrite' ? 0.1 : 0
    })

    // Añadir textura cristalina para algunos minerales
    if (mineral.id === 'quartz' || mineral.id === 'calcite') {
      material.specular = new (THREE as any).Color(0xffffff)
      material.shininess = 300
    }

    // Crear mesh
    const mesh = new (THREE as any).Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    
    // Añadir efectos de post-procesamiento
    mesh.userData = {
      originalColor: mineral.color,
      rotationSpeed: rotationSpeed
    }
    
    mineralRef.current = mesh
    sceneRef.current.add(mesh)
  }

  const animate = () => {
    animationIdRef.current = requestAnimationFrame(animate)

    if (mineralRef.current && isRotating) {
      const speed = rotationSpeed * 0.01
      mineralRef.current.rotation.x += speed
      mineralRef.current.rotation.y += speed * 1.5
      mineralRef.current.rotation.z += speed * 0.5
    }

    // Animar partículas
    particles.forEach((particleSystem, index) => {
      if (particleSystem) {
        particleSystem.rotation.y += 0.001 * (index + 1)
        particleSystem.rotation.x += 0.0005 * (index + 1)
      }
    })

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }

  const handleResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    cameraRef.current.aspect = width / height
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(width, height)
  }

  const cleanup = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }
    
    window.removeEventListener('resize', handleResize)
    
    // Limpiar partículas
    particles.forEach(particle => {
      if (sceneRef.current) {
        sceneRef.current.remove(particle)
      }
    })
    
    if (mountRef.current && rendererRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement)
      rendererRef.current.dispose()
    }
  }

  const toggleRotation = () => {
    setIsRotating(!isRotating)
  }

  const selectMineral = (mineral: Mineral3D) => {
    setCurrentMineral(mineral)
  }

  const toggleWireframe = () => {
    setShowWireframe(!showWireframe)
    if (mineralRef.current && mineralRef.current.material) {
      const material = mineralRef.current.material as any
      if (material.wireframe !== undefined) {
        material.wireframe = !showWireframe
      }
    }
  }

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(3, 2, 3)
      cameraRef.current.lookAt(0, 0, 0)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="relative">
            <div className="loading-spinner mx-auto mb-4 w-12 h-12"></div>
            <div className="absolute inset-0 loading-spinner w-12 h-12 mx-auto animate-spin border-4 border-ocre-base border-t-transparent rounded-full"></div>
          </div>
          <p className="text-brown-base font-medium">Inicializando visualización 3D...</p>
          <p className="text-brown-base/60 text-sm mt-1">Cargando minerales y efectos visuales</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Contenedor 3D principal */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div
          ref={mountRef}
          className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-beige-light via-white to-beige-card flex items-center justify-center border-2 border-ocre-base/20"
        >
          {!mountRef.current && (
            <div className="flex items-center justify-center h-full text-gray-500 animate-fade-in px-4">
              <div className="text-center">
                <span className="material-symbols-outlined text-3xl sm:text-4xl mb-2 text-ocre-base">error</span>
                <p className="text-brown-base font-medium text-sm sm:text-base">Visualización 3D no disponible</p>
                <p className="text-xs sm:text-sm text-brown-base/60 mt-1">Tu navegador podría no soportar WebGL</p>
                <button className="mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-ocre-base text-white rounded-lg text-xs sm:text-sm hover:bg-ocre-dark transition-colors">
                  Intentar nuevamente
                </button>
              </div>
            </div>
          )}
          
          {/* Overlay con información del mineral */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-lg">
              <h4 className="font-bold text-brown-base text-xs sm:text-sm">{currentMineral.name}</h4>
              <p className="text-xs text-brown-base/70 mt-0.5">Fórmula: {currentMineral.formula}</p>
            </div>
          </div>
        </div>
        
        {/* Controles flotantes mejorados */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex flex-col gap-2 sm:gap-3">
          {/* Selector de minerales */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-lg border border-white/20">
            <div className="flex flex-col gap-1">
              {minerals.map((mineral) => (
                <button
                  key={mineral.id}
                  onClick={() => selectMineral(mineral)}
                  className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                    currentMineral.id === mineral.id
                      ? 'bg-ocre-base text-white shadow-lg scale-105'
                      : 'text-brown-base hover:bg-ocre-light/50 hover:scale-105'
                  }`}
                  title={`Cambiar a ${mineral.name}`}
                >
                  <span className="material-symbols-outlined text-sm sm:text-lg">
                    {mineralIcons[mineral.id as keyof typeof mineralIcons]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Controles de visualización */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-lg border border-white/20">
            <div className="flex flex-col gap-1">
              <button
                onClick={toggleRotation}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isRotating
                    ? 'bg-ocre-base text-white shadow-lg'
                    : 'text-brown-base hover:bg-ocre-light/50'
                }`}
                title={isRotating ? 'Pausar rotación' : 'Reanudar rotación'}
              >
                <span className="material-symbols-outlined text-sm sm:text-lg">
                  {isRotating ? 'pause' : 'play_arrow'}
                </span>
              </button>
              
              <button
                onClick={toggleWireframe}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  showWireframe
                    ? 'bg-ocre-base text-white shadow-lg'
                    : 'text-brown-base hover:bg-ocre-light/50'
                }`}
                title="Alternar vista wireframe"
              >
                <span className="material-symbols-outlined text-sm sm:text-lg">view_in_ar</span>
              </button>
              
              <button
                onClick={resetView}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-brown-base hover:bg-ocre-light/50 transition-all duration-300"
                title="Restablecer vista"
              >
                <span className="material-symbols-outlined text-sm sm:text-lg">3d_rotation</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Indicador de estado */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg border border-white/20">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isRotating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-brown-base font-medium">
                {isRotating ? 'Rotando' : 'Pausado'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Panel de información expandible */}
      <div className="mt-4 sm:mt-6 animate-slide-in-bottom">
        <div className="card-icon p-4 sm:p-6 rounded-xl sm:rounded-2xl">
          <h4 className="text-base sm:text-lg font-bold text-brown-base mb-3">Información del Mineral</h4>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ocre-base/20 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-ocre-base text-lg sm:text-xl">
                  {mineralIcons[currentMineral.id as keyof typeof mineralIcons]}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-brown-base leading-tight">{currentMineral.name}</p>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-ocre-base mb-1">{currentMineral.formula}</div>
              <p className="text-xs sm:text-sm text-brown-base/70">Fórmula Química</p>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-ocre-base mb-1">{Math.round(currentMineral.opacity * 100)}%</div>
              <p className="text-xs sm:text-sm text-brown-base/70">Opacidad</p>
            </div>
          </div>
          
          {/* Descripción adicional del mineral */}
          <div className="mt-4 pt-4 border-t border-ocre-base/20">
            <p className="text-xs sm:text-sm text-brown-base/80 leading-relaxed">
              {currentMineral.id === 'halite' && 'La halita es un mineral evaporítico que forma cristales cúbicos. Se encuentra comúnmente en depósitos de sal marina y es fundamental en la industria química.'}
              {currentMineral.id === 'gypsum' && 'El yeso es un mineral sulfato que forma cristales prismáticos. Es blando (se raya con la uña) y se usa extensivamente en la construcción.'}
              {currentMineral.id === 'quartz' && 'El cuarzo es uno de los minerales más abundantes en la corteza terrestre. Forma cristales hexagonales y es muy resistente a la meteorización.'}
              {currentMineral.id === 'calcite' && 'La calcata es el principal componente de las rocas carbonatadas. Reacciona vigorosamente con ácido clorhídrico, liberando dióxido de carbono.'}
              {currentMineral.id === 'pyrite' && 'La pirita es un sulfuro de hierro conocido como "oro de los tontos" por su color dorado. Es importante en la metalurgia y la formación de ácidos.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}