import React, { useEffect, useRef, useState } from 'react';
import { Rotate3d, Info, Box, Grid3X3 } from 'lucide-react';

const CaCO3Viewer = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [viewMode, setViewMode] = useState('supercell'); // 'supercell' | 'unit'

    // Referencias de estado para el loop de animación
    const stateRef = useRef({
        width: 0,
        height: 0,
        atoms: [],
        bonds: [],
        camera: {
            rotX: 20 * (Math.PI / 180),
            rotY: 45 * (Math.PI / 180),
            zoom: 1.0
        },
        isDragging: false,
        lastMouse: { x: 0, y: 0 },
        autoRotate: true,
    });

    // Configuración de la Calcita (CaCO3)
    const CONFIG = {
        baseScale: 30,
        colors: {
            Ca: { base: '#cbd5e1', shadow: '#475569', highlight: '#f1f5f9' }, // Calcio (Gris Blanquecino)
            C: { base: '#334155', shadow: '#0f172a', highlight: '#64748b' },  // Carbono (Gris Oscuro)
            O: { base: '#ef4444', shadow: '#7f1d1d', highlight: '#fca5a5' }   // Oxígeno (Rojo)
        },
        radii: { Ca: 12, C: 7, O: 6 },
        bondColor: 'rgba(203, 213, 225, 0.4)'
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const state = stateRef.current;
        let animationFrameId;

        // Ajustar cámara según el modo
        if (viewMode === 'unit') {
            state.camera.zoom = 1.8;
            state.camera.rotX = 10 * (Math.PI / 180);
            state.camera.rotY = 0;
        } else {
            state.camera.zoom = 1.0;
        }

        const handleResize = () => {
            const { clientWidth, clientHeight } = container;
            canvas.width = clientWidth;
            canvas.height = clientHeight;
            state.width = clientWidth;
            state.height = clientHeight;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        // --- 1. Generación de Datos (Calcita - Sistema Trigonal/Hexagonal) ---
        function initModel() {
            state.atoms = [];
            state.bonds = [];

            if (viewMode === 'unit') {
                // Unidad Representativa: Un átomo de Calcio y un grupo Carbonato
                // Mostramos la interacción básica iónica
                addAtom('Ca', 0, -2.5, 0);
                addCarbonate(0, 1.5, 0, false);
            } else {
                // Red Cristalina (Capas hexagonales)
                const latticeA = 4.5;
                const latticeC = 3.5; // Distancia entre capas verticales
                const layers = [-2, -1, 0, 1, 2]; // 5 capas
                const radius = 2; // Radio del hexágono

                layers.forEach(l => {
                    const isCa = (l % 2 === 0); // Capas pares son Calcio
                    const layerY = l * latticeC;

                    // Grid hexagonal
                    for (let q = -radius; q <= radius; q++) {
                        for (let r = -radius; r <= radius; r++) {
                            // Coordenadas Hexagonales -> Cartesianas
                            const x = (q * latticeA) + (r * latticeA * 0.5);
                            const z = (r * latticeA * 0.866);

                            // Recortar forma circular/hexagonal
                            if (Math.abs(q + r / 2) > radius + 0.5) continue;

                            if (isCa) {
                                addAtom('Ca', x, layerY, z);
                            } else {
                                // Los grupos carbonato rotan 180° en capas alternas
                                const rotated = (Math.abs(l) % 4 === 1);
                                addCarbonate(x, layerY, z, rotated);
                            }
                        }
                    }
                });
            }

            centerModel();
        }

        function addAtom(type, x, y, z) {
            state.atoms.push({ type, x, y, z });
            return state.atoms.length - 1;
        }

        function addCarbonate(cx, cy, cz, rotated) {
            const bondLen = 1.3;
            const cIdx = addAtom('C', cx, cy, cz);

            const offset = rotated ? Math.PI : 0;
            // Estructura trigonal plana del CO3
            for (let i = 0; i < 3; i++) {
                const angle = offset + (i * 2 * Math.PI / 3);
                const ox = cx + bondLen * Math.cos(angle);
                const oz = cz + bondLen * Math.sin(angle);
                const oIdx = addAtom('O', ox, cy, oz);

                // Enlace C-O (Covalente fuerte)
                state.bonds.push({ idx1: cIdx, idx2: oIdx });
            }
        }

        function centerModel() {
            let sx = 0, sy = 0, sz = 0;
            state.atoms.forEach(a => { sx += a.x; sy += a.y; sz += a.z; });
            const n = state.atoms.length;
            const cx = sx / n, cy = sy / n, cz = sz / n;
            state.atoms.forEach(a => {
                a.x -= cx; a.y -= cy; a.z -= cz;
            });
        }

        // --- 2. Motor de Renderizado ---
        function project(x, y, z) {
            // Rotación Y
            const cy = Math.cos(state.camera.rotY);
            const sy = Math.sin(state.camera.rotY);
            let x1 = x * cy - z * sy;
            let z1 = x * sy + z * cy;

            // Rotación X
            const cx = Math.cos(state.camera.rotX);
            const sx = Math.sin(state.camera.rotX);
            let y2 = y * cx - z1 * sx;
            let z2 = y * sx + z1 * cx;

            // Proyección perspectiva
            const fov = 1000;
            const dist = 80;
            const scale = (fov / (fov + z2 + dist)) * CONFIG.baseScale * state.camera.zoom;

            return {
                x: state.width / 2 + x1 * scale,
                y: state.height / 2 + y2 * scale,
                z: z2,
                scale: scale
            };
        }

        function draw() {
            if (!ctx || !canvas) return;

            // Fondo similar al anterior para consistencia
            const bgGrad = ctx.createLinearGradient(0, 0, 0, state.height);
            bgGrad.addColorStop(0, '#1e293b');
            bgGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, state.width, state.height);

            const renderList = [];
            const projMap = new Map();

            // Proyectar Átomos
            state.atoms.forEach((atom, i) => {
                const p = project(atom.x, atom.y, atom.z);

                // Efecto de profundidad
                let alpha = 1;
                if (p.z < -10) alpha = Math.max(0.2, 1 + (p.z + 10) / 60);

                const item = { type: 'atom', z: p.z, p, atom, alpha };
                renderList.push(item);
                projMap.set(i, item);
            });

            // Proyectar Enlaces
            state.bonds.forEach(bond => {
                const a1 = projMap.get(bond.idx1);
                const a2 = projMap.get(bond.idx2);
                if (a1 && a2) {
                    const zAvg = (a1.z + a2.z) / 2;
                    const alpha = Math.min(a1.alpha, a2.alpha);
                    renderList.push({ type: 'bond', z: zAvg, p1: a1.p, p2: a2.p, alpha });
                }
            });

            // Ordenar (Painter's Algorithm)
            renderList.sort((a, b) => b.z - a.z);

            // Dibujar
            renderList.forEach(item => {
                if (item.type === 'bond') {
                    drawBond(item.p1, item.p2, item.alpha);
                } else {
                    drawAtom(item.p, item.atom.type, item.alpha);
                }
            });
        }

        function drawAtom(p, type, alpha) {
            if (!ctx) return;
            const r = CONFIG.radii[type] * (p.scale / 30);
            if (r < 0.5) return;

            const colors = CONFIG.colors[type];

            ctx.globalAlpha = alpha;
            const grad = ctx.createRadialGradient(
                p.x - r * 0.3, p.y - r * 0.3, r * 0.1,
                p.x, p.y, r
            );
            grad.addColorStop(0, colors.highlight);
            grad.addColorStop(0.4, colors.base);
            grad.addColorStop(1, colors.shadow);

            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = r * 0.5;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        function drawBond(p1, p2, alpha) {
            if (!ctx) return;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            ctx.lineWidth = 3 * (p1.scale / 30);
            ctx.strokeStyle = CONFIG.bondColor;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        function animate() {
            if (state.autoRotate && !state.isDragging) {
                state.camera.rotY += 0.003;
            }
            draw();
            animationFrameId = requestAnimationFrame(animate);
        }

        initModel();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [viewMode]);

    // --- Controladores de Eventos ---
    const handleMouseDown = (e) => {
        stateRef.current.isDragging = true;
        stateRef.current.autoRotate = false;
        stateRef.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!stateRef.current.isDragging) return;
        const deltaX = e.clientX - stateRef.current.lastMouse.x;
        const deltaY = e.clientY - stateRef.current.lastMouse.y;
        stateRef.current.camera.rotY += deltaX * 0.01;
        stateRef.current.camera.rotX += deltaY * 0.01;
        // Limitar rotación X
        stateRef.current.camera.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, stateRef.current.camera.rotX));
        stateRef.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        stateRef.current.isDragging = false;
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            stateRef.current.isDragging = true;
            stateRef.current.autoRotate = false;
            stateRef.current.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    };

    const handleTouchMove = (e) => {
        if (!stateRef.current.isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - stateRef.current.lastMouse.x;
        const deltaY = touch.clientY - stateRef.current.lastMouse.y;
        stateRef.current.camera.rotY += deltaX * 0.01;
        stateRef.current.camera.rotX += deltaY * 0.01;
        stateRef.current.lastMouse = { x: touch.clientX, y: touch.clientY };
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
            {/* Header: Grid para centrar los controles */}
            {/* Header: Flex para responsividad */}
            <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-slate-800 border-b border-slate-700 z-10 shadow-lg gap-3 md:gap-0">
                {/* Izquierda: Título */}
                <div className="flex items-center justify-center md:justify-start w-full md:w-auto text-center md:text-left">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">Calcita (CaCO₃)</h1>
                        <p className="text-xs text-slate-400 font-medium">
                            {viewMode === 'supercell' ? 'Estructura Cristalina' : 'Unidad Fórmula'}
                        </p>
                    </div>
                </div>

                {/* Centro: Controles */}
                <div className="flex justify-center w-full md:w-auto">
                    <div className="flex gap-2 bg-slate-700/50 p-1 rounded-lg border border-slate-600">
                        <button
                            onClick={() => setViewMode('supercell')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${viewMode === 'supercell'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                }`}
                        >
                            <Grid3X3 className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Cristal</span>
                        </button>
                        <button
                            onClick={() => setViewMode('unit')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${viewMode === 'unit'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                }`}
                        >
                            <Box className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Celda</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative flex-1" ref={containerRef}>
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 cursor-move touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                />

                {/* Leyenda */}
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 md:p-4 rounded-xl shadow-2xl md:max-w-xs pointer-events-none">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                        <Info className="w-3 h-3" /> Elementos
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-200 shadow-inner border border-slate-400"></div>
                            <span className="text-sm font-medium text-slate-200">Calcio (Ca²⁺)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-slate-700 shadow-inner border border-slate-500 ml-1"></div>
                            <span className="text-sm font-medium text-slate-200">Carbono (C)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner border border-red-400 ml-1.5"></div>
                            <span className="text-sm font-medium text-slate-200">Oxígeno (O)</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-700 text-[10px] leading-tight text-slate-500">
                        Observa cómo los grupos triangulares de Carbonato (CO₃) se disponen en capas alternas con los iones de Calcio.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaCO3Viewer;
