import React, { useEffect, useRef, useState } from 'react';
import { Rotate3d, Info, Box, Grid3X3, Gem, RotateCw } from 'lucide-react';

const QuartzViewer = () => {
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

    // Configuración del Cuarzo
    const CONFIG = {
        baseScale: 35,
        colors: {
            Si: { base: '#94a3b8', shadow: '#475569', highlight: '#cbd5e1' }, // Silicio (Gris Metálico)
            O: { base: '#ef4444', shadow: '#991b1b', highlight: '#fca5a5' }  // Oxígeno (Rojo)
        },
        radii: { Si: 8, O: 6 },
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
            state.camera.zoom = 1.8;
            state.camera.rotX = 15 * (Math.PI / 180);
            state.camera.rotY = 30 * (Math.PI / 180);
        } else {
            state.camera.zoom = 0.85;
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

        // --- 1. Generación de Datos (Cuarzo - Tectosilicato) ---
        function initModel() {
            state.atoms = [];
            state.bonds = [];

            if (viewMode === 'unit') {
                // Unidad Fundamental: Tetraedro SiO4
                // Un átomo de Silicio central coordinado con 4 Oxígenos
                const siIdx = addAtom('Si', 0, 0, 0);

                // Geometría Tetraédrica
                const dist = 1.6; // Distancia Si-O
                // Vértices del tetraedro
                addAtom('O', dist, 1, -1);
                addAtom('O', -dist, 1, 1);
                addAtom('O', 0, -1.4, 0);
                // Añadimos un cuarto visualmente equilibrado
                addAtom('O', 0, 1, 1.4);

                // Enlazamos todos los oxígenos al Silicio central
                for (let i = 1; i < state.atoms.length; i++) {
                    state.bonds.push({ idx1: 0, idx2: i });
                }

            } else {
                // Estructura Cristalina (Aproximación Beta-Cuarzo/Hélice)
                // El cuarzo se caracteriza por hélices de tetraedros SiO4

                const cStep = 1.8; // Paso vertical por capa
                const radius = 2.5; // Radio de la hélice
                const helices = [
                    { x: 0, z: 0, offset: 0 },         // Hélice central
                    { x: 5, z: 0, offset: 0 },         // Vecino 1
                    { x: -5, z: 0, offset: 0 },        // Vecino 2
                    { x: 2.5, z: 4.3, offset: Math.PI },  // Vecino 3 (Intersticial)
                    { x: -2.5, z: 4.3, offset: Math.PI }, // Vecino 4
                    { x: 2.5, z: -4.3, offset: Math.PI }, // Vecino 5
                    { x: -2.5, z: -4.3, offset: Math.PI } // Vecino 6
                ];

                // Generamos las hélices
                helices.forEach(helix => {
                    generateHelix(helix.x, helix.z, helix.offset);
                });
            }

            centerModel();
        }

        function generateHelix(cx, cz, angleOffset) {
            // Generar una cadena espiral de Si-O-Si
            const steps = 7; // Altura de la hélice
            const rotStep = Math.PI / 3; // 60 grados por paso (simetría hexagonal)
            const rise = 1.5; // Subida por paso

            let prevSiIdx = -1;

            for (let i = -2; i < steps - 2; i++) {
                const angle = (i * rotStep) + angleOffset;
                const y = i * rise;

                // Posición del Silicio (en la hélice)
                const r = 1.8;
                const sx = cx + r * Math.cos(angle);
                const sz = cz + r * Math.sin(angle);

                const siIdx = addAtom('Si', sx, y, sz);

                // Oxígenos puente (Conectan este Si con el anterior en la hélice)
                if (prevSiIdx !== -1) {
                    // Punto medio aproximado para el Oxígeno puente
                    const prevAtom = state.atoms[prevSiIdx];
                    const mx = (sx + prevAtom.x) / 2;
                    const my = (y + prevAtom.y) / 2;
                    const mz = (sz + prevAtom.z) / 2;

                    // Desplazamos el oxígeno un poco hacia afuera para que no sea lineal
                    const oIdx = addAtom('O', mx * 1.1, my, mz * 1.1); // Simplificación visual

                    state.bonds.push({ idx1: prevSiIdx, idx2: oIdx });
                    state.bonds.push({ idx1: oIdx, idx2: siIdx });
                }

                // Oxígenos "laterales" (Representan conexiones a otras hélices)
                // En una simulación completa conectarían con las otras hélices
                const outAngle = angle + Math.PI / 2;
                const ox = sx + 1.0 * Math.cos(outAngle);
                const oz = sz + 1.0 * Math.sin(outAngle);
                const sideO = addAtom('O', ox, y + 0.5, oz);
                state.bonds.push({ idx1: siIdx, idx2: sideO });

                prevSiIdx = siIdx;
            }
        }

        function addAtom(type, x, y, z) {
            state.atoms.push({ type, x, y, z });
            return state.atoms.length - 1;
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
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">Cuarzo (SiO₂)</h1>
                        <p className="text-xs text-slate-400 font-medium">
                            {viewMode === 'supercell' ? 'Estructura Helicoidal' : 'Unidad Tetraédrica'}
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
                            <span className="text-xs font-medium text-slate-200">Silicio (Si)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner border border-red-400"></div>
                            <span className="text-xs font-medium text-slate-200">Oxígeno (O)</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-700 text-[10px] leading-tight text-slate-500">
                        <span className="text-blue-300 flex items-center gap-1 mb-1"><RotateCw className="w-3 h-3" /> Estructura Helicoidal:</span>
                        Observa cómo los tetraedros de SiO₄ se disponen en espiral a lo largo del eje vertical (eje c), dando lugar a la forma prismática hexagonal del cristal.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuartzViewer;