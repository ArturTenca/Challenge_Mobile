import { useRef, useEffect, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Grid } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import FordRangerRaptor from './FordRangerRaptor'
import styles from './SpecsPage.module.css'
import fordLogo from '../assets/Ford-Logo-PNG-Isolated-Image.webp'

// Camera positions & targets for each view
const VIEWS = {
  geral_traseira:  { pos: [-8, 1.5, -5],  target: [0, 0, 0], label: 'Traseira' },
  geral_lateral:   { pos: [10, 1.0, 0],   target: [0, 0, 0], label: 'Lateral' },
  geral_frente:    { pos: [0,  1.5, 10],  target: [0, 0, 0], label: 'Frente' },
  geral_topo:      { pos: [0,  8,   0],   target: [0, 0, 0], label: 'Topo' },
  motor_frente:    { pos: [0,  2,   7],   target: [0, 1, 0], label: 'Motor' },
  motor_hood:      { pos: [0,  4,   4],   target: [0, 0.5, 0], label: 'Capô' },
  rodas_dianteira: { pos: [5,  0.4, 5],   target: [2, -1, 2], label: 'Roda Dianteira' },
  rodas_traseira:  { pos: [-5, 0.4, -4],  target: [-2, -1, -2], label: 'Roda Traseira' },
  caçamba:         { pos: [-6, 3,  -2],   target: [-1, 0.5, -1], label: 'Caçamba' },
  cockpit:         { pos: [2,  2,   5],   target: [0, 1, 0], label: 'Cockpit' },
}

const NAV_CATEGORIES = [
  {
    id: 'geral',
    label: 'Visão Geral',
    children: ['geral_traseira', 'geral_lateral', 'geral_frente', 'geral_topo'],
  },
  {
    id: 'motor',
    label: 'Motor',
    children: ['motor_frente', 'motor_hood'],
  },
  {
    id: 'rodas',
    label: 'Rodas',
    children: ['rodas_dianteira', 'rodas_traseira'],
  },
  {
    id: 'carroceria',
    label: 'Carroceria',
    children: ['caçamba', 'cockpit'],
  },
]

const SPECS_DATA = [
  { section: 'Motor & Performance', items: [
    { label: 'Motor', value: '3.0 V6 Bi-turbo Diesel' },
    { label: 'Potência', value: '397 cv @ 3.500 rpm' },
    { label: 'Torque', value: '583 Nm @ 1.750-3.000 rpm' },
    { label: 'Câmbio', value: '10 marchas automático SelectShift' },
    { label: '0-100 km/h', value: '5,4 segundos' },
    { label: 'Velocidade Máx.', value: '180 km/h' },
  ]},
  { section: 'Tração & Suspensão', items: [
    { label: 'Tração', value: '4x4 inteligente com baixa' },
    { label: 'Suspensão Dianteira', value: 'Fox Racing Shox 2.5" bypass' },
    { label: 'Suspensão Traseira', value: 'Multilink com Fox Racing Shox' },
    { label: 'Course Dianteiro', value: '296 mm' },
    { label: 'Course Traseiro', value: '297 mm' },
    { label: 'Ângulo de Ataque', value: '33,1°' },
  ]},
  { section: 'Dimensões', items: [
    { label: 'Comprimento', value: '5.362 mm' },
    { label: 'Largura', value: '2.028 mm' },
    { label: 'Altura', value: '1.873 mm' },
    { label: 'Entre-eixos', value: '3.270 mm' },
    { label: 'Capacidade de carga', value: '620 kg' },
    { label: 'Pneus', value: '285/70 R17 BFGoodrich' },
  ]},
]

// Animated Camera Controller
function CameraController({ targetView }) {
  const { camera } = useThree()
  const currentPos = useRef(new THREE.Vector3(...targetView.pos))
  const currentTarget = useRef(new THREE.Vector3(...targetView.target))
  const targetPos = useRef(new THREE.Vector3(...targetView.pos))
  const targetTgt = useRef(new THREE.Vector3(...targetView.target))
  const lookAt = useRef(new THREE.Vector3(...targetView.target))

  useEffect(() => {
    targetPos.current.set(...targetView.pos)
    targetTgt.current.set(...targetView.target)
  }, [targetView])

  useFrame(() => {
    currentPos.current.lerp(targetPos.current, 0.04)
    currentTarget.current.lerp(targetTgt.current, 0.04)
    camera.position.copy(currentPos.current)
    lookAt.current.copy(currentTarget.current)
    camera.lookAt(lookAt.current)
  })

  return null
}

export default function SpecsPage({ onBack, onViewReport, onHome }) {
  const [activeView, setActiveView] = useState('geral_lateral')
  const [openCategory, setOpenCategory] = useState('geral')
  const [activeSection, setActiveSection] = useState(0)

  const view = VIEWS[activeView]

  function handleCategory(id) {
    setOpenCategory(id === openCategory ? null : id)
  }

  function handleView(viewId) {
    setActiveView(viewId)
  }

  return (
    <div className={styles.page}>
      {/* 3D Canvas */}
      <div className={styles.canvas}>
        <Canvas
          camera={{ position: VIEWS['geral_lateral'].pos, fov: 40, near: 0.1, far: 200 }}
          shadows
          gl={{ antialias: true }}
          style={{ background: 'transparent' }}
        >
          <CameraController targetView={view} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 15, 8]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
          <directionalLight position={[-8, 8, -5]} intensity={0.8} color="#4a7aff" />
          <pointLight position={[0, 6, -8]} intensity={1.2} color="#c8922a" />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <FordRangerRaptor />
          </Suspense>
          <ContactShadows position={[0, -1.42, 0]} opacity={0.7} scale={20} blur={2.5} far={6} color="#000000" />
          <Grid
            position={[0, -1.42, 0]} args={[30, 30]}
            cellSize={0.8} cellThickness={0.5} cellColor="#1a2535"
            sectionSize={4} sectionThickness={1} sectionColor="#1e2f45"
            fadeDistance={25} fadeStrength={1} infiniteGrid
          />
        </Canvas>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <button className={styles.logo} onClick={onHome}>
          <img src={fordLogo} alt="Ford" className={styles.logoImg} />
        </button>
        <nav className={styles.nav}>
          <button className={styles.backBtn} onClick={onBack}>← Voltar</button>
          <span className={styles.navTitle}>Ranger Raptor 2025 · Especificações</span>
          {onViewReport && (
            <button className={styles.reportBtn} onClick={onViewReport}>Relatório</button>
          )}
        </nav>
      </header>

      {/* Camera Nav (cascade buttons) */}
      <div className={styles.camNav}>
        <div className={styles.camNavLabel}>EXPLORAR</div>
        {NAV_CATEGORIES.map(cat => (
          <div key={cat.id} className={styles.camCategoryWrap}>
            <button
              className={`${styles.camCategory} ${openCategory === cat.id ? styles.camCategoryActive : ''}`}
              onClick={() => handleCategory(cat.id)}
            >
              {cat.label}
              <span className={styles.chevron}>{openCategory === cat.id ? '▲' : '▼'}</span>
            </button>
            {openCategory === cat.id && (
              <div className={styles.camChildren}>
                {cat.children.map((viewId, i) => (
                  <button
                    key={viewId}
                    className={`${styles.camChild} ${activeView === viewId ? styles.camChildActive : ''}`}
                    onClick={() => handleView(viewId)}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {VIEWS[viewId].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Specs Panel */}
      <div className={styles.specsPanel}>
        <div className={styles.specsTabs}>
          {SPECS_DATA.map((sec, i) => (
            <button
              key={i}
              className={`${styles.specsTab} ${activeSection === i ? styles.specsTabActive : ''}`}
              onClick={() => setActiveSection(i)}
            >
              {sec.section}
            </button>
          ))}
        </div>
        <div className={styles.specsTable}>
          {SPECS_DATA[activeSection].items.map(item => (
            <div key={item.label} className={styles.specsRow}>
              <span className={styles.specsRowLabel}>{item.label}</span>
              <span className={styles.specsRowValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Label overlay */}
      <div className={styles.viewLabel}>
        {VIEWS[activeView].label}
      </div>
    </div>
  )
}
