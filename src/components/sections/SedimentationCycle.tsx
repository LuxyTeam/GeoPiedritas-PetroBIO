'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function SedimentationCycle() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Scroll progress tracking for the timeline
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Smooth out the progress
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const steps = [
        {
            step: 1,
            title: 'Meteorización',
            icon: 'landscape',
            desc: 'La roca original se fragmenta o se descompone químicamente por el clima.',
            color: 'from-stone-400 to-stone-600'
        },
        {
            step: 2,
            title: 'Erosión',
            icon: 'waves',
            desc: 'El sedimento suelto es removido de su origen por viento, agua o hielo.',
            color: 'from-blue-400 to-blue-600'
        },
        {
            step: 3,
            title: 'Transporte',
            icon: 'local_shipping',
            desc: 'Los materiales viajan distancias largas por ríos o corrientes.',
            color: 'from-cyan-400 to-cyan-600'
        },
        {
            step: 4,
            title: 'Deposición',
            icon: 'layers',
            desc: 'Los sedimentos se asientan y acumulan en capas cuando el agua frena.',
            color: 'from-amber-400 to-amber-600'
        },
        {
            step: 5,
            title: 'Litificación',
            icon: 'architecture',
            desc: 'El peso y los minerales cementan las capas convirtiéndolas en roca sólida.',
            color: 'from-red-400 to-red-600'
        }
    ]

    return (
        <section ref={containerRef} id="formacion" className="section-box p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 scroll-mt-24 relative overflow-hidden">

            {/* Header */}
            <div className="text-center mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-base mb-4">¿Cómo se forman las rocas sedimentarias?</h2>
                    <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-ocre-base to-ocre-dark mx-auto rounded-full mb-4 sm:mb-6"></div>
                    <p className="text-brown-base leading-relaxed text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4">
                        Su formación se llama <strong className="text-ocre-base">sedimentación</strong> y es un ciclo continuo de cinco pasos:
                    </p>
                </motion.div>
            </div>

            {/* Timeline Container */}
            <div className="relative max-w-5xl mx-auto">

                {/* Central Vertical Line (Desktop) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-stone-200 -translate-x-1/2 rounded-full hidden md:block" />

                {/* Progress Line (Desktop) */}
                <motion.div
                    className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-ocre-base to-brown-base -translate-x-1/2 rounded-full hidden md:block origin-top"
                    style={{ height: '100%', scaleY }}
                />

                {/* Mobile Vertical Line (Left aligned) */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-stone-200 rounded-full md:hidden" />
                <motion.div
                    className="absolute left-8 top-0 w-1 bg-gradient-to-b from-ocre-base to-brown-base rounded-full md:hidden origin-top"
                    style={{ height: '100%', scaleY }}
                />

                {/* Steps */}
                <div className="space-y-12 md:space-y-24 relative z-10">
                    {steps.map((item, index) => {
                        const isEven = index % 2 === 0

                        return (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                {/* Center Icon/Marker (Mobile: Left aligned) */}
                                <div className="relative flex-shrink-0 z-10 md:order-2 ml-4 md:ml-0">
                                    <div className={`w-8 h-8 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg border-2 md:border-4 border-white text-white transform transition-transform duration-500 hover:scale-110 hover:rotate-12`}>
                                        <span className="material-symbols-outlined text-sm md:text-3xl">{item.icon}</span>
                                    </div>
                                    {/* Number Badge (Desktop) */}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-brown-base text-white rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm text-sm hidden md:flex">
                                        {item.step}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 w-full md:w-auto pl-12 md:pl-0 md:order-1">
                                    <div className={`bg-white p-5 md:p-6 rounded-2xl shadow-lg border-l-4 ${isEven ? 'md:text-right border-ocre-base' : 'text-left border-brown-base'} hover:shadow-xl transition-shadow duration-300 relative group`}>
                                        <div className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b ${item.color} opacity-20 ${isEven ? 'right-0' : 'left-0'} hidden md:block`}></div>

                                        <h3 className={`text-lg md:text-xl font-bold text-brown-base mb-2 flex items-center gap-2 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                                            <span className="md:hidden text-ocre-base font-mono text-sm">0{item.step}.</span>
                                            {item.title}
                                        </h3>
                                        <p className="text-brown-base/80 text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Empty Space for alignment (Desktop) */}
                                <div className="flex-1 hidden md:block md:order-3" />

                            </motion.div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
