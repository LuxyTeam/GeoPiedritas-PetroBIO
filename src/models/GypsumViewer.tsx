import React, { useEffect, useRef, useState } from 'react';
import { Rotate3d, Info, Box, Grid3X3, Droplets } from 'lucide-react';

const GypsumViewer = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [viewMode, setViewMode] = useState('supercell'); // 'supercell' | 'unit'

    // Referencias de estado
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

    // Configuración del Yeso
    const CONFIG = {
        baseScale: 32,
        colors: {
            Ca: { base: '#94a3b8', shadow: '#475569', highlight: '#cbd5e1' }, // Calcio (Gris)
            S: { base: '#fbbf24', shadow: '#b45309', highlight: '#fcd34d' }, // Azufre (Amarillo)
            O: { base: '#ef4444', shadow: '#7f1d1d', highlight: '#fca5a5' }, // Oxígeno (Rojo)
            H: { base: '#f8fafc', shadow: '#cbd5e1', highlight: '#ffffff' }  // Hidrógeno (Blanco)
        },
        radii: { Ca: 11, S: 9, O: 6, H: 4 },
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

        if (viewMode === 'unit') {
            state.camera.zoom = 1.6;
            state.camera.rotX = 10 * (Math.PI / 180);
            state.camera.rotY = 20 * (Math.PI / 180);
        } else {
            state.camera.zoom = 0.9;
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

        // --- 1. Generación de Datos (Yeso - Estructura Laminar) ---
        function initModel() {
            state.atoms = [];
            state.bonds = [];

            if (viewMode === 'unit') {
                // Unidad Fórmula: CaSO4 + 2H2O
                // Grupo Sulfato (SO4) tetraédrico
                addSulfateGroup(0, 0, 0);
                // Calcio coordinado
                addAtom('Ca', 0, -2.5, 0);

                // 2 Moléculas de agua
                addWaterMolecule(2.5, -1, 0);
                addWaterMolecule(-2.5, -1, 0);

            } else {
                // Estructura Cristalina: Capas alternas
                // Capa A: CaSO4 (Dura)
                // Capa B: H2O (Débil - permite clivaje)

                const latticeX = 4.0;
                const latticeZ = 4.0;
                const layerDist = 3.0;

                // Generamos 3 capas principales: Mineral - Agua - Mineral
                const layers = [-1, 0, 1];

                layers.forEach(layerIdx => {
                    const y = layerIdx * layerDist * 1.5;

                    if (layerIdx === 0) {
                        // CAPA DE AGUA (Intermedia)
                        // Una hoja doble de moléculas de agua
                        for (let x = -2; x <= 2; x++) {
                            for (let z = -2; z <= 2; z++) {
                                const wx = x * latticeX * 0.8;
                                const wz = z * latticeZ * 0.8;
                                // Variación en altura para simular espesor
                                addWaterMolecule(wx, y - 0.5, wz + 1.5);
                                addWaterMolecule(wx + 2, y + 0.5, wz);
                            }
                        }
                    } else {
                        // CAPAS DE CaSO4 (Superior e Inferior)
                        for (let x = -2; x <= 2; x++) {
                            for (let z = -2; z <= 2; z++) {
                                const cx = x * latticeX;
                                const cz = z * latticeZ;

                                // Alternar Calcio y Sulfato en la red
                                if ((Math.abs(x) + Math.abs(z)) % 2 === 0) {
                                    addAtom('Ca', cx, y, cz);
                                } else {
                                    addSulfateGroup(cx, y, cz);
                                }
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

        function addSulfateGroup(cx, cy, cz) {
            const sIdx = addAtom('S', cx, cy, cz);
            const bondLen = 1.4;

            // Geometría Tetraédrica aproximada
            const offsets = [
                { x: 0, y: 1, z: 0 },
                { x: 0.94, y: -0.33, z: 0 },
                { x: -0.47, y: -0.33, z: 0.81 },
                { x: -0.47, y: -0.33, z: -0.81 }
            ];

            offsets.forEach(off => {
                const oIdx = addAtom('O', cx + off.x * bondLen, cy + off.y * bondLen, cz + off.z * bondLen);
                state.bonds.push({ idx1: sIdx, idx2: oIdx });
            });
        }

        function addWaterMolecule(cx, cy, cz) {
            const oIdx = addAtom('O', cx, cy, cz);
            const bondLen = 0.96;
            const angle = 104.5 * (Math.PI / 180); // Ángulo H-O-H
            const halfAngle = angle / 2;

            // H1
            const h1x = cx + bondLen * Math.sin(halfAngle);
            const h1y = cy + bondLen * Math.cos(halfAngle);
            const h1Idx = addAtom('H', h1x, h1y, cz);

            // H2
            const h2x = cx - bondLen * Math.sin(halfAngle);
            const h2y = cy + bondLen * Math.cos(halfAngle);
            const h2Idx = addAtom('H', h2x, h2y, cz);

            state.bonds.push({ idx1: oIdx, idx2: h1Idx });
            state.bonds.push({ idx1: oIdx, idx2: h2Idx });
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
            const cy = Math.cos(state.camera.rotY);
            const sy = Math.sin(state.camera.rotY);
            let x1 = x * cy - z * sy;
            let z1 = x * sy + z * cy;

            const cx = Math.cos(state.camera.rotX);
            const sx = Math.sin(state.camera.rotX);
            let y2 = y * cx - z1 * sx;
            let z2 = y * sx + z1 * cx;

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
            const bgGrad = ctx.createLinearGradient(0, 0, 0, state.height);
            bgGrad.addColorStop(0, '#1e293b');
            bgGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, state.width, state.height);

            const renderList = [];
            const projMap = new Map();

            state.atoms.forEach((atom, i) => {
                const p = project(atom.x, atom.y, atom.z);
                let alpha = 1;
                if (p.z < -10) alpha = Math.max(0.2, 1 + (p.z + 10) / 60);

                const item = { type: 'atom', z: p.z, p, atom, alpha };
                renderList.push(item);
                projMap.set(i, item);
            });

            state.bonds.forEach(bond => {
                const a1 = projMap.get(bond.idx1);
                const a2 = projMap.get(bond.idx2);
                if (a1 && a2) {
                    const zAvg = (a1.z + a2.z) / 2;
                    const alpha = Math.min(a1.alpha, a2.alpha);
                    renderList.push({ type: 'bond', z: zAvg, p1: a1.p, p2: a2.p, alpha });
                }
            });

            renderList.sort((a, b) => b.z - a.z);

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
            ctx.lineWidth = 2 * (p1.scale / 30);
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
        stateRef.current.camera.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, stateRef.current.camera.rotX));
        stateRef.current.lastMouse = { x: touch.clientX, y: touch.clientY };
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
            {/* Header: Flex para responsividad */}
            <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-slate-800 border-b border-slate-700 z-10 shadow-lg gap-3 md:gap-0">
                {/* Izquierda: Título */}
                <div className="flex items-center justify-center md:justify-start w-full md:w-auto text-center md:text-left">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">Yeso (CaSO₄·2H₂O)</h1>
                        <p className="text-xs text-slate-400 font-medium">
                            {viewMode === 'supercell' ? 'Estructura Laminar' : 'Unidad Fórmula'}
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
                            <span className="hidden sm:inline">Cristal</span>
                        </button>
                        <button
                            onClick={() => setViewMode('unit')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${viewMode === 'unit'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                }`}
                        >
                            <Box className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Celda</span>
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
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-slate-400 shadow-inner border border-slate-300"></div>
                            <span className="text-xs font-medium text-slate-200">Ca</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-amber-400 shadow-inner border border-amber-300"></div>
                            <span className="text-xs font-medium text-slate-200">Azufre</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner border border-red-400"></div>
                            <span className="text-xs font-medium text-slate-200">Oxígeno</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white shadow-inner border border-slate-300"></div>
                            <span className="text-xs font-medium text-slate-200">Hidrógeno</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-700 text-[10px] leading-tight text-slate-500">
                        <span className="text-blue-300 flex items-center gap-1 mb-1"><Droplets className="w-3 h-3" /> Capas de Agua:</span>
                        Observa la capa central de moléculas de agua (H₂O) separando las capas minerales. Esto le da al yeso sus propiedades únicas.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GypsumViewer;