import { en, pt } from '../links'
import type { Topic } from '../types'

const GUIDE = 'aws-certification/latest/solutions-architect-associate-03/'
const WA = 'wellarchitected/latest/'
const SKILL_BUILDER = 'https://skillbuilder.aws/category/exam-prep/solutions-architect-associate-SAA-C03'

export const enUS: readonly Topic[] = [
  {
    slug: 'resources',
    group: 'resources',
    icon: 'book',
    title: 'Resources',
    summary:
      'Official AWS material for SAA-C03: the exam guide, exam prep, Well-Architected whitepapers, documentation and FAQs.',
    lede: 'Official material that covers all four domains. Start with the exam guide, then use the whitepapers and FAQs to close the gaps your practice questions reveal.',
    sections: [
      {
        id: 'official',
        name: 'Exam and prep',
        link: en.aws('certification/certified-solutions-architect-associate/'),
        summary:
          'The exam page, the exam guide with its service lists, and the free and paid prep that AWS publishes on Skill Builder.',
        links: [
          { label: 'Certification page', href: en.aws('certification/certified-solutions-architect-associate/') },
          { label: 'Exam guide (SAA-C03)', href: en.docs(`${GUIDE}solutions-architect-associate-03.html`) },
          { label: 'In-scope services', href: en.docs(`${GUIDE}cert-03-in-scope-services.html`) },
          { label: 'Out-of-scope services', href: en.docs(`${GUIDE}cert-03-out-of-scope-services.html`) },
          { label: 'Exam prep plan on AWS Skill Builder', href: SKILL_BUILDER },
          { label: 'Exam preparation overview', href: en.aws('certification/certification-prep/') },
          {
            label: 'Service short names used on the exam',
            href: en.aws('certification/policies/general-information/'),
          },
          { label: 'Recertification', href: en.aws('certification/recertification/') },
        ],
        tip: 'The free **Official Practice Question Set** (20 questions) on Skill Builder shows the exact question style. Take it early to calibrate, and keep the full **Official Practice Exam** for the final week.',
      },
      {
        id: 'well-architected',
        name: 'Well-Architected',
        fullName: 'AWS Well-Architected Framework',
        link: en.aws('architecture/well-architected/'),
        summary:
          'The framework the exam validates designs against, plus one whitepaper per pillar with the detailed best practices.',
        links: [
          { label: 'AWS Well-Architected Framework', href: en.docs(`${WA}framework/welcome.html`) },
          { label: 'Security Pillar', href: en.docs(`${WA}security-pillar/welcome.html`) },
          { label: 'Reliability Pillar', href: en.docs(`${WA}reliability-pillar/welcome.html`) },
          { label: 'Performance Efficiency Pillar', href: en.docs(`${WA}performance-efficiency-pillar/welcome.html`) },
          { label: 'Cost Optimization Pillar', href: en.docs(`${WA}cost-optimization-pillar/welcome.html`) },
          { label: 'Operational Excellence Pillar', href: en.docs(`${WA}operational-excellence-pillar/welcome.html`) },
          { label: 'Sustainability Pillar', href: en.docs(`${WA}sustainability-pillar/sustainability-pillar.html`) },
          { label: 'AWS Well-Architected Tool', href: en.aws('well-architected-tool/') },
        ],
        tip: 'Read the **Security** and **Reliability** pillars first: together they match Domains 1 and 2, more than half of the scored content.',
      },
      {
        id: 'whitepapers',
        name: 'Whitepapers and guides',
        link: en.aws('whitepapers/'),
        summary:
          'Long-form AWS guidance on disaster recovery, the service catalog and reference architectures, useful for the scenario questions.',
        links: [
          {
            label: 'Disaster Recovery of Workloads on AWS',
            href: en.docs(
              'whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html',
            ),
          },
          {
            label: 'Overview of Amazon Web Services',
            href: en.docs('whitepapers/latest/aws-overview/introduction.html'),
          },
          { label: 'AWS Whitepapers and Guides', href: en.aws('whitepapers/') },
          { label: 'AWS Architecture Center', href: en.aws('architecture/') },
          { label: 'AWS Prescriptive Guidance', href: en.aws('prescriptive-guidance/') },
        ],
        tip: 'The DR whitepaper is the source of **backup and restore**, **pilot light**, **warm standby** and **multi-site active/active**. Know how RTO, RPO and cost move between them.',
      },
      {
        id: 'documentation',
        name: 'Documentation',
        link: en.docs(''),
        summary:
          'Entry points into the AWS documentation for the infrastructure and the services the exam leans on most.',
        links: [
          { label: 'AWS Documentation home', href: en.docs('') },
          {
            label: 'Regions and Availability Zones',
            href: en.docs('global-infrastructure/latest/regions/aws-regions-availability-zones.html'),
          },
          { label: 'AWS service quotas', href: en.docs('general/latest/gr/aws_service_limits.html') },
          { label: 'Amazon S3 User Guide', href: en.docs('AmazonS3/latest/userguide/Welcome.html') },
          { label: 'Amazon EC2 User Guide', href: en.docs('AWSEC2/latest/UserGuide/concepts.html') },
          { label: 'Amazon VPC User Guide', href: en.docs('vpc/latest/userguide/what-is-amazon-vpc.html') },
          { label: 'IAM User Guide', href: en.docs('IAM/latest/UserGuide/introduction.html') },
        ],
        tip: 'Use the documentation to confirm a limit or a behavior after a practice question surprises you. **Service quotas** matter on the exam, e.g. raising them in a standby Region before a failover.',
      },
      {
        id: 'faqs',
        name: 'FAQs',
        link: en.aws('s3/faqs/'),
        summary:
          'The service FAQs answer the comparison and limit questions that scenarios are built on, in short form.',
        links: [
          { label: 'Amazon S3 FAQs', href: en.aws('s3/faqs/') },
          { label: 'Amazon EC2 FAQs', href: en.aws('ec2/faqs/') },
          { label: 'Amazon EBS FAQs', href: en.aws('ebs/faqs/') },
          { label: 'Amazon EFS FAQs', href: en.aws('efs/faq/') },
          { label: 'Amazon VPC FAQs', href: en.aws('vpc/faqs/') },
          { label: 'Elastic Load Balancing FAQs', href: en.aws('elasticloadbalancing/faqs/') },
          { label: 'Amazon Route 53 FAQs', href: en.aws('route53/faqs/') },
          { label: 'Amazon CloudFront FAQs', href: en.aws('cloudfront/faqs/') },
          { label: 'Amazon RDS FAQs', href: en.aws('rds/faqs/') },
          { label: 'Amazon Aurora FAQs', href: en.docs('rds/latest/auroraextendedcontent/aurora-faq.html') },
          { label: 'Amazon DynamoDB FAQs', href: en.aws('dynamodb/faqs/') },
          { label: 'Amazon SQS FAQs', href: en.aws('sqs/faqs/') },
          { label: 'Amazon SNS FAQs', href: en.aws('sns/faqs/') },
          { label: 'AWS Lambda FAQs', href: en.aws('lambda/faqs/') },
          { label: 'IAM FAQs', href: en.aws('iam/faqs/') },
          { label: 'AWS KMS FAQs', href: en.aws('kms/faqs/') },
        ],
        tip: 'Prioritize **S3**, **EC2**, **VPC**, **RDS**, **DynamoDB** and **SQS**: they carry the storage classes, purchase options, networking, Multi-AZ versus read replicas, capacity modes and queue limits that the exam asks most.',
      },
      {
        id: 'previous-step',
        name: 'Previous step',
        fullName: 'AWS Certified Cloud Practitioner',
        summary:
          'The foundational certification that usually comes before this one, with study notes in the same format.',
        links: [
          {
            label: 'AWS Certified Cloud Practitioner (CLF-C02) study notes',
            href: 'https://gustavofreze.github.io/aws-certified-cloud-practitioner/',
          },
        ],
        tip: 'Cloud Practitioner covers what each service is. The Associate exam assumes that and asks which design best meets a requirement.',
      },
    ],
  },
]

export const ptBR: readonly Topic[] = [
  {
    slug: 'resources',
    group: 'resources',
    icon: 'book',
    title: 'Materiais',
    summary:
      'Material oficial da AWS para o SAA-C03: o guia do exame, preparação, whitepapers do Well-Architected, documentação e FAQs.',
    lede: 'Material oficial que cobre os quatro domínios. Comece pelo guia do exame e use os whitepapers e as FAQs para fechar as lacunas que as questões de prática revelarem.',
    sections: [
      {
        id: 'official',
        name: 'Exame e preparação',
        link: pt.aws('certification/certified-solutions-architect-associate/'),
        summary:
          'A página do exame, o guia com as listas de serviços e a preparação gratuita e paga que a AWS publica no Skill Builder.',
        links: [
          { label: 'Página da certificação', href: pt.aws('certification/certified-solutions-architect-associate/') },
          { label: 'Guia do exame (SAA-C03)', href: pt.docs(`${GUIDE}solutions-architect-associate-03.html`) },
          { label: 'Serviços dentro do escopo', href: pt.docs(`${GUIDE}cert-03-in-scope-services.html`) },
          { label: 'Serviços fora do escopo', href: pt.docs(`${GUIDE}cert-03-out-of-scope-services.html`) },
          { label: 'Plano de preparação no AWS Skill Builder', href: SKILL_BUILDER },
          { label: 'Visão geral da preparação para exames', href: pt.aws('certification/certification-prep/') },
          { label: 'Nomes curtos dos serviços no exame', href: pt.aws('certification/policies/general-information/') },
          { label: 'Recertificação', href: pt.aws('certification/recertification/') },
        ],
        tip: 'O **Official Practice Question Set** gratuito (20 questões) no Skill Builder mostra o estilo exato das questões. Faça cedo para calibrar e guarde o **Official Practice Exam** completo para a última semana.',
      },
      {
        id: 'well-architected',
        name: 'Well-Architected',
        fullName: 'AWS Well-Architected Framework',
        link: pt.aws('architecture/well-architected/'),
        summary:
          'O framework contra o qual o exame valida os projetos, mais um whitepaper por pilar com as boas práticas em detalhe.',
        links: [
          { label: 'AWS Well-Architected Framework', href: pt.docs(`${WA}framework/welcome.html`) },
          { label: 'Pilar Segurança', href: pt.docs(`${WA}security-pillar/welcome.html`) },
          { label: 'Pilar Confiabilidade', href: pt.docs(`${WA}reliability-pillar/welcome.html`) },
          {
            label: 'Pilar Eficiência de performance',
            href: pt.docs(`${WA}performance-efficiency-pillar/welcome.html`),
          },
          { label: 'Pilar Otimização de custos', href: pt.docs(`${WA}cost-optimization-pillar/welcome.html`) },
          { label: 'Pilar Excelência operacional', href: pt.docs(`${WA}operational-excellence-pillar/welcome.html`) },
          { label: 'Pilar Sustentabilidade', href: pt.docs(`${WA}sustainability-pillar/sustainability-pillar.html`) },
          { label: 'AWS Well-Architected Tool', href: pt.aws('well-architected-tool/') },
        ],
        tip: 'Leia primeiro os pilares de **Segurança** e **Confiabilidade**: juntos correspondem aos Domínios 1 e 2, mais da metade do conteúdo pontuado.',
      },
      {
        id: 'whitepapers',
        name: 'Whitepapers e guias',
        link: pt.aws('whitepapers/'),
        summary:
          'Orientações longas da AWS sobre recuperação de desastres, o catálogo de serviços e arquiteturas de referência, úteis para as questões de cenário.',
        links: [
          {
            label: 'Recuperação de desastres de cargas de trabalho na AWS',
            href: pt.docs(
              'whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html',
            ),
          },
          {
            label: 'Visão geral da Amazon Web Services',
            href: pt.docs('whitepapers/latest/aws-overview/introduction.html'),
          },
          { label: 'Whitepapers e guias da AWS', href: pt.aws('whitepapers/') },
          { label: 'AWS Architecture Center', href: pt.aws('architecture/') },
          { label: 'AWS Prescriptive Guidance', href: pt.aws('prescriptive-guidance/') },
        ],
        tip: 'O whitepaper de DR é a fonte de **backup and restore**, **pilot light**, **warm standby** e **multi-site active/active**. Saiba como RTO, RPO e custo mudam entre eles.',
      },
      {
        id: 'documentation',
        name: 'Documentação',
        link: pt.docs(''),
        summary:
          'Portas de entrada da documentação da AWS para a infraestrutura e para os serviços que o exame mais cobra.',
        links: [
          { label: 'Página inicial da documentação', href: pt.docs('') },
          {
            label: 'Regiões e Availability Zones',
            href: pt.docs('global-infrastructure/latest/regions/aws-regions-availability-zones.html'),
          },
          { label: 'Cotas de serviço da AWS', href: pt.docs('general/latest/gr/aws_service_limits.html') },
          { label: 'Guia do usuário do Amazon S3', href: pt.docs('AmazonS3/latest/userguide/Welcome.html') },
          { label: 'Guia do usuário do Amazon EC2', href: pt.docs('AWSEC2/latest/UserGuide/concepts.html') },
          { label: 'Guia do usuário da Amazon VPC', href: pt.docs('vpc/latest/userguide/what-is-amazon-vpc.html') },
          { label: 'Guia do usuário do IAM', href: pt.docs('IAM/latest/UserGuide/introduction.html') },
        ],
        tip: 'Use a documentação para confirmar um limite ou comportamento quando uma questão de prática surpreender. **Cotas de serviço** caem na prova, por exemplo aumentá-las na Região de standby antes de um failover.',
      },
      {
        id: 'faqs',
        name: 'FAQs',
        link: pt.aws('s3/faqs/'),
        summary:
          'As FAQs dos serviços respondem, de forma curta, às comparações e limites sobre os quais os cenários são montados.',
        links: [
          { label: 'FAQ do Amazon S3', href: pt.aws('s3/faqs/') },
          { label: 'FAQ do Amazon EC2', href: pt.aws('ec2/faqs/') },
          { label: 'FAQ do Amazon EBS', href: pt.aws('ebs/faqs/') },
          { label: 'FAQ do Amazon EFS', href: pt.aws('efs/faq/') },
          { label: 'FAQ da Amazon VPC', href: pt.aws('vpc/faqs/') },
          { label: 'FAQ do Elastic Load Balancing', href: pt.aws('elasticloadbalancing/faqs/') },
          { label: 'FAQ do Amazon Route 53', href: pt.aws('route53/faqs/') },
          { label: 'FAQ do Amazon CloudFront', href: pt.aws('cloudfront/faqs/') },
          { label: 'FAQ do Amazon RDS', href: pt.aws('rds/faqs/') },
          { label: 'FAQ do Amazon Aurora', href: pt.docs('rds/latest/auroraextendedcontent/aurora-faq.html') },
          { label: 'FAQ do Amazon DynamoDB', href: pt.aws('dynamodb/faqs/') },
          { label: 'FAQ do Amazon SQS', href: pt.aws('sqs/faqs/') },
          { label: 'FAQ do Amazon SNS', href: pt.aws('sns/faqs/') },
          { label: 'FAQ do AWS Lambda', href: pt.aws('lambda/faqs/') },
          { label: 'FAQ do IAM', href: pt.aws('iam/faqs/') },
          { label: 'FAQ do AWS KMS', href: pt.aws('kms/faqs/') },
        ],
        tip: 'Priorize **S3**, **EC2**, **VPC**, **RDS**, **DynamoDB** e **SQS**: ali estão classes de armazenamento, opções de compra, rede, Multi-AZ contra réplicas de leitura, modos de capacidade e limites de fila que o exame mais cobra.',
      },
      {
        id: 'previous-step',
        name: 'Etapa anterior',
        fullName: 'AWS Certified Cloud Practitioner',
        summary: 'A certificação de fundamentos que costuma vir antes desta, com notas de estudo no mesmo formato.',
        links: [
          {
            label: 'Notas de estudo do AWS Certified Cloud Practitioner (CLF-C02)',
            href: 'https://gustavofreze.github.io/aws-certified-cloud-practitioner/pt-br/',
          },
        ],
        tip: 'O Cloud Practitioner cobre o que cada serviço é. O exame Associate parte disso e pergunta qual arquitetura atende melhor a um requisito.',
      },
    ],
  },
]
