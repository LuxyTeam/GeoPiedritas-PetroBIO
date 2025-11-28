'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ChemicalCompound } from '@/types'

interface SimpleMineral3DProps {
    compound: ChemicalCompound
    isOpen: boolean
    onClose: () => void
}

export default function SimpleMineral3D({ compound, isOpen, onClose }: SimpleMineral3DProps) {
    const mountRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const meshRef = useRef<THREE.Mesh | null>(null)
    const frameIdRef = useRef<number | null>(null)

    useEffect(() => {
        if (!isOpen || !mountRef.current) return

        // Setup
        const width = mountRef.current.clientWidth
        const height = mountRef.current.clientHeight

        // Scene
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x000000)
        scene.fog = new THREE.Fog(0x000000, 5, 15)
        sceneRef.current = scene

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
        camera.position.z = 6
        cameraRef.current = camera

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        mountRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 1)
        pointLight.position.set(5, 5, 5)
        scene.add(pointLight)

        // Geometry
        let geometry
        switch (compound.geometry) {
            case 'cube':
                geometry = new THREE.BoxGeometry(2, 2, 2)
                break
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(1.5)
                break
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(1.5)
                break
            case 'cone':
                geometry = new THREE.ConeGeometry(1, 2, 32)
                break
            default:
                geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
        }

        // Material
        const material = new THREE.MeshPhongMaterial({
            color: compound.color,
            transparent: true,
            opacity: compound.opacity || 0.8,
            shininess: 100,
            specular: 0x444444
        })

        // Mesh
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        meshRef.current = mesh

        // Animation
        const animate = () => {
            if (meshRef.current) {
                meshRef.current.rotation.x += 0.01
                meshRef.current.rotation.y += 0.01
            }
            renderer.render(scene, camera)
            frameIdRef.current = requestAnimationFrame(animate)
        }
        animate()

        // Cleanup
        return () => {
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
            if (rendererRef.current && mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement)
                rendererRef.current.dispose()
            }
        }
    }, [isOpen, compound])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col md:flex-row">

                {/* 3D View */}
                <div className="w-full md:w-2/3 h-[400px] md:h-[500px] relative bg-gradient-to-br from-gray-900 to-black">
                    <div ref={mountRef} className="w-full h-full" />

                    {/* Close Button (Mobile) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:hidden w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Info Panel */}
                <div className="w-full md:w-1/3 p-6 md:p-8 bg-stone-800 text-white flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-ocre-base mb-1">{compound.name}</h2>
                            <p className="text-stone-400 font-mono">{compound.formula}</p>
                        </div>
                        {/* Close Button (Desktop) */}
                        <button
                            onClick={onClose}
                            className="hidden md:flex w-8 h-8 bg-white/10 rounded-full items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>

                    <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        <div>
                            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Descripción</h3>
                            <p className="text-stone-300 text-sm leading-relaxed">{compound.description}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Propiedades</h3>
                            <ul className="space-y-2">
                                {compound.properties.map((prop, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-stone-300">
                                        <span className="w-1.5 h-1.5 bg-ocre-base rounded-full"></span>
                                        {prop}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Usos</h3>
                            <div className="flex flex-wrap gap-2">
                                {compound.uses.map((use, i) => (
                                    <span key={i} className="px-3 py-1 bg-stone-700 rounded-full text-xs text-stone-300 border border-stone-600">
                                        {use}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-stone-700">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-ocre-base hover:bg-ocre-dark text-white rounded-xl font-semibold transition-colors shadow-lg"
                        >
                            Cerrar Visualización
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
