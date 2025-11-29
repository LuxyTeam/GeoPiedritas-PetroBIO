'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import { ChemicalCompound } from '@/types'

// Dynamic imports for viewers
const NaClViewer = dynamic(() => import('../models/NaClViewer') as any, { ssr: false })
const CalciteViewer = dynamic(() => import('../models/CalciteViewer') as any, { ssr: false })
const QuartzViewer = dynamic(() => import('../models/QuartzViewer') as any, { ssr: false })
const GypsumViewer = dynamic(() => import('../models/GypsumViewer') as any, { ssr: false })
const PyriteViewer = dynamic(() => import('../models/PyriteViewer') as any, { ssr: false })
const DolomiteViewer = dynamic(() => import('../models/DolomiteViewer') as any, { ssr: false })

interface UniversalModalProps {
    isOpen: boolean
    onClose: () => void
    compound: ChemicalCompound | null
}

export default function UniversalModal({ isOpen, onClose, compound }: UniversalModalProps) {
    const [mounted, setMounted] = useState(false)
    const [activeTab, setActiveTab] = useState('info')

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!isOpen || !mounted || !compound) return null

    // Determine which viewer to use
    const renderViewer = () => {
        switch (compound.formula) {
            case 'NaCl':
                return <NaClViewer />
            case 'CaCO₃':
                return <CalciteViewer />
            case 'SiO₂':
                return <QuartzViewer />
            case 'CaSO₄·2H₂O':
                return <GypsumViewer />
            case 'FeS₂':
                return <PyriteViewer />
            case 'CaMg(CO₃)₂':
                return <DolomiteViewer />
            default:
                // Fallback for unknown compounds
                return (
                    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-slate-100">
                        <h2 className="text-2xl font-bold mb-4">{compound.name}</h2>
                        <p className="text-slate-400 mb-2">{compound.formula}</p>
                        <p className="text-sm text-slate-500">Modelo 3D no disponible</p>
                    </div>
                )
        }
    }

    // All current viewers are designed as fullscreen experiences
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black">
            {/* Close Button - Floating on top */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-[10000] w-10 h-10 md:w-12 md:h-12 bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-all shadow-lg border border-slate-600"
            >
                <span className="material-symbols-rounded text-xl md:text-2xl">close</span>
            </button>

            {/* Fullscreen Viewer */}
            {renderViewer()}
        </div>,
        document.body
    )
}
