import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import bdaCover from '../../assets/about/bda.webp'
import escutaCover from '../../assets/about/escuta.webp'
import fiarteCover from '../../assets/about/fiarte.webp'
import photo from '../../assets/about/foto.webp'
import orbit from '../../assets/about/orbita.webp'
import bdaSeal from '../../assets/about/selo-bda.webp'
import tokensCover from '../../assets/about/tokens.webp'
import { buttonClassName } from '../../components/Button/buttonClassName'
import buttonStyles from '../../components/Button/Button.module.css'
import { DecorativeBackground } from '../../components/DecorativeBackground/DecorativeBackground'
import { Icon } from '../../components/Icon/Icon'
import { site } from '../../config/site'
import { hasCasePage, projects } from '../../data/projects'
import { useScrollReveal } from '../cases/useScrollReveal'
import styles from './About.module.css'

type ProofId = 'escuta' | 'vivencia' | 'experimentacao'

type Proof = {
  id: ProofId
  badge: string
  project: string
  slug: string
  title: string
  text: string
  cover: string
  /** Enquadramento da capa (object-position), quando não é centralizado */
  coverPosition?: string
  /** Chip da frase “Considero uma falha o design…” que abre este cartão */
  chip: string
}

/** Bloco 03 — Provas (Figma: componente “Provas / Accordion”, 390:22025; página v2, 390:22036). */
const PROOFS: Proof[] = [
  {
    id: 'escuta',
    badge: 'Escuta',
    project: 'Inova+YQ',
    slug: 'inova-yq',
    title: 'Ouvir antes de iniciar',
    text: 'Entrevistas que mudaram a estrutura do app.',
    cover: escutaCover,
    // Figma: imagem na altura da capa, deslocada 41,24% para a esquerda
    coverPosition: '71.3% 50%',
    chip: 'que não escuta.',
  },
  {
    id: 'vivencia',
    badge: 'Vivência e alteridade',
    project: 'Fiarte',
    slug: 'fiarte',
    title: 'Estar onde a pessoa está',
    text: 'Criado junto com as mestras artesãs.',
    cover: fiarteCover,
    chip: 'que se fecha,',
  },
  {
    id: 'experimentacao',
    badge: 'Experimentação',
    project: 'Tokens',
    slug: 'design-tokens',
    title: 'Testar o que eu mesmo criei',
    text: 'Três marcas para quebrar a regra.',
    cover: tokensCover,
    chip: 'que não experimenta,',
  },
]

/** Ordem dos chips na frase (Figma 389:21925) */
const CHIP_ORDER: ProofId[] = ['vivencia', 'experimentacao', 'escuta']

const MILESTONES = [
  {
    place: 'Comunicação e Marketing | UNIFOR',
    role: 'Estagiário de Criação | 2024–2025',
    text: 'Peças para campanhas em vários canais, com consistência de marca.',
  },
  {
    place: 'Unifor Hub | M. Dias Branco',
    role: 'Bolsista de Iniciação Científica | 2025',
    text: 'Do 2º lugar no hackathon ao piloto: avaliei a ferramenta de Jaboatão e estruturei a estratégia de saída.',
  },
  {
    place: 'Fortaleza Compartilhada',
    role: 'Facilitador de Co-design | 2025',
    text: 'Workshop com 37 moradores, permissionários e poder público, transformado em direcionamentos para a Secretaria Regional.',
  },
  {
    place: 'Vortex | UNIFOR',
    role: 'Product Designer (Bolsista) | 2026',
    text: 'Produtos de saúde, educação e IA, e processos de design com IA: handoff, tokens e agentes.',
    current: true,
  },
]

const AWARDS = [
  { result: '1º lugar', title: 'Hackathon Proenergia Summit 2026', text: 'Projeto SIN Vision' },
  { result: '2º lugar', title: 'O Hacka-Tá-On 2025', text: 'Projeto Tiddo' },
  {
    result: '2º lugar e Menção Honrosa',
    title: 'Encontro de Extensão | UNIFOR',
    text: 'Projeto Varejistas | Ciências Sociais Aplicadas, 2025',
  },
  {
    result: 'Menção Honrosa',
    title: 'Unifor Design Awards',
    text: 'Projeto Fiarte entre os melhores trabalhos do semestre 2026.1 do curso de Design',
  },
  {
    result: 'Artigo aprovado',
    title: 'P&D Design 2026 | Recife',
    text: 'Materialidade, gesto e engajamento: desenho infantil em papel e no tablet',
  },
  {
    result: 'Artigo publicado',
    title: 'CIDI 2025 | Editora Blücher',
    text: 'Design da Informação na Modernização da Comunicação Educacional',
  },
]

/** Endereço do case, quando ele já tem página (o Fiarte ainda não tem: o link fica escondido). */
const caseUrl = (slug: string) => {
  const project = projects.find((p) => p.slug === slug)
  return project && hasCasePage(project) ? `/projetos/${slug}` : null
}

/** Acima desta largura as provas viram acordeão; abaixo, ficam empilhadas e abertas */
const ACCORDION_QUERY = '(min-width: 1196px)'

function scrollToElement(el: Element | null, block: ScrollLogicalPosition = 'start') {
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block })
}

/** P.03 — Sobre mim. Figma: “About me — v2”, node 389:21868. */
export function About() {
  const mainRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<Partial<Record<ProofId, HTMLElement | null>>>({})
  const [open, setOpen] = useState<ProofId>('escuta')
  const [accordion, setAccordion] = useState(() => window.matchMedia(ACCORDION_QUERY).matches)

  useScrollReveal(mainRef)

  useEffect(() => {
    const query = window.matchMedia(ACCORDION_QUERY)
    const onChange = () => setAccordion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const jumpTo = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToElement(document.getElementById(id))
  }

  const openProof = (id: ProofId) => {
    setOpen(id)
    scrollToElement(cardRefs.current[id] ?? null, 'center')
  }

  const linkedin = site.linkedinUrl

  return (
    <main id="conteudo" ref={mainRef} className={styles.main}>
      {/* 01 — Abertura */}
      <section className={styles.opening} aria-labelledby="sobre-titulo">
        <div className={styles.openingIntro}>
          <h1 id="sobre-titulo" className={styles.heroTitle}>
            Sobre mim
          </h1>
          <div className={styles.presentation}>
            <p className={styles.lead}>
              Sou Jorge Luiz, Product Designer no Vortex, laboratório de inovação da UNIFOR. Atuo da pesquisa ao
              handoff e uso IA para tirar o trabalho repetitivo do design. Gosto de problemas em que é preciso escutar
              antes de desenhar.
            </p>
            <ul className={styles.facts} aria-label="Fatos">
              <li className={`${styles.badge} ${styles.badgeRaised}`}>Fortaleza, CE</li>
              <li className={`${styles.badge} ${styles.badgeRaised}`}>Shortlist BDA 2026</li>
            </ul>
          </div>
        </div>

        <a href="#o-que-e-design" className={styles.jump} onClick={jumpTo('o-que-e-design')}>
          <span className={styles.jumpIcon}>
            <Icon name="keyboard-arrow-down" />
          </span>
          O que é design pra mim?
        </a>

        <div className={styles.portrait}>
          <span className={styles.orbit} style={{ '--orbit-src': `url("${orbit}")` } as React.CSSProperties} aria-hidden="true" />
          <span className={styles.orbitDot} aria-hidden="true" />
          <img className={styles.photo} src={photo} alt="Jorge Luiz sorrindo, de óculos, ao ar livre" width={494} height={494} />
        </div>
      </section>

      {/* 02 — O que é design pra mim */}
      <section
        id="o-que-e-design"
        className={`${styles.band} ${styles.manifesto}`}
        aria-labelledby="manifesto-titulo"
      >
        <div className={styles.inner}>
          <h2 id="manifesto-titulo" className={styles.sectionTitle} data-reveal="up">
            O que é design pra mim?
          </h2>
          <p className={styles.manifestoText} data-reveal="up">
            Design, pra mim, é abrir mão dos seus pré-conceitos sobre o mundo, a sociedade e as pessoas. É ser aberto
            ao desconhecido, é presença e, principalmente, <Word onClick={jumpTo('provas')}>vivência</Word>. O
            design é uma forma de fazer o mundo de maneira não igualitária, mas{' '}
            <Word onClick={jumpTo('provas')}>equitativa</Word> e com{' '}
            <Word onClick={jumpTo('provas')}>alteridade</Word>.
          </p>
          <div className={styles.failure} data-reveal="up">
            <p className={styles.failureLabel}>Quando o design falha</p>
            <p className={styles.failureSentence}>
              <span>Considero uma falha o design</span>{' '}
              {CHIP_ORDER.map((id) => {
                const proof = PROOFS.find((p) => p.id === id)!
                return (
                  <button
                    key={id}
                    type="button"
                    className={styles.chip}
                    onClick={() => openProof(id)}
                    aria-label={`${proof.chip.replace(/[,.]$/, '')}: ver ${proof.badge} em ${proof.project}`}
                  >
                    <span className={styles.chipText}>{proof.chip}</span>
                    <span className={styles.chipHover} aria-hidden="true">
                      {proof.badge} · {proof.project}
                    </span>
                  </button>
                )
              })}
            </p>
          </div>
        </div>
      </section>

      {/* 03 — Como isso aparece em meus trabalhos */}
      <section id="provas" className={`${styles.band} ${styles.surface}`} aria-labelledby="provas-titulo">
        <div className={styles.inner}>
          <h2 id="provas-titulo" className={styles.sectionTitle} data-reveal="up">
            Como isso aparece em meus trabalhos?
          </h2>
          <div className={styles.proofs} data-reveal="up">
            {PROOFS.map((proof) => (
              <ProofCard
                key={proof.id}
                proof={proof}
                open={!accordion || open === proof.id}
                collapsible={accordion}
                onOpen={() => setOpen(proof.id)}
                cardRef={(el) => {
                  cardRefs.current[proof.id] = el
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Trajetória */}
      <section className={styles.band} aria-labelledby="trajetoria-titulo">
        <div className={styles.inner}>
          <h2 id="trajetoria-titulo" className={styles.sectionTitle} data-reveal="up">
            Trajetória
          </h2>
          <ol className={styles.timeline}>
            {MILESTONES.map((m, i) => (
              <li key={m.place} className={`${styles.milestone} ${m.current ? styles.current : ''}`} data-reveal="up">
                <div className={styles.milestoneNumber}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  {m.current && <span className={styles.today}>Hoje</span>}
                </div>
                <div className={styles.rail} aria-hidden="true">
                  <span className={styles.railDot} />
                  <span className={styles.railLine} />
                </div>
                <div className={styles.milestoneText}>
                  <h3 className={styles.milestonePlace}>{m.place}</h3>
                  <p className={styles.milestoneRole}>{m.role}</p>
                  <p className={styles.milestoneDescription}>{m.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 — Reconhecimentos */}
      <section className={`${styles.band} ${styles.surface}`} aria-labelledby="reconhecimentos-titulo">
        <div className={styles.inner}>
          <h2 id="reconhecimentos-titulo" className={styles.sectionTitle} data-reveal="up">
            Reconhecimentos
          </h2>
          <div className={styles.awards}>
            <BdaCard />
            <ul className={styles.awardList}>
              {AWARDS.map((a) => (
                <li key={a.title} className={styles.award} data-reveal="up">
                  <p className={styles.awardResult}>{a.result}</p>
                  <div className={styles.awardText}>
                    <h3 className={styles.awardTitle}>{a.title}</h3>
                    <p className={styles.awardDescription}>{a.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 06 — O que estou buscando */}
      <section className={styles.next} aria-labelledby="proximo-titulo">
        <DecorativeBackground className={styles.nextBackground} />
        <h2 id="proximo-titulo" className={styles.nextLabel} data-reveal="up">
          Próximo capítulo
        </h2>
        <p className={styles.nextText} data-reveal="up">
          Quero levar IA, pesquisa e design systems para times de produto que precisam escutar antes de construir.
        </p>
        <div className={styles.nextActions} data-reveal="up">
          {site.cvUrl && (
            <a className={buttonClassName('primary', styles.nextButton)} href={site.cvUrl} target="_blank" rel="noopener noreferrer">
              <span className={buttonStyles.label}>Baixar currículo</span>
            </a>
          )}
          <a className={buttonClassName('secondary', styles.nextButton)} href={linkedin} target="_blank" rel="noopener noreferrer">
            <span className={buttonStyles.label}>LinkedIn</span>
          </a>
        </div>
      </section>
    </main>
  )
}

/** Palavra do manifesto que leva às provas (bloco 03) */
function Word({ children, onClick }: { children: string; onClick: (e: MouseEvent) => void }) {
  return (
    <a href="#provas" className={styles.word} onClick={onClick}>
      {children}
    </a>
  )
}

type ProofCardProps = {
  proof: Proof
  open: boolean
  collapsible: boolean
  onOpen: () => void
  cardRef: (el: HTMLElement | null) => void
}

/** Cartão do acordeão — aberto (texto + capa) ou fechado (resumo com seta). Figma: Card / Escuta etc. */
function ProofCard({ proof, open, collapsible, onOpen, cardRef }: ProofCardProps) {
  const url = caseUrl(proof.slug)
  const panelId = `prova-${proof.id}`

  return (
    <article ref={cardRef} className={`${styles.proof} ${open ? styles.proofOpen : ''}`} aria-labelledby={`${panelId}-titulo`}>
      <div id={panelId} className={styles.proofPanel} inert={!open}>
        <div className={styles.proofContent}>
          <div className={styles.proofIdea}>
            <span className={`${styles.badge} ${styles.badgeRaised}`}>{proof.badge}</span>
            <div className={styles.proofText}>
              <h3 id={`${panelId}-titulo`} className={styles.proofTitle}>
                {proof.title}
              </h3>
              <p className={styles.proofDescription}>{proof.text}</p>
            </div>
          </div>
          {url && (
            <Link to={url} className={styles.projectLink}>
              <span className={styles.smallIcon}>
                <Icon name="arrow-outward" />
              </span>
              Ver projeto {proof.project}
            </Link>
          )}
        </div>
        <div className={styles.proofCover}>
          <img src={proof.cover} alt="" loading="lazy" style={{ objectPosition: proof.coverPosition }} />
        </div>
      </div>

      {collapsible && (
        <button
          type="button"
          className={styles.proofSummary}
          onClick={onOpen}
          aria-expanded={open}
          aria-controls={panelId}
          inert={open}
        >
          <span className={styles.badge}>{proof.badge}</span>
          <span className={styles.summaryBottom}>
            <span className={styles.summaryText}>
              <span className={styles.summaryProject}>{proof.project}</span>
              <span className={styles.summaryTitle}>{proof.title}</span>
            </span>
            <span className={styles.smallIcon}>
              <Icon name="keyboard-arrow-right" />
            </span>
          </span>
        </button>
      )}
    </article>
  )
}

/** Destaque — Shortlist BDA (Figma 407:21308). Leva ao Fiarte quando o case tiver página. */
function BdaCard() {
  const url = caseUrl('fiarte')
  const content = (
    <>
      <img className={styles.bdaCover} src={bdaCover} alt="" loading="lazy" />
      <img className={styles.bdaSeal} src={bdaSeal} alt="Selo Shortlist do 16º Prêmio Brasileiro de Design" loading="lazy" />
      <div className={styles.bdaText}>
        <h3 className={styles.bdaTitle}>
          <span>Prêmio</span> Brasileiro de Design 2026
        </h3>
        <p className={styles.bdaCaption}>
          Fiarte, sistema de transmissão do artesanato cearense. Categoria Design de Impacto Social.
        </p>
      </div>
    </>
  )
  return url ? (
    <Link to={url} className={`${styles.bda} ${styles.bdaLink}`} data-reveal="mask">
      {content}
    </Link>
  ) : (
    <div className={styles.bda} data-reveal="mask">
      {content}
    </div>
  )
}
