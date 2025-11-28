import { RockType } from '@/types'

export const rockTypes: RockType[] = [
    {
        class: 'clasticas',
        rock: 'Arcosa',
        origin: 'Detrítica; deriva de la erosión y transporte de granitos.',
        chemicalComposition: 'Rica en feldespato potásico (KAlSi₃O₈) y cuarzo (SiO₂).',
        description: 'Es una arenisca con >25% de feldespato. Indica un transporte corto y erosión rápida de rocas félsicas. Tiende a tener tonos rojizos/rosas porque el feldespato se oxida.'
    },
    {
        class: 'clasticas',
        rock: 'Arenisca',
        origin: 'Compactación y cementación de granos de arena.',
        chemicalComposition: 'Mayormente Cuarzo (SiO₂) a veces Feldespatos.',
        description: 'Es una roca común y permeable. Su color varía según el cemento (calcita, sílice, arcillas, óxidos).'
    },
    {
        class: 'clasticas',
        rock: 'Grauvaca',
        origin: 'Deposición rápida en cuencas oceánicas profundas.',
        chemicalComposition: 'Cuarzo, feldespato y alto contenido de matriz arcillosa.',
        description: 'Arenisca "sucia" o "gris". Textura inmadura, indica transporte y deposición muy rápidos.'
    },
    {
        class: 'clasticas',
        rock: 'Pudinga',
        origin: 'Cementación de fragmentos de roca redondeados (>2 mm).',
        chemicalComposition: 'Varía, pero incluye cuarzo, feldespato y trozos de roca.',
        description: 'Se diferencia de la Brecha por tener clastos redondeados, lo que indica un transporte más largo.'
    },
    {
        class: 'quimicas',
        rock: 'Brecha',
        origin: 'Cementación de fragmentos de roca angulares (>2 mm).',
        chemicalComposition: 'Similar a la Pudinga, pero con fragmentos menos meteorizados.',
        description: 'Clastos angulares (no redondeados), lo que sugiere un transporte corto o nulo antes de la deposición.'
    },
    {
        class: 'quimicas',
        rock: 'Yeso',
        origin: 'Precipitación de lagos o mares poco profundos (Evaporita).',
        chemicalComposition: 'Sulfato de calcio hidratado (CaSO₄·2H₂O).',
        description: 'Una roca evaporítica blanda, se raya con la uña. Forma cristales claros o fibrosos.'
    },
    {
        class: 'quimicas',
        rock: 'Fosforita',
        origin: 'Precipitación química en ambientes marinos.',
        chemicalComposition: 'Fosfato de calcio (Ca₃(PO₄)₂/Ca₅(PO₄)₃(OH)).',
        description: 'Es rica en fósforo y de gran importancia para fertilizantes. Se forma en donde hay alta productividad biológica.'
    },
    {
        class: 'bioquimicas',
        rock: 'Caliza',
        origin: 'Bioquímica (restos de organismos marinos) o Química (precipitación de CaCO₃).',
        chemicalComposition: 'Carbonato de calcio (CaCO₃).',
        description: 'Reacciona con ácido clorhídrico. Es la roca sedimentaria química más abundante. Puede contener abundantes fósiles.'
    },
    {
        class: 'bioquimicas',
        rock: 'Dolomita',
        origin: 'Alteración química de la caliza o precipitación directa (ambientes lagunares).',
        chemicalComposition: 'Carbonato de calcio y magnesio (CaMg(CO₃)₂).',
        description: 'Reacciona débilmente con HCl. Menos reactiva que la caliza. Se forma por alteración metasomática.'
    },
    {
        class: 'bioquimicas',
        rock: 'Caliza Coralina',
        origin: 'Acumulación de esqueletos de corales y organismos marinos.',
        chemicalComposition: 'Principalmente CaCO₃ (calcita).',
        description: 'Contiene fragmentos de coral y caparazones. Indica ambientes marinos cálidos y poco profundos.'
    },
    {
        class: 'bioquimicas',
        rock: 'Diatomita',
        origin: 'Acumulación de esqueletos silíceos de diatomeas.',
        chemicalComposition: 'Sílice (SiO₂) de origen orgánico.',
        description: 'Roca muy porosa y ligera. Se usa como filtro y abrasivo. Indica alta productividad en aguas marinas.'
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
