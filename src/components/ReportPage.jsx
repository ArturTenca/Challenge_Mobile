import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  RadialBarChart, RadialBar,
} from 'recharts'
import styles from './ReportPage.module.css'
import fordLogo from '../assets/Ford-Logo-PNG-Isolated-Image.webp'

// ── COMPETITORS ─────────────────────────────────────────────────────────────
const COMPETITORS = [
  { id: 'raptor', name: 'Ranger Raptor', short: 'Raptor', color: '#f54b2e' },
  { id: 'hilux', name: 'Hilux GR-S', short: 'Hilux', color: '#ef4444' },
  { id: 'amarok', name: 'Amarok V6', short: 'Amarok', color: '#3b82f6' },
  { id: 's10', name: 'S10 High Country', short: 'S10', color: '#eab308' },
  { id: 'l200', name: 'L200 Triton', short: 'L200', color: '#8b5cf6' },
]

const RADAR_DATA = [
  { subject: 'Potência', Raptor: 98, Hilux: 62, Amarok: 85, S10: 70, L200: 65 },
  { subject: 'Off-Road', Raptor: 96, Hilux: 78, Amarok: 72, S10: 68, L200: 74 },
  { subject: 'Suspensão', Raptor: 97, Hilux: 70, Amarok: 68, S10: 65, L200: 66 },
  { subject: 'Segurança', Raptor: 88, Hilux: 82, Amarok: 90, S10: 78, L200: 75 },
  { subject: 'Conectividade', Raptor: 82, Hilux: 75, Amarok: 92, S10: 80, L200: 70 },
  { subject: 'Conforto', Raptor: 90, Hilux: 78, Amarok: 88, S10: 85, L200: 72 },
]

const ENGINE_DATA = [
  { spec: 'Potência (cv)', raptor: 397, hilux: 224, amarok: 258, s10: 206, l200: 190 },
  { spec: 'Torque (Nm)', raptor: 583, hilux: 550, amarok: 580, s10: 450, l200: 430 },
  { spec: '0-100 (s)', raptor: 5.4, hilux: 9.2, amarok: 7.1, s10: 8.5, l200: 9.8 },
  { spec: 'Course (mm)', raptor: 296, hilux: 220, amarok: 210, s10: 200, l200: 215 },
  { spec: 'Carga (kg)', raptor: 620, hilux: 1000, amarok: 1050, s10: 1100, l200: 1080 },
]

const OVERALL_SCORES = [
  { name: 'Ranger Raptor', value: 91, fill: '#f54b2e' },
  { name: 'Amarok V6', value: 84, fill: '#3b82f6' },
  { name: 'S10 High Country', value: 78, fill: '#eab308' },
  { name: 'Hilux GR-S', value: 76, fill: '#ef4444' },
  { name: 'L200 Triton', value: 72, fill: '#8b5cf6' },
]

const FEATURES_COMPARISON = [
  {
    category: 'Motor & Performance',
    icon: '⚙️',
    items: [
      { name: 'Motor V6 Bi-Turbo', raptor: true, hilux: false, amarok: true, s10: false, l200: false },
      { name: 'Potência > 350 cv', raptor: true, hilux: false, amarok: false, s10: false, l200: false },
      { name: 'Câmbio 10 marchas', raptor: true, hilux: false, amarok: false, s10: false, l200: false },
      { name: '0-100 km/h < 6s', raptor: true, hilux: false, amarok: false, s10: false, l200: false },
    ],
  },
  {
    category: 'Off-Road & Suspensão',
    icon: '🏔️',
    items: [
      { name: 'Fox Racing Shox 2.5"', raptor: true, hilux: false, amarok: false, s10: false, l200: false },
      { name: 'Course > 280 mm', raptor: true, hilux: false, amarok: false, s10: false, l200: false },
      { name: 'Modos Terrain Management', raptor: true, hilux: true, amarok: true, s10: true, l200: true },
      { name: 'Diferencial Traseiro Blocante', raptor: true, hilux: true, amarok: true, s10: true, l200: true },
      { name: 'Pneus All-Terrain 285/70', raptor: true, hilux: false, amarok: false, s10: false, l200: false },
    ],
  },
  {
    category: 'Segurança',
    icon: '🛡️',
    items: [
      { name: 'AEB + Alerta Colisão', raptor: true, hilux: true, amarok: true, s10: true, l200: true },
      { name: 'BLIS + Tráfego Cruzado', raptor: true, hilux: false, amarok: true, s10: false, l200: false },
      { name: 'Piloto Adaptativo Stop&Go', raptor: true, hilux: false, amarok: true, s10: true, l200: false },
      { name: 'Câmera 360°', raptor: true, hilux: false, amarok: true, s10: true, l200: false },
      { name: 'Airbags (un.)', raptor: false, hilux: false, amarok: false, s10: false, l200: false, values: ['7', '7', '9', '6', '6'] },
    ],
  },
  {
    category: 'Conectividade',
    icon: '📡',
    items: [
      { name: 'Android Auto / CarPlay Wireless', raptor: true, hilux: true, amarok: true, s10: true, l200: false },
      { name: 'Tela Multimídia (pol.)', raptor: false, hilux: false, amarok: false, s10: false, l200: false, values: ['12"', '8"', '12"', '11.3"', '8"'] },
      { name: 'Painel Digital (pol.)', raptor: false, hilux: false, amarok: false, s10: false, l200: false, values: ['12.4"', '4.2"', '12"', '8"', '7"'] },
      { name: 'Carregamento Wireless', raptor: true, hilux: false, amarok: true, s10: true, l200: false },
      { name: 'Reconhecimento de Voz PT-BR', raptor: false, hilux: false, amarok: true, s10: true, l200: false },
    ],
  },
]

const CATEGORY_GRADES = [
  {
    category: 'Motor & Performance',
    grade: 'A+',
    score: 98,
    rank: 1,
    total: 5,
    leader: 'Ranger Raptor',
    gap: null,
    status: 'lider',
  },
  {
    category: 'Off-Road & Suspensão',
    grade: 'A+',
    score: 96,
    rank: 1,
    total: 5,
    leader: 'Ranger Raptor',
    gap: null,
    status: 'lider',
  },
  {
    category: 'Segurança Ativa',
    grade: 'B+',
    score: 88,
    rank: 2,
    total: 5,
    leader: 'Amarok V6',
    gap: '-4 pts vs Amarok (9 airbags, ADAS avançado)',
    status: 'competitivo',
  },
  {
    category: 'Conectividade',
    grade: 'B',
    score: 82,
    rank: 3,
    total: 5,
    leader: 'Amarok V6',
    gap: '-10 pts vs Amarok (voz PT-BR, App Store)',
    status: 'melhorar',
  },
  {
    category: 'Conforto & Interior',
    grade: 'A',
    score: 90,
    rank: 2,
    total: 5,
    leader: 'Amarok V6',
    gap: '-2 pts vs Amarok (acabamento premium)',
    status: 'competitivo',
  },
  {
    category: 'Capacidade de Carga',
    grade: 'C+',
    score: 68,
    rank: 5,
    total: 5,
    leader: 'S10 High Country',
    gap: '-480 kg vs S10 (sacrifício off-road)',
    status: 'tradeoff',
  },
]

const UPGRADE_RECOMMENDATIONS = [
  {
    priority: 'alta',
    title: 'Pacote ADAS Premium',
    category: 'Segurança',
    impact: '+6 pts',
    description: 'Adicionar Reverse AEB, assistente de permanência em faixa e monitoramento de fadiga do motorista.',
    items: ['Reverse AEB com frenagem automática', 'Lane Keeping Assist ativo', 'Driver Attention Alert'],
    competitorRef: 'Amarok V6 lidera com 9 airbags e pacote IQ.Drive completo',
  },
  {
    priority: 'alta',
    title: 'SYNC 4A com Voz em Português',
    category: 'Conectividade',
    impact: '+8 pts',
    description: 'Atualizar software SYNC para reconhecimento de voz nativo em PT-BR e loja de aplicativos integrada.',
    items: ['Comandos de voz em português brasileiro', 'App Store Ford integrada', 'OTA updates automáticos'],
    competitorRef: 'Amarok V6 e S10 já oferecem assistente de voz localizado',
  },
  {
    priority: 'média',
    title: 'Caçamba Modular Pro',
    category: 'Utilitário',
    impact: '+5 pts',
    description: 'Sistema de organização com divisórias, tomada 220V reforçada e proteção anti-UV para compensar menor capacidade de carga.',
    items: ['Divisórias modulares de alumínio', 'Tomada 220V 400W na caçamba', 'Tampa rígida com trava elétrica'],
    competitorRef: 'Hilux e S10 lideram em volume e capacidade de carga',
  },
  {
    priority: 'média',
    title: 'Interior Raptor+',
    category: 'Conforto',
    impact: '+4 pts',
    description: 'Elevar acabamento interno com materiais premium para igualar Amarok e S10 no segmento topo.',
    items: ['Painel com costura em couro sintético', 'Iluminação ambiente 64 cores', 'Bancos com ventilação'],
    competitorRef: 'Amarok V6 Highline referência em acabamento premium',
  },
  {
    priority: 'baixa',
    title: 'Eficiência Híbrida Leve (MHEV)',
    category: 'Motor',
    impact: '+3 pts',
    description: 'Sistema mild-hybrid para reduzir consumo urbano sem comprometer performance off-road.',
    items: ['Alternador-starter 48V', 'Recuperação de energia na frenagem', 'Start/Stop inteligente off-road aware'],
    competitorRef: 'Tendência do segmento — nenhum concorrente direto oferece ainda',
  },
]

const HIGHLIGHTS = [
  { label: 'Potência', value: '397 cv', sub: 'Líder da categoria', icon: '⚡' },
  { label: 'Torque', value: '583 Nm', sub: '2º melhor do segmento', icon: '🌀' },
  { label: 'Off-Road', value: '296 mm', sub: 'Maior curso do mercado', icon: '🏔️' },
  { label: '0-100 km/h', value: '5,4 s', sub: 'Mais rápida da categoria', icon: '🏁' },
  { label: 'Score Geral', value: '91/100', sub: '1º entre 5 rivais', icon: '🏆' },
  { label: 'Posição', value: '#1', sub: 'Performance off-road', icon: '✅' },
]

const COMPETITOR_NAMES = COMPETITORS.map(c => c.short)

// ── EXPORT HELPERS ───────────────────────────────────────────────────────────
function buildCSVContent() {
  const header = ['Especificação', ...COMPETITORS.map(c => c.name)]
  const rows = [header]
  rows.push(['--- Motor & Performance ---', ...COMPETITORS.map(() => '')])
  ENGINE_DATA.forEach(row => {
    rows.push([row.spec, row.raptor, row.hilux, row.amarok, row.s10, row.l200])
  })
  rows.push(['--- Score Geral ---', ...COMPETITORS.map(() => '')])
  OVERALL_SCORES.forEach(s => {
    const vals = COMPETITORS.map(c => s.name.includes(c.name.split(' ')[0]) || s.name === c.name ? s.value : '')
    rows.push(['Score', ...vals])
  })
  return rows.map(r => r.join(',')).join('\n')
}

function buildTXTContent() {
  return `FORD RANGER RAPTOR 2026 - RELATÓRIO COMPARATIVO
${'='.repeat(60)}
Gerado em: ${new Date().toLocaleString('pt-BR')}
Análise: Ranger Raptor vs principais concorrentes do segmento

CONCORRENTES ANALISADOS
${'─'.repeat(60)}
  • Ford Ranger Raptor (referência)
  • Toyota Hilux GR-S
  • VW Amarok V6
  • Chevrolet S10 High Country
  • Mitsubishi L200 Triton

SCORE GERAL
${'─'.repeat(60)}
${OVERALL_SCORES.map((s, i) => `  ${i + 1}º  ${s.name.padEnd(22)} ${s.value}/100`).join('\n')}

NOTAS POR CATEGORIA — RANGER RAPTOR
${'─'.repeat(60)}
${CATEGORY_GRADES.map(g => `  ${g.category.padEnd(26)} ${g.grade}  (${g.score}/100) — ${g.rank}º de ${g.total}`).join('\n')}

UPGRADES RECOMENDADOS
${'─'.repeat(60)}
${UPGRADE_RECOMMENDATIONS.map((u, i) => `  ${i + 1}. [${u.priority.toUpperCase()}] ${u.title} (${u.impact})\n     ${u.description}`).join('\n\n')}

${'='.repeat(60)}
Ford Motor Company - Dados mockados para demonstração
`
}

// ── COMPONENT ────────────────────────────────────────────────────────────────
const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(8,10,14,0.95)',
  border: '1px solid rgba(245, 75, 46,0.3)',
  borderRadius: '4px',
  color: '#e8e2d6',
  fontSize: '0.75rem',
  fontFamily: 'Inter, sans-serif',
}

function gradeClass(grade) {
  if (grade.startsWith('A')) return styles.gradeA
  if (grade.startsWith('B')) return styles.gradeB
  if (grade.startsWith('C')) return styles.gradeC
  return styles.gradeD
}

function priorityClass(priority) {
  if (priority === 'alta') return styles.priorityAlta
  if (priority === 'média') return styles.priorityMedia
  return styles.priorityBaixa
}

function statusLabel(status) {
  if (status === 'lider') return 'Líder'
  if (status === 'competitivo') return 'Competitivo'
  if (status === 'melhorar') return 'A melhorar'
  return 'Trade-off'
}

export default function ReportPage({ onBack, onHome }) {
  const [activeCategory, setActiveCategory] = useState(0)
  const [exporting, setExporting] = useState(null)

  function exportCSV() {
    setExporting('csv')
    const content = buildCSVContent()
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ranger-raptor-comparativo.csv'
    a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setExporting(null), 1200)
  }

  function exportTXT() {
    setExporting('txt')
    const content = buildTXTContent()
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ranger-raptor-comparativo.txt'
    a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setExporting(null), 1200)
  }

  function exportPDF() {
    setExporting('pdf')
    window.print()
    setTimeout(() => setExporting(null), 2000)
  }

  const cat = FEATURES_COMPARISON[activeCategory]
  const projectedScore = Math.min(
    99,
    91 + UPGRADE_RECOMMENDATIONS.reduce((sum, u) => sum + (parseInt(u.impact, 10) || 0), 0),
  )

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.logoBtn} onClick={onHome} aria-label="Home">
            <img src={fordLogo} alt="Ford" className={styles.logoImg} />
          </button>
          <div className={styles.headerTitle}>
            <span className={styles.headerSub}>RANGER RAPTOR 2026</span>
            <span className={styles.headerMain}>Relatório Comparativo</span>
          </div>
        </div>
        <nav className={styles.headerRight}>
          <div className={styles.exportGroup}>
            <button
              className={`${styles.exportBtn} ${exporting === 'csv' ? styles.exportBtnActive : ''}`}
              onClick={exportCSV}
            >
              <span className={styles.exportIcon}>⬇</span>
              CSV
            </button>
            <button
              className={`${styles.exportBtn} ${exporting === 'txt' ? styles.exportBtnActive : ''}`}
              onClick={exportTXT}
            >
              <span className={styles.exportIcon}>⬇</span>
              TXT
            </button>
            <button
              className={`${styles.exportBtn} ${styles.exportBtnPdf} ${exporting === 'pdf' ? styles.exportBtnActive : ''}`}
              onClick={exportPDF}
            >
              <span className={styles.exportIcon}>⬇</span>
              PDF
            </button>
          </div>
          <button className={styles.backBtn} onClick={onBack}>← Voltar</button>
        </nav>
      </header>

      <div className={styles.scroll}>
        <section className={styles.heroStrip}>
          <div className={styles.heroLabel}>
            <span className={styles.heroEyebrow}>Análise Competitiva · Segmento Pickup Premium</span>
            <h1 className={styles.heroTitle}>RANGER <span>RAPTOR</span></h1>
            <p className={styles.heroDesc}>
              Comparativo de desempenho contra Hilux GR-S, Amarok V6, S10 High Country e L200 Triton
            </p>
          </div>
          <div className={styles.heroGrid}>
            {HIGHLIGHTS.map(h => (
              <div key={h.label} className={styles.heroCard}>
                <span className={styles.heroCardIcon}>{h.icon}</span>
                <span className={styles.heroCardValue}>{h.value}</span>
                <span className={styles.heroCardLabel}>{h.label}</span>
                <span className={styles.heroCardSub}>{h.sub}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.competitorLegend}>
          {COMPETITORS.map(c => (
            <div key={c.id} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: c.color }} />
              <span className={styles.legendName}>{c.name}</span>
              {c.id === 'raptor' && <span className={styles.legendBadge}>Referência</span>}
            </div>
          ))}
        </section>

        <section className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartCardTitle}>Score por Dimensão</span>
              <span className={styles.chartCardSub}>Raptor vs 4 concorrentes diretos</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#5a6478', fontSize: 10, fontFamily: 'Inter' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Raptor" dataKey="Raptor" stroke="#f54b2e" fill="#f54b2e" fillOpacity={0.2} strokeWidth={2.5} />
                <Radar name="Hilux" dataKey="Hilux" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={1.5} />
                <Radar name="Amarok" dataKey="Amarok" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="S10" dataKey="S10" stroke="#eab308" fill="#eab308" fillOpacity={0.05} strokeWidth={1.5} />
                <Radar name="L200" dataKey="L200" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.05} strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: '0.65rem', color: '#5a6478', fontFamily: 'Inter' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartCardTitle}>Especificações Técnicas</span>
              <span className={styles.chartCardSub}>Valores absolutos por modelo</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ENGINE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="spec" tick={{ fill: '#5a6478', fontSize: 9, fontFamily: 'Inter' }} />
                <YAxis tick={{ fill: '#5a6478', fontSize: 9, fontFamily: 'Inter' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: '0.65rem', color: '#5a6478', fontFamily: 'Inter' }} />
                <Bar dataKey="raptor" name="Raptor" fill="#f54b2e" radius={[2, 2, 0, 0]} />
                <Bar dataKey="hilux" name="Hilux" fill="#ef4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="amarok" name="Amarok" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="s10" name="S10" fill="#eab308" radius={[2, 2, 0, 0]} />
                <Bar dataKey="l200" name="L200" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartCardTitle}>Ranking Geral</span>
              <span className={styles.chartCardSub}>Score consolidado do segmento</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                innerRadius="25%"
                outerRadius="90%"
                data={OVERALL_SCORES}
                startAngle={180}
                endAngle={-180}
              >
                <RadialBar
                  minAngle={15}
                  background={{ fill: 'rgba(255,255,255,0.03)' }}
                  dataKey="value"
                  label={{ fill: '#e8e2d6', fontSize: 10, fontFamily: 'Inter' }}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: '0.68rem', color: '#5a6478', fontFamily: 'Inter' }}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}/100`, 'Score']} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.featuresSectionHeader}>
            <h2 className={styles.featuresSectionTitle}>Equipamentos vs Concorrentes</h2>
            <div className={styles.featuresTabs}>
              {FEATURES_COMPARISON.map((c, i) => (
                <button
                  key={i}
                  className={`${styles.featuresTab} ${activeCategory === i ? styles.featuresTabActive : ''}`}
                  onClick={() => setActiveCategory(i)}
                >
                  {c.icon} {c.category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.featuresTable}>
            <div className={`${styles.featuresTableHead} ${styles.featuresTableHeadWide}`}>
              <div className={styles.featuresCol}>EQUIPAMENTO</div>
              {COMPETITOR_NAMES.map(v => (
                <div key={v} className={styles.featuresColVar}>{v}</div>
              ))}
            </div>
            {cat.items.map((item, i) => (
              <div key={i} className={`${styles.featuresRow} ${styles.featuresRowWide} ${i % 2 === 0 ? styles.featuresRowAlt : ''}`}>
                <div className={styles.featuresItemName}>{item.name}</div>
                {item.values ? (
                  item.values.map((v, vi) => (
                    <div key={vi} className={styles.featuresItemCell}>
                      <span className={`${styles.featuresValue} ${vi === 0 ? styles.featuresValueHighlight : ''}`}>{v}</span>
                    </div>
                  ))
                ) : (
                  [item.raptor, item.hilux, item.amarok, item.s10, item.l200].map((has, vi) => (
                    <div key={vi} className={styles.featuresItemCell}>
                      {has
                        ? <span className={`${styles.checkYes} ${vi === 0 ? styles.checkYesHighlight : ''}`}>✓</span>
                        : <span className={styles.checkNo}>—</span>}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.gradesSection}>
          <div className={styles.gradesSectionHeader}>
            <div>
              <h2 className={styles.gradesSectionTitle}>Notas & Diagnóstico</h2>
              <p className={styles.gradesSectionSub}>
                Avaliação do Ranger Raptor em cada categoria contra o segmento
              </p>
            </div>
            <div className={styles.overallGradeCard}>
              <span className={styles.overallGradeLabel}>NOTA GERAL</span>
              <span className={styles.overallGradeValue}>A</span>
              <span className={styles.overallGradeScore}>91/100 · 1º lugar</span>
            </div>
          </div>

          <div className={styles.gradesGrid}>
            {CATEGORY_GRADES.map(g => (
              <div key={g.category} className={styles.gradeCard}>
                <div className={styles.gradeCardTop}>
                  <span className={`${styles.gradeLetter} ${gradeClass(g.grade)}`}>{g.grade}</span>
                  <span className={`${styles.gradeStatus} ${styles[`status_${g.status}`]}`}>
                    {statusLabel(g.status)}
                  </span>
                </div>
                <h3 className={styles.gradeCardTitle}>{g.category}</h3>
                <div className={styles.gradeCardMeta}>
                  <span className={styles.gradeCardScore}>{g.score}/100</span>
                  <span className={styles.gradeCardRank}>{g.rank}º de {g.total}</span>
                </div>
                <div className={styles.gradeBar}>
                  <div className={styles.gradeBarFill} style={{ width: `${g.score}%` }} />
                </div>
                {g.gap && (
                  <p className={styles.gradeGap}>{g.gap}</p>
                )}
                {!g.gap && (
                  <p className={styles.gradeGapLeader}>Líder absoluto do segmento</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.upgradeSection}>
          <div className={styles.upgradeSectionHeader}>
            <div>
              <h2 className={styles.upgradeSectionTitle}>Upgrades Recomendados</h2>
              <p className={styles.upgradeSectionSub}>
                Melhorias sugeridas para elevar a competitividade do Ranger Raptor
              </p>
            </div>
            <div className={styles.projectedScore}>
              <span className={styles.projectedLabel}>SCORE PROJETADO</span>
              <span className={styles.projectedValue}>{projectedScore}/100</span>
              <span className={styles.projectedDelta}>+{projectedScore - 91} pts com todos os upgrades</span>
            </div>
          </div>

          <div className={styles.upgradeList}>
            {UPGRADE_RECOMMENDATIONS.map((u, i) => (
              <article key={i} className={styles.upgradeCard}>
                <div className={styles.upgradeCardHeader}>
                  <span className={`${styles.upgradePriority} ${priorityClass(u.priority)}`}>
                    {u.priority}
                  </span>
                  <span className={styles.upgradeImpact}>{u.impact}</span>
                  <span className={styles.upgradeCategory}>{u.category}</span>
                </div>
                <h3 className={styles.upgradeTitle}>{u.title}</h3>
                <p className={styles.upgradeDesc}>{u.description}</p>
                <ul className={styles.upgradeItems}>
                  {u.items.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.upgradeRef}>
                  <span>Ref:</span> {u.competitorRef}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className={styles.reportFooter}>
          <span>Análise comparativa · Dados mockados para demonstração</span>
          <span>Ranger Raptor vs Hilux GR-S · Amarok V6 · S10 · L200 Triton</span>
          <span>© {new Date().getFullYear()} Ford Motor Company</span>
        </footer>
      </div>
    </div>
  )
}
