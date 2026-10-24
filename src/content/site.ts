/**
 * What sets this certification apart from the other study sites built from the same code: its names, its
 * exam, the groups of its roadmap and the words of its home. Every other file of the site is shared.
 */
import type { Locale } from '../i18n/strings'

export const SITE = {
  /** Prefixes what the site keeps in the browser, which every site under the same domain shares. */
  id: 'saa',
  repository: 'aws-certified-solutions-architect-associate',
  exam: 'SAA-C03',
  level: 'Associate',
  /** The name of the certification as the home and the preview card draw it, the second part highlighted. */
  name: { lead: 'AWS Certified', highlight: 'Solutions Architect' },
  certification: {
    'en-US': 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    'pt-BR': 'https://aws.amazon.com/pt/certification/certified-solutions-architect-associate/',
  },
  /** The groups of the roadmap, in the order the home lists them. */
  groups: ['foundations', 'secure', 'resilient', 'performing', 'cost', 'resources'],
  /** The shape of the exam the practice exam copies: questions, minutes, passing score and domain weights. */
  practice: { questions: 65, scored: 50, minutes: 130, passing: 720, weights: [30, 26, 24, 20] },
} as const

export type TopicGroup = (typeof SITE.groups)[number]

export interface SiteText {
  readonly meta: { readonly title: string; readonly description: string }
  readonly brand: string
  readonly home: {
    readonly eyebrow: string
    readonly title: string
    readonly lede: string
    readonly groups: Readonly<Record<TopicGroup, { readonly title: string; readonly lede: string }>>
  }
  readonly searchPlaceholder: string
  /** The content domains of the exam guide, in its order. */
  readonly domains: readonly string[]
}

export const SITE_TEXT: Readonly<Record<Locale, SiteText>> = {
  'en-US': {
    meta: {
      title: 'AWS Solutions Architect Associate (SAA-C03) · Study notes',
      description:
        'Free study notes for the AWS Solutions Architect Associate (SAA-C03) exam: secure, resilient, high-performing and cost-optimized designs, with search and review.',
    },
    brand: 'Solutions Architect',
    home: {
      eyebrow: 'Associate · SAA-C03',
      title: 'AWS Certified Solutions Architect Associate',
      lede: 'A compilation of what I studied for the certification, organized by the four domains of the exam: secure, resilient, high-performing and cost-optimized architectures.',
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
    searchPlaceholder: 'E.g. Multi-AZ, NAT gateway, SQS',
    domains: [
      'Design Secure Architectures',
      'Design Resilient Architectures',
      'Design High-Performing Architectures',
      'Design Cost-Optimized Architectures',
    ],
  },
  'pt-BR': {
    meta: {
      title: 'AWS Solutions Architect Associate (SAA-C03) · Notas de estudo',
      description:
        'Notas de estudo gratuitas para o exame AWS Solutions Architect Associate (SAA-C03): segurança, resiliência, desempenho e custo, com busca e revisão.',
    },
    brand: 'Solutions Architect',
    home: {
      eyebrow: 'Associate · SAA-C03',
      title: 'AWS Certified Solutions Architect Associate',
      lede: 'Um compilado do conteúdo estudado para a certificação, organizado pelos quatro domínios do exame: arquiteturas seguras, resilientes, de alto desempenho e com custo otimizado.',
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
    searchPlaceholder: 'Ex.: Multi-AZ, NAT gateway, SQS',
    domains: [
      'Projetar arquiteturas seguras',
      'Projetar arquiteturas resilientes',
      'Projetar arquiteturas de alto desempenho',
      'Projetar arquiteturas otimizadas para custos',
    ],
  },
}
