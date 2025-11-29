import { RockType } from '@/types'

export const rockTypes: RockType[] = [
    {
        class: 'clasticas',
        rock: 'Arcosa',
        origin: 'Deriva de la erosión y transporte de granitos.',
        chemicalComposition: 'Rica en feldespato potásico (KAlSi₃O₈) y cuarzo (SiO₂).',
        description: 'Es una arenisca con >25% de feldespato. Indica un transporte corto y erosión rápida de rocas félsicas. Tiende a tener tonos rojizos/rosas porque el feldespato se oxida.',
        image: '/images/rocks/arcosa.png'
    },
    {
        class: 'clasticas',
        rock: 'Arenisca',
        origin: 'Compactación y cementación de granos de arena.',
        chemicalComposition: 'Mayormente cuarzo (SiO₂); a veces feldespatos.',
        description: 'Es una roca común y permeable. Su color varía según el cemento (calcita, sílice, arcillas, óxidos).',
        image: '/images/rocks/arenisca.png'
    },
    {
        class: 'clasticas',
        rock: 'Grauvaca',
        origin: 'Depósitos rápidos de arenas mal clasificadas, generalmente por corrientes de turbidez.',
        chemicalComposition: 'Sílice (SiO₂): 55-70%; Alúmina (Al₂O₃): 10-20%.',
        description: 'Arenisca "sucia" o "gris". Textura inmadura, indica transporte y deposición muy rápidos.',
        image: '/images/rocks/grauvaca.png'
    },
    {
        class: 'clasticas',
        rock: 'Pudinga',
        origin: 'Acumulación de cantos redondeados transportados por ríos o zonas costeras de alta energía.',
        chemicalComposition: 'SiO₂ (sílice): 65-90%; Al₂O₃: 5-15%.',
        description: 'Se diferencia de la Brecha por tener clastos redondeados, lo que indica un transporte más largo.',
        image: '/images/rocks/pudinga.png'
    },
    {
        class: 'clasticas',
        rock: 'Brecha',
        origin: 'Se forma a partir de fragmentos angulosos que se acumulan cerca de su fuente por derrumbes o fallas.',
        chemicalComposition: 'SiO₂ 60-90%; Al₂O₃: 5-15%.',
        description: 'Clastos angulares (no redondeados), lo que sugiere un transporte corto o nulo antes de la deposición.',
        image: '/images/rocks/brecha.png'
    },
    {
        class: 'quimicas',
        rock: 'Yeso',
        origin: 'Precipitación química en lagos o mares poco profundos por evaporación.',
        chemicalComposition: 'Sulfato de calcio hidratado (CaSO₄·2H₂O).',
        description: 'Una roca evaporítica blanda, se raya con la uña. Forma cristales claros o fibrosos.',
        image: '/images/rocks/yeso.png'
    },
    {
        class: 'quimicas',
        rock: 'Fosforita',
        origin: 'Precipitación química en ambientes marinos.',
        chemicalComposition: 'Fosfato de calcio (Ca₅(PO₄)₃(F,Cl,OH)).',
        description: 'Es rica en fósforo y de gran importancia para fertilizantes. Se forma en donde hay alta productividad biológica.',
        image: '/images/rocks/fosforita.png'
    },
    {
        class: 'quimicas',
        rock: 'Dolomía',
        origin: 'Cuando una caliza es modificada por aguas ricas en magnesio (dolomitización).',
        chemicalComposition: 'CaO: 28-32%; MgO: 18-22%; CO₂: 45-48%.',
        description: 'Reacciona débilmente con HCl. Menos reactiva que la caliza. Se forma por alteración metasomática.',
        image: '/images/rocks/dolomia.png'
    },
    {
        class: 'quimicas',
        rock: 'Caliza',
        origin: 'Precipitación de carbonato de calcio o aporte de restos biológicos marinos.',
        chemicalComposition: 'Carbonato de calcio (CaCO₃), usualmente calcita.',
        description: 'Reacciona con ácido clorhídrico. Es la roca sedimentaria química más abundante. Puede contener abundantes fósiles.',
        image: '/images/rocks/caliza.png'
    },
    {
        class: 'quimicas',
        rock: 'Sal Gema',
        origin: 'Resulta de la evaporación intensa de cuerpos de agua salada.',
        chemicalComposition: 'Cloruro de sodio (NaCl).',
        description: 'Roca sedimentaria evaporítica formada por halita.',
        image: '/images/rocks/halita.png'
    },
    {
        class: 'organicas',
        rock: 'Turba',
        origin: 'Acumulación de restos vegetales parcialmente descompuestos en pantanos.',
        chemicalComposition: 'Alta en carbono (C) y materia orgánica.',
        description: 'Etapa inicial de la formación del carbón.',
        image: '/images/rocks/turba.png'
    },
    {
        class: 'organicas',
        rock: 'Lignito',
        origin: 'Transformación de la turba bajo presión y calor moderado.',
        chemicalComposition: 'Alto contenido de carbono (25-35%).',
        description: 'Carbón mineral de color negro o pardo.',
        image: '/images/rocks/lignita.png'
    },
    {
        class: 'organicas',
        rock: 'Hulla',
        origin: 'Compactación y transformación de materia vegetal en zonas pantanosas.',
        chemicalComposition: 'Carbono (C): 75-85%; Hidrógeno (H): 4-6%.',
        description: 'Roca sedimentaria orgánica rica en carbono.',
        image: '/images/rocks/hulla.png'
    },
    {
        class: 'organicas',
        rock: 'Antracita',
        origin: 'Carbón previo sometido a mayor presión y temperatura.',
        chemicalComposition: 'Carbono (C): 86-95%.',
        description: 'El carbón mineral de más alto rango y contenido de carbono.',
        image: '/images/rocks/antracita.png'
    },
    {
        class: 'organicas',
        rock: 'Asfalto',
        origin: 'Alteración natural de hidrocarburos que migran y quedan atrapados.',
        chemicalComposition: 'Carbono (C): 80-88%; Hidrógeno (H): 8-11%.',
        description: 'Hidrocarburo sólido o semisólido natural.',
        image: '/images/rocks/asfalto.png'
    }
]

export const environments = [
    {
        type: 'Fluvial',
        icon: 'water',
        description: 'Ríos y corrientes de agua dulce',
        characteristics: ['Estratificación cruzada', 'Granos bien seleccionados', 'Fósiles de agua dulce'],
        color: 'from-blue-400 to-blue-600'
    },
    {
        type: 'Marino',
        icon: 'waves',
        description: 'Ambientes oceánicos y costeros',
        characteristics: ['Fósiles marinos abundantes', 'Estratificación paralela', 'Mayor extensión'],
        color: 'from-cyan-400 to-cyan-600'
    },
    {
        type: 'Desértico',
        icon: 'sunny',
        description: 'Ambientes áridos y eólicos',
        characteristics: ['Estratificación cruzada alta', 'Granos bien redondeados', 'Fósiles raros'],
        color: 'from-yellow-400 to-orange-500'
    },
    {
        type: 'Glacial',
        icon: 'ac_unit',
        description: 'Ambientes con hielo y retroceso',
        characteristics: ['Matriz arcillosa abundante', 'Granos mal seleccionados', 'Estratificación irregular'],
        color: 'from-gray-300 to-gray-500'
    }
]

export const characteristics = [
    {
        title: 'Textura',
        icon: 'texture',
        description: 'Tamaño, forma y distribución de granos',
        details: ['Granos tamaño arena (0.063-2mm)', 'Granos tamaño arcilla (<0.004mm)', 'Granos tamaño limo (0.004-0.063mm)']
    },
    {
        title: 'Estructuras Sedimentarias',
        icon: 'landscape',
        description: 'Patrones organizados del depósito',
        details: ['Estratificación cruzada', 'Laminación paralela', 'Mármoles y flute marks']
    },
    {
        title: 'Composición',
        icon: 'science',
        description: 'Minerales y componentes presentes',
        details: ['Cuarzo (más resistente)', 'Feldespatos (moderadamente resistentes)', 'Fragmentos de roca (variable)']
    },
    {
        title: 'Fósiles',
        icon: 'pets',
        description: 'Restos de vida preservados',
        details: ['Conchas y caracolas', 'Restos vegetales', 'Huesos y huellas']
    }
]
