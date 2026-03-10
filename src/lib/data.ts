export type Category = "eventos" | "palestras" | "storytelling";

export interface Post {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: Category;
    author: string;
    published: boolean;
    featured: boolean;
    createdAt: string;
    readTime: string;
}

export interface Subscriber {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    status: "active" | "inactive";
}

export interface DashboardStats {
    totalSubscribers: number;
    totalPosts: number;
    openRate: number;
    growthPercent: number;
}

export const CATEGORIES: { value: Category; label: string }[] = [
    { value: "eventos", label: "Eventos" },
    { value: "palestras", label: "Palestras" },
    { value: "storytelling", label: "Storytelling" },
];

export const mockPosts: Post[] = [
    {
        id: "1",
        title: "Como o Web Summit 2026 Está Redefinindo o Futuro dos Eventos Tech",
        excerpt: "Uma imersão completa nos bastidores do maior evento de tecnologia da Europa e como a inteligência artificial está transformando a experiência.",
        content: `<h2>O Futuro Chegou a Lisboa</h2><p>O Web Summit 2026 não é apenas um evento — é um prenúncio do que está por vir. Com mais de 70.000 participantes de 160 países, esta edição trouxe inovações que vão além do palco principal.</p><blockquote>"A tecnologia não substitui a conexão humana. Ela a amplifica." — Paddy Cosgrave</blockquote><h2>Os Destaques</h2><p>Enquanto a mídia focava nos grandes nomes, as verdadeiras revoluções aconteciam nos corredores do pavilhão 3. Startups de realidade aumentada demonstravam como eventos presenciais e virtuais podem coexistir.</p><h3>A Economia da Experiência</h3><p>Cada detalhe do evento foi pensado para criar memórias. Desde a iluminação adaptativa até os espaços de reflexão silenciosos para processar ideias.</p><ul><li>Mais de 2.500 startups presentes</li><li>150 palestras simultâneas em 12 palcos</li><li>Taxa de satisfação de 94%</li></ul><h2>O Que Isso Significa</h2><p>Eventos não são mais sobre transmitir informação — são sobre criar transformação.</p>`,
        category: "eventos", author: "Kauan", published: true, featured: true, createdAt: "2026-02-24T10:00:00Z", readTime: "8 min",
    },
    {
        id: "2",
        title: "7 Técnicas Narrativas dos Melhores TEDx Speakers do Mundo",
        excerpt: "O que separa uma palestra medíocre de uma que muda vidas? Analisamos os padrões dos speakers mais assistidos.",
        content: `<h2>O Poder da Narrativa</h2><p>As palestras que mais impactam utilizam pelo menos três das técnicas que vamos revelar aqui.</p><h2>1. O Gancho dos 8 Segundos</h2><p>Os melhores speakers capturam atenção nos primeiros 8 segundos. Não com dados — com uma história pessoal ou pergunta provocativa.</p><blockquote>"As pessoas vão esquecer o que você disse, mas nunca vão esquecer como você as fez sentir." — Maya Angelou</blockquote><h2>2. A Estrutura do Herói</h2><p>Toda grande palestra segue a jornada do herói adaptada. O speaker é o guia, a audiência é o herói.</p><h3>Os 3 Atos</h3><ul><li><strong>Ato 1:</strong> Estabeleça o problema</li><li><strong>Ato 2:</strong> Compartilhe a jornada</li><li><strong>Ato 3:</strong> Revele a transformação</li></ul>`,
        category: "palestras", author: "Kauan", published: true, featured: false, createdAt: "2026-02-22T14:00:00Z", readTime: "6 min",
    },
    {
        id: "3",
        title: "Storytelling Corporativo: Por Que Sua Empresa Precisa de Uma Narrativa",
        excerpt: "Das startups do Vale do Silício às empresas centenárias, como o storytelling se tornou a arma secreta do branding moderno.",
        content: `<h2>A Revolução Silenciosa</h2><p>Enquanto equipes de marketing se debatem sobre métricas, as empresas mais valiosas estão contando histórias.</p><h2>Case Study: Natura</h2><p>A Natura não vende cosméticos. Ela vende a história da Amazônia, da sustentabilidade, da beleza que vem de dentro.</p><blockquote>"Uma marca sem história é apenas um logotipo. Uma marca com história é um movimento." — Simon Sinek</blockquote><h2>Os 4 Pilares</h2><ul><li><strong>Origem:</strong> De onde viemos?</li><li><strong>Missão:</strong> O que nos mantém acordados?</li><li><strong>Comunidade:</strong> Quem está por trás da marca?</li><li><strong>Futuro:</strong> Para onde caminhamos?</li></ul>`,
        category: "storytelling", author: "Kauan", published: true, featured: false, createdAt: "2026-02-20T09:00:00Z", readTime: "5 min",
    },
    {
        id: "4",
        title: "SXSW 2026: As 5 Tendências que Vão Dominar os Eventos em 2027",
        excerpt: "Direto de Austin — as tendências mais quentes do South by Southwest que todo profissional precisa conhecer.",
        content: `<h2>Austin Nunca Decepciona</h2><p>Do SXSW 2026 saíram as sementes do que será o mercado de eventos no próximo ano.</p><h2>Tendência 1: Eventos Phygital</h2><p>A fusão do físico com o digital não é mais tendência — é obrigação.</p><h2>Tendência 2: Micro-eventos de Alto Impacto</h2><p>Menos é mais. Eventos com 50-100 pessoas, ultra-curados, estão gerando mais valor percebido.</p>`,
        category: "eventos", author: "Kauan", published: true, featured: false, createdAt: "2026-02-18T11:00:00Z", readTime: "7 min",
    },
    {
        id: "5",
        title: "De Introvertido a Speaker: Uma Jornada Nos Palcos Brasileiros",
        excerpt: "Uma história real sobre como superar o medo de falar em público e se tornar referência em storytelling.",
        content: `<h2>O Começo Improvável</h2><p>Há três anos, eu suava frio de pensar em falar para mais de 5 pessoas. Hoje, já passei por palcos com mais de 3.000 espectadores.</p><blockquote>"A coragem não é a ausência do medo. É a decisão de que algo é mais importante que o medo."</blockquote><h2>O Primeiro Palco</h2><p>Foi num meetup de tecnologia em São Paulo. 30 pessoas. Minhas mãos tremiam tanto que eu mal conseguia segurar o clicker. Mas uma pessoa veio me agradecer depois. Apenas uma. E foi suficiente.</p>`,
        category: "storytelling", author: "Kauan", published: true, featured: false, createdAt: "2026-02-15T16:00:00Z", readTime: "10 min",
    },
];

export const mockSubscribers: Subscriber[] = [
    { id: "1", email: "maria@exemplo.com", name: "Maria Silva", createdAt: "2026-02-24T08:00:00Z", status: "active" },
    { id: "2", email: "joao@exemplo.com", name: "João Santos", createdAt: "2026-02-23T14:00:00Z", status: "active" },
    { id: "3", email: "ana@exemplo.com", name: "Ana Oliveira", createdAt: "2026-02-22T10:00:00Z", status: "active" },
    { id: "4", email: "pedro@exemplo.com", name: "Pedro Costa", createdAt: "2026-02-21T09:00:00Z", status: "active" },
    { id: "5", email: "lucas@exemplo.com", name: "Lucas Lima", createdAt: "2026-02-20T16:00:00Z", status: "inactive" },
    { id: "6", email: "camila@exemplo.com", name: "Camila Reis", createdAt: "2026-02-19T11:00:00Z", status: "active" },
    { id: "7", email: "rafael@exemplo.com", name: "Rafael Martins", createdAt: "2026-02-18T15:00:00Z", status: "active" },
    { id: "8", email: "julia@exemplo.com", name: "Júlia Ferreira", createdAt: "2026-02-17T08:00:00Z", status: "active" },
];

export const mockStats: DashboardStats = { totalSubscribers: 1247, totalPosts: 42, openRate: 68.5, growthPercent: 15.3 };

export function formatDate(d: string) {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateFull(d: string) {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export interface CategoryStyle {
    badge: string;
    card: string;
}

const categoryStyles: Record<Category, CategoryStyle> = {
    eventos: {
        badge: "bg-sky-50 text-sky-600 dark:bg-accent-500/10 dark:text-accent-400",
        card: "bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20",
    },
    palestras: {
        badge: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
        card: "bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20",
    },
    storytelling: {
        badge: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        card: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    },
};

export function getCategoryStyle(category: Category): CategoryStyle {
    return categoryStyles[category];
}
