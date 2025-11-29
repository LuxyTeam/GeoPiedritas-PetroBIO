import React, { useEffect, useRef, useState } from 'react';
import { Rotate3d, Info, Box, Grid3X3 } from 'lucide-react';

const NaClViewer = () => {
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

    // Configuración de la Halita (NaCl)
    const CONFIG = {
        baseScale: 35,
        colors: {
            Na: { base: '#a855f7', shadow: '#581c87', highlight: '#d8b4fe' }, // Sodio (Morado)
            Cl: { base: '#22c55e', shadow: '#14532d', highlight: '#86efac' }  // Cloro (Verde)
        },
        // El ión Cloro (181 pm) es casi el doble de grande que el Sodio (102 pm) visualmente
        radii: { Na: 8, Cl: 14 },
        bondColor: 'rgba(255, 255, 255, 0.2)',
        maxBondDistance: 3.0 // Angstroms (Enlace Na-Cl es aprox 2.82 A)
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

        // --- 1. Generación de Datos (Halita - Sistema Cúbico) ---
        function initModel() {
            state.atoms = [];
            state.bonds = [];

            // Constante de red (a) en Angstroms aprox
            const a = 5.64;
            // La distancia entre átomos vecinos es a/2
            const step = a / 2;

            let range;

            if (viewMode === 'unit') {
                // Celda Unitaria (FCC): Vamos de 0 a a (inclusive)
                // En pasos de 0.5a, esto significa índices 0, 1, 2
                range = { min: 0, max: 2 };
            } else {
                // Supercelda (Cristal): 3x3x3 celdas aprox
                range = { min: -3, max: 3 };
            }

            // Generar red cúbica simple alternada
            // La estructura de NaCl se puede ver como una red cúbica donde alternan Na y Cl
            for (let x = range.min; x <= range.max; x++) {
                for (let y = range.min; y <= range.max; y++) {
                    for (let z = range.min; z <= range.max; z++) {

                        // Coordenadas cartesianas
                        const cartX = x * step;
                        const cartY = y * step;
                        const cartZ = z * step;

                        // Determinar tipo de átomo (Alternancia tipo tablero de ajedrez 3D)
                        // Si la suma de índices es par -> Tipo A, impar -> Tipo B
                        const isEven = (Math.abs(x) + Math.abs(y) + Math.abs(z)) % 2 === 0;

                        // En la estructura real, definimos el origen (0,0,0) como Cloro (arbitrario, pero común)
                        // (0,0,0) par -> Cl
                        const type = isEven ? 'Cl' : 'Na';

                        state.atoms.push({
                            type: type,
                            x: cartX,
                            y: cartY,
                            z: cartZ
                        });
                    }
                }
            }

            centerModel();
            generateBonds(step);
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

        function generateBonds(stepDist) {
            // Generar enlaces solo entre vecinos inmediatos (distancia aprox = step)
            // Usamos un pequeño margen de error epsilon
            const epsilon = 0.1;
            const targetDist = stepDist;

            // Optimización: Solo buscar vecinos cercanos
            for (let i = 0; i < state.atoms.length; i++) {
                for (let j = i + 1; j < state.atoms.length; j++) {
                    const a1 = state.atoms[i];
                    const a2 = state.atoms[j];

                    // En NaCl, enlaces iónicos son entre distintos tipos
                    if (a1.type === a2.type) continue;

                    const dx = a1.x - a2.x;
                    const dy = a1.y - a2.y;
                    const dz = a1.z - a2.z;
                    // Distancia Manhattan rápida pre-check o Euclídea
                    if (Math.abs(dx) > targetDist + epsilon) continue;
                    if (Math.abs(dy) > targetDist + epsilon) continue;
                    if (Math.abs(dz) > targetDist + epsilon) continue;

                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (Math.abs(dist - targetDist) < epsilon) {
                        state.bonds.push({ idx1: i, idx2: j });
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
            // Fondo
            const bgGrad = ctx.createLinearGradient(0, 0, 0, state.height);
            bgGrad.addColorStop(0, '#0f172a');
            bgGrad.addColorStop(1, '#1e1b4b'); // Tono índigo oscuro
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, state.width, state.height);

            const renderList = [];
            const projMap = new Map();

            // Proyectar Átomos
            state.atoms.forEach((atom, i) => {
                const p = project(atom.x, atom.y, atom.z);

                // Niebla de profundidad
                let alpha = 1;
                if (p.z < -20) alpha = Math.max(0.1, 1 + (p.z + 20) / 50);

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

            // Ordenar por profundidad (Z-Sort)
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

            // Sombra
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = r * 0.4;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        function drawBond(p1, p2, alpha) {
            if (!ctx) return;
            ctx.globalAlpha = alpha * 0.6; // Enlaces un poco más transparentes en NaCl
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
                state.camera.rotY += 0.002;
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
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">Halita (NaCl)</h1>
                        <p className="text-xs text-slate-400 font-medium">
                            {viewMode === 'supercell' ? 'Red Cúbica Compacta' : 'Celda Unitaria'}
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
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] border border-green-400"></div>
                            <span className="text-sm font-medium text-slate-200">Cloro (Cl⁻)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400 ml-1"></div>
                            <span className="text-sm font-medium text-slate-200">Sodio (Na⁺)</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-700/50 text-[10px] leading-tight text-slate-500">
                        <span className="text-blue-300 flex items-center gap-1 mb-1"><Rotate3d className="w-3 h-3" /> Estructura Cúbica:</span>
                        Nota la gran diferencia de tamaño entre el ión Cloro (grande) y el Sodio (pequeño). Esto permite que el Sodio se acomode en los huecos de la red.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NaClViewer;