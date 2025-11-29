import React, { useEffect, useRef, useState } from 'react';
import { Info, Box, Grid3X3, Gem } from 'lucide-react';

const PyriteViewer = () => {
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

    // Configuración de la Pirita
    const CONFIG = {
        baseScale: 35,
        colors: {
            // Hierro (Dorado/Bronce - "Oro de tontos")
            Fe: { base: '#d97706', shadow: '#78350f', highlight: '#fbbf24' },
            // Azufre (Amarillo pálido)
            S: { base: '#facc15', shadow: '#a16207', highlight: '#fef08a' }
        },
        radii: { Fe: 9, S: 7 }, // Radios visuales
        bondColor: 'rgba(255, 255, 255, 0.3)'
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const state = stateRef.current;
        let animationFrameId;

        // Ajustar zoom según el modo
        if (viewMode === 'unit') {
            state.camera.zoom = 1.6;
            state.camera.rotX = 15 * (Math.PI / 180);
            state.camera.rotY = 30 * (Math.PI / 180);
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

        // --- 1. Generación de Datos (Pirita - Pa3) ---
        function initModel() {
            state.atoms = [];
            state.bonds = [];

            // Parámetros de celda
            const a = 5.4; // Constante de red aproximada
            const u = 0.385; // Parámetro de posición del Azufre

            let range;
            if (viewMode === 'unit') {
                range = { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };
            } else {
                // Cristal 2x2x2 centrado
                range = { minX: -1, maxX: 0, minY: -1, maxY: 0, minZ: -1, maxZ: 0 };
            }

            // Bases atómicas para grupo espacial Pa-3 (205)
            // Hierro en posiciones FCC (4a)
            const fe_basis = [
                [0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]
            ];

            // Azufre en posiciones (8c)
            // Generamos los 4 pares orientados
            const s_basis = [
                [u, u, u], [1 - u, 1 - u, 1 - u],             // Par 1 (Diagonal principal)
                [0.5 + u, 0.5 - u, 1 - u], [0.5 - u, 0.5 + u, u], // Par 2
                [1 - u, 0.5 + u, 0.5 - u], [u, 0.5 - u, 0.5 + u], // Par 3
                [0.5 - u, 1 - u, 0.5 + u], [0.5 + u, u, 0.5 - u]  // Par 4
            ];

            // Generar celdas
            for (let x = range.minX; x <= range.maxX; x++) {
                for (let y = range.minY; y <= range.maxY; y++) {
                    for (let z = range.minZ; z <= range.maxZ; z++) {

                        // Offset de la celda actual
                        const ox = x * a;
                        const oy = y * a;
                        const oz = z * a;

                        // Añadir Hierros
                        fe_basis.forEach(pos => {
                            addAtom('Fe', ox + pos[0] * a, oy + pos[1] * a, oz + pos[2] * a);
                        });

                        // Añadir Azufres
                        s_basis.forEach(pos => {
                            addAtom('S', ox + pos[0] * a, oy + pos[1] * a, oz + pos[2] * a);
                        });
                    }
                }
            }

            centerModel();
            generateBonds();
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

        function generateBonds() {
            // Distancias de enlace aproximadas (Angstroms -> Unidades visuales)
            // S-S en pirita ~ 2.17 A
            // Fe-S en pirita ~ 2.26 A
            const maxSS = 2.4;
            const maxFeS = 2.5;

            for (let i = 0; i < state.atoms.length; i++) {
                for (let j = i + 1; j < state.atoms.length; j++) {
                    const a1 = state.atoms[i];
                    const a2 = state.atoms[j];

                    const dx = a1.x - a2.x;
                    const dy = a1.y - a2.y;
                    const dz = a1.z - a2.z;
                    // Pre-chequeo rápido
                    if (Math.abs(dx) > maxFeS || Math.abs(dy) > maxFeS || Math.abs(dz) > maxFeS) continue;

                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    // Lógica de enlaces
                    if (a1.type === 'S' && a2.type === 'S') {
                        if (dist < maxSS) {
                            state.bonds.push({ idx1: i, idx2: j, type: 'SS' });
                        }
                    } else if (a1.type !== a2.type) {
                        // Enlace Fe-S
                        if (dist < maxFeS) {
                            state.bonds.push({ idx1: i, idx2: j, type: 'FeS' });
                        }
                    }
                }
            }
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
                    renderList.push({ type: 'bond', z: zAvg, p1: a1.p, p2: a2.p, alpha, bondType: bond.type });
                }
            });

            renderList.sort((a, b) => b.z - a.z);

            renderList.forEach(item => {
                if (item.type === 'bond') {
                    drawBond(item.p1, item.p2, item.alpha, item.bondType);
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

        function drawBond(p1, p2, alpha, type) {
            if (!ctx) return;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Los enlaces S-S (dímeros) los hacemos un poco más gruesos y amarillentos
            if (type === 'SS') {
                ctx.lineWidth = 4 * (p1.scale / 30);
                ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
            } else {
                ctx.lineWidth = 2 * (p1.scale / 30);
                ctx.strokeStyle = CONFIG.bondColor;
            }

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
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">Pirita (FeS₂)</h1>
                        <p className="text-xs text-slate-400 font-medium">
                            {viewMode === 'supercell' ? 'Cristal Cúbico' : 'Unidad Fórmula'}
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
                            <div className="w-4 h-4 rounded-full bg-amber-600 shadow-inner border border-amber-500"></div>
                            <span className="text-xs font-medium text-slate-200">Hierro (Fe)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner border border-yellow-300"></div>
                            <span className="text-xs font-medium text-slate-200">Azufre (S)</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-700 text-[10px] leading-tight text-slate-500">
                        <span className="text-amber-300 flex items-center gap-1 mb-1"><Gem className="w-3 h-3" /> Pares de Azufre:</span>
                        Observa los "dumbbells" de Azufre (S-S) conectados por líneas amarillas. Esta característica es clave para distinguirla de la Sal de mesa, aunque ambas son cúbicas.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PyriteViewer;