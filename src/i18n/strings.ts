/**
 * The words of the interface around the notes, in each language the site ships. The notes themselves
 * live in `content/`, and this table holds only the chrome: the bar, the controls, the home and the
 * labels of a topic page.
 */
import type { TopicGroup } from '../content/types'

export type Locale = 'pt-BR' | 'en-US'

/** The id of the main landmark, which the skip link jumps to. */
export const MAIN_ID = 'content'

export interface SiteCopy {
  readonly meta: { readonly title: string; readonly description: string; readonly ogLocale: string }
  readonly brand: string
  readonly skipLink: string
  readonly theme: { readonly label: string; readonly light: string; readonly dark: string }
  readonly localeSwitch: { readonly ariaLabel: string; readonly names: Readonly<Record<Locale, string>> }
  readonly nav: {
    readonly home: string
    readonly toTop: string
    readonly roadmap: string
    readonly breadcrumb: string
    readonly search: string
    readonly review: string
  }
  readonly home: {
    readonly eyebrow: string
    readonly title: string
    readonly lede: string
    readonly start: string
    readonly examGuide: string
    readonly groups: Readonly<Record<TopicGroup, { readonly title: string; readonly lede: string }>>
  }
  readonly topic: {
    readonly onThisPage: string
    readonly previous: string
    readonly next: string
    readonly officialPage: string
    readonly keyPoints: string
    readonly examTip: string
    readonly step: (index: number, total: number) => string
  }
  readonly search: {
    readonly title: string
    readonly lede: string
    readonly label: string
    readonly placeholder: string
    readonly idle: string
    readonly loading: string
    readonly empty: string
    readonly unavailable: string
    /** How many pages matched, with `{count}` standing for the number. */
    readonly count: string
  }
  readonly review: {
    readonly title: string
    readonly lede: string
    readonly question: string
    readonly reveal: string
    readonly openSection: string
    readonly known: string
    /** How far the review has gone, with `{known}` and `{total}` standing for the numbers. */
    readonly progress: string
    readonly hideKnown: string
    readonly reset: string
  }
  readonly footer: { readonly source: string }
  readonly notFound: { readonly title: string; readonly lede: string; readonly back: string }
}

const ptBR: SiteCopy = {
  meta: {
    title: 'AWS Solutions Architect Associate (SAA-C03) · Notas de estudo',
    description:
      'Notas de estudo gratuitas para o exame AWS Solutions Architect Associate (SAA-C03): segurança, resiliência, desempenho e custo, com busca e revisão.',
    ogLocale: 'pt_BR',
  },
  brand: 'Solutions Architect',
  skipLink: 'Pular para o conteúdo',
  theme: { label: 'Tema', light: 'Tema claro', dark: 'Tema escuro' },
  localeSwitch: {
    ariaLabel: 'Idioma',
    names: { 'pt-BR': 'Português (Brasil)', 'en-US': 'English (US)' },
  },
  nav: {
    home: 'Início',
    toTop: 'Voltar ao topo',
    roadmap: 'Roteiro',
    breadcrumb: 'Você está em',
    search: 'Buscar',
    review: 'Revisar',
  },
  home: {
    eyebrow: 'Associate · SAA-C03',
    title: 'AWS Certified Solutions Architect Associate',
    lede: 'Um compilado do conteúdo estudado para a certificação, organizado pelos quatro domínios do exame: arquiteturas seguras, resilientes, de alto desempenho e com custo otimizado.',
    start: 'Começar pelo roteiro',
    examGuide: 'Sobre a certificação',
    groups: {
      foundations: { title: 'Fundamentos', lede: 'Como é o exame e o framework que guia cada resposta.' },
      secure: { title: 'Arquiteturas seguras', lede: 'Domínio 1, 30% do exame: acesso, rede e proteção de dados.' },
      resilient: {
        title: 'Arquiteturas resilientes',
        lede: 'Domínio 2, 26% do exame: desacoplamento, alta disponibilidade e recuperação de desastres.',
      },
      performing: {
        title: 'Arquiteturas de alto desempenho',
        lede: 'Domínio 3, 24% do exame: armazenamento, computação, bancos de dados, rede e dados.',
      },
      cost: {
        title: 'Arquiteturas com custo otimizado',
        lede: 'Domínio 4, 20% do exame: compra de capacidade, armazenamento, rede e ferramentas de custo.',
      },
      resources: { title: 'Materiais', lede: 'O que usar para estudar e praticar.' },
    },
  },
  topic: {
    onThisPage: 'Nesta página',
    previous: 'Anterior',
    next: 'Próximo',
    officialPage: 'Página oficial',
    keyPoints: 'Pontos-chave',
    examTip: 'Na prova',
    step: (index, total) => `${String(index).padStart(2, '0')} de ${String(total).padStart(2, '0')}`,
  },
  search: {
    title: 'Buscar nas notas',
    lede: 'Procure um serviço, um conceito ou uma palavra-chave da prova.',
    label: 'Termo de busca',
    placeholder: 'Ex.: Multi-AZ, NAT gateway, SQS',
    idle: 'Digite pelo menos duas letras.',
    loading: 'Buscando...',
    empty: 'Nada encontrado. Tente outra palavra.',
    unavailable: 'A busca só funciona no site gerado pelo build.',
    count: 'Resultados: {count}',
  },
  review: {
    title: 'Revisão',
    lede: 'Leia a descrição, tente lembrar o serviço ou o conceito e abra o cartão para conferir.',
    question: 'Qual é?',
    reveal: 'Mostrar resposta',
    openSection: 'Ver a seção completa',
    known: 'Já sei',
    progress: '{known} de {total} cartões que você já sabe',
    hideKnown: 'Esconder os que já sei',
    reset: 'Recomeçar',
  },
  footer: { source: 'Código no GitHub' },
  notFound: {
    title: 'Página não encontrada',
    lede: 'O endereço não existe ou mudou de lugar.',
    back: 'Voltar ao início',
  },
}

const enUS: SiteCopy = {
  meta: {
    title: 'AWS Solutions Architect Associate (SAA-C03) · Study notes',
    description:
      'Free study notes for the AWS Solutions Architect Associate (SAA-C03) exam: secure, resilient, high-performing and cost-optimized designs, with search and review.',
    ogLocale: 'en_US',
  },
  brand: 'Solutions Architect',
  skipLink: 'Skip to content',
  theme: { label: 'Theme', light: 'Light theme', dark: 'Dark theme' },
  localeSwitch: {
    ariaLabel: 'Language',
    names: { 'pt-BR': 'Português (Brasil)', 'en-US': 'English (US)' },
  },
  nav: {
    home: 'Home',
    toTop: 'Back to top',
    roadmap: 'Roadmap',
    breadcrumb: 'You are here',
    search: 'Search',
    review: 'Review',
  },
  home: {
    eyebrow: 'Associate · SAA-C03',
    title: 'AWS Certified Solutions Architect Associate',
    lede: 'A compilation of what I studied for the certification, organized by the four domains of the exam: secure, resilient, high-performing and cost-optimized architectures.',
    start: 'Start the roadmap',
    examGuide: 'About the certification',
    groups: {
      foundations: { title: 'Foundations', lede: 'How the exam works and the framework behind every answer.' },
      secure: {
        title: 'Secure architectures',
        lede: 'Domain 1, 30% of the exam: access, network and data protection.',
      },
      resilient: {
        title: 'Resilient architectures',
        lede: 'Domain 2, 26% of the exam: decoupling, high availability and disaster recovery.',
      },
      performing: {
        title: 'High-performing architectures',
        lede: 'Domain 3, 24% of the exam: storage, compute, databases, networking and data.',
      },
      cost: {
        title: 'Cost-optimized architectures',
        lede: 'Domain 4, 20% of the exam: buying capacity, storage, networking and cost tools.',
      },
      resources: { title: 'Resources', lede: 'What to study and practice with.' },
    },
  },
  topic: {
    onThisPage: 'On this page',
    previous: 'Previous',
    next: 'Next',
    officialPage: 'Official page',
    keyPoints: 'Key points',
    examTip: 'On the exam',
    step: (index, total) => `${String(index).padStart(2, '0')} of ${String(total).padStart(2, '0')}`,
  },
  search: {
    title: 'Search the notes',
    lede: 'Look up a service, a concept or an exam keyword.',
    label: 'Search term',
    placeholder: 'E.g. Multi-AZ, NAT gateway, SQS',
    idle: 'Type at least two letters.',
    loading: 'Searching...',
    empty: 'Nothing found. Try another word.',
    unavailable: 'Search only works on the site produced by the build.',
    count: 'Results: {count}',
  },
  review: {
    title: 'Review',
    lede: 'Read the description, try to recall the service or concept, then open the card to check.',
    question: 'What is it?',
    reveal: 'Show answer',
    openSection: 'Open the full section',
    known: 'I know this',
    progress: '{known} of {total} cards you already know',
    hideKnown: 'Hide the ones I know',
    reset: 'Start over',
  },
  footer: { source: 'Source on GitHub' },
  notFound: {
    title: 'Page not found',
    lede: 'This address does not exist or has moved.',
    back: 'Back to home',
  },
}

const COPY: Readonly<Record<Locale, SiteCopy>> = { 'pt-BR': ptBR, 'en-US': enUS }

export function getCopy(locale: Locale): SiteCopy {
  return COPY[locale]
}
