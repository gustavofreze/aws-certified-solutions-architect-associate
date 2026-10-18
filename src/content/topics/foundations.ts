import { en, pt } from '../links'
import type { Topic } from '../types'

const GUIDE = 'aws-certification/latest/solutions-architect-associate-03/'

export const enUS: readonly Topic[] = [
  {
    slug: 'exam',
    group: 'foundations',
    icon: 'target',
    title: 'The exam',
    summary:
      'Format, scoring, the four domains and their weights, what is out of scope and how to read SAA-C03 questions.',
    lede: `The [SAA-C03 exam guide](${en.docs(`${GUIDE}solutions-architect-associate-03.html`)}) splits the scored content into four domains: **Secure** 30%, **Resilient** 26%, **High-Performing** 24% and **Cost-Optimized** 20%.`,
    sections: [
      {
        id: 'format',
        name: 'Format',
        fullName: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
        link: en.aws('certification/certified-solutions-architect-associate/'),
        summary:
          'An Associate level exam that validates the ability to design solutions based on the AWS Well-Architected Framework, secure, resilient, high-performing and cost-optimized.',
        points: [
          '**65 questions**: 50 scored and 15 unscored. The unscored ones are not identified, so treat every question as real.',
          '**Multiple choice**: 1 correct answer and 3 distractors. **Multiple response**: 2 or more correct answers among 5 or more options.',
          '**130 minutes**. An unanswered question counts as wrong and there is no penalty for guessing, so never leave a blank.',
          '**150 USD**, taken at a **Pearson VUE** test center or as an **online proctored** exam.',
          '**Languages**: English, French (France), Italian, Japanese, Korean, Portuguese (Brazil), Spanish (Latin America), Spanish (Spain), Simplified Chinese and Traditional Chinese. Italian is retired after December 31, 2026.',
          '**Extra time**: non-native English speakers can request a 30 minute extension once, and it applies to later registrations.',
        ],
        tip: 'Distractors are plausible answers that match the content area. Expect two options that both work, and pick the one that meets **every** requirement in the stem.',
      },
      {
        id: 'scoring',
        name: 'Scoring',
        link: en.aws('certification/policies/after-testing/'),
        summary:
          'The result is pass or fail, reported as a scaled score so that exam forms with slightly different difficulty are comparable.',
        points: [
          '**Scaled score** from 100 to 1000. The minimum passing score is **720**.',
          '**Compensatory model**: you do not need to pass each section, only the exam as a whole.',
          '**Section feedback**: the score report may classify your performance per domain. Read it as a general hint, not a precise grade.',
          '**Results** are posted to your AWS Certification Account within 5 business days.',
          '**Retake**: after a fail, wait 14 calendar days. There is no attempt limit, but every attempt pays the full fee.',
        ],
        tip: 'A weak domain does not fail you by itself. Domain 1 (30%) and Domain 2 (26%) together are more than half of the scored content, so they deserve the most study time.',
      },
      {
        id: 'domains',
        name: 'Domains',
        link: en.docs(`${GUIDE}solutions-architect-associate-03.html`),
        summary:
          'Four content domains, each split into task statements. The guide lists the knowledge and skills behind every task, which makes it the real syllabus.',
        points: [
          '**Domain 1, Design Secure Architectures (30%)**: secure access, secure workloads and data security controls.',
          '**Domain 2, Design Resilient Architectures (26%)**: loose coupling, scaling, high availability, fault tolerance and DR.',
          '**Domain 3, Design High-Performing Architectures (24%)**: storage, compute, database, network and data ingestion.',
          '**Domain 4, Design Cost-Optimized Architectures (20%)**: storage, compute, database and network cost.',
        ],
        tip: 'The domain names mirror four Well-Architected pillars. When a question says "most secure", "most resilient", "best performance" or "lowest cost", it is telling you which domain, and which trade-off, it is grading.',
        table: {
          title: 'Domains and task statements',
          head: ['Domain', 'Weight and tasks'],
          rows: [
            {
              key: 'Domain 1',
              cells: [
                '**Design Secure Architectures**, 30%',
                'Task 1.1: design secure access to AWS resources',
                'Task 1.2: design secure workloads and applications',
                'Task 1.3: determine appropriate data security controls',
              ],
            },
            {
              key: 'Domain 2',
              cells: [
                '**Design Resilient Architectures**, 26%',
                'Task 2.1: design scalable and loosely coupled architectures',
                'Task 2.2: design highly available and/or fault-tolerant architectures',
              ],
            },
            {
              key: 'Domain 3',
              cells: [
                '**Design High-Performing Architectures**, 24%',
                'Task 3.1: high-performing and/or scalable storage',
                'Task 3.2: high-performing and elastic compute',
                'Task 3.3: high-performing databases',
                'Task 3.4: high-performing and/or scalable networks',
                'Task 3.5: high-performing data ingestion and transformation',
              ],
            },
            {
              key: 'Domain 4',
              cells: [
                '**Design Cost-Optimized Architectures**, 20%',
                'Task 4.1: cost-optimized storage',
                'Task 4.2: cost-optimized compute',
                'Task 4.3: cost-optimized databases',
                'Task 4.4: cost-optimized network architectures',
              ],
            },
          ],
        },
      },
      {
        id: 'scope',
        name: 'Candidate and scope',
        link: en.docs(`${GUIDE}saa-03-in-scope-services.html`),
        summary:
          'The exam targets someone with at least 1 year of hands-on experience designing cloud solutions with AWS services. The guide publishes both an in-scope and an out-of-scope service list.',
        points: [
          '**Target candidate**: at least 1 year designing on AWS. Without IT experience, AWS suggests starting with Cloud Practitioner.',
          '**In scope**: analytics, application integration, cost management, compute, containers, databases, networking, security, serverless, storage, migration and a set of AI services such as Amazon Comprehend and Amazon Rekognition.',
          `**Out of scope** ([list](${en.docs(`${GUIDE}saa-03-out-of-scope-services.html`)})): Amazon Lightsail, AWS CDK, AWS CodeBuild, AWS CodeDeploy, AWS CodeCommit, all IoT services, Amazon GameLift, Amazon MWAA, AWS Cloud Map, Amazon Braket and AWS Ground Station, among others.`,
          '**Short names**: services with abbreviations appear in short form, e.g. Amazon SNS. The in-exam Help feature lists the full names.',
          '**No deep coding**: the exam is about design choices, not writing code, though basic programming familiarity helps.',
        ],
        tip: 'An option built on an out-of-scope service (Lightsail, CDK, CodeDeploy) is almost never the expected answer. Prefer the in-scope managed service that meets the requirement.',
      },
      {
        id: 'reading-questions',
        name: 'Reading questions',
        link: en.docs(`${GUIDE}solutions-architect-associate-03.html`),
        summary:
          'Most questions are scenarios with several technically valid answers. The qualifier in the last sentence decides which one is correct.',
        points: [
          '**"Least operational overhead"**: managed or serverless (Lambda, Fargate, DynamoDB, Aurora Serverless) beats anything you patch and scale on EC2.',
          '**"Most cost-effective"**: the cheapest option that still meets every stated requirement, e.g. Spot only when the work tolerates interruption.',
          '**"Highly available"**: spread across multiple Availability Zones. **"Fault tolerant"**: keeps working through a component failure with no interruption.',
          '**"Decouple"** or **"absorb spikes"**: a queue or event bus (Amazon SQS, Amazon SNS, Amazon EventBridge) between producer and consumer.',
          '**"Without changing the application"**: services that add reliability around legacy code, e.g. a load balancer with Auto Scaling or a Multi-AZ database.',
          '**Hard constraints** first: RPO and RTO, compliance, Region, latency. Discard every option that breaks one, then apply the qualifier.',
        ],
        tip: 'Read the last sentence first. "Most secure" and "least operational overhead" can point to different answers for the same scenario, and the distractor is usually the one that optimizes the wrong qualifier.',
      },
      {
        id: 'recertification',
        name: 'Validity',
        link: en.aws('certification/recertification/'),
        summary: 'The certification is valid for 3 years. Renewal requires an active certification.',
        points: [
          '**Retake** the current version of the exam: 3 more years of validity.',
          '**Pass the Professional**: AWS Certified Solutions Architect - Professional also renews the Associate.',
          '**Maintain on AWS Skill Builder**: needs a paid subscription and a certification within 90 days of expiration. It adds 1 year.',
          '**50% voucher**: available in your AWS Certification Account and usable on a future exam, including the recertification.',
        ],
        tip: 'Not an exam topic, but plan for it: a renewal exam started with the 50% voucher costs half of the 150 USD fee.',
      },
    ],
  },
  {
    slug: 'well-architected',
    group: 'foundations',
    icon: 'columns',
    title: 'Well-Architected and global infrastructure',
    summary:
      'The six Well-Architected pillars, Regions, AZs, edge and hybrid locations, and the shared responsibility model.',
    lede: `The exam validates designs against the [AWS Well-Architected Framework](${en.docs('wellarchitected/latest/framework/welcome.html')}), so this topic underpins all four domains. Global infrastructure and shared responsibility are named in Task 1.1 (**Domain 1**, 30%) and Task 2.2 (**Domain 2**, 26%).`,
    sections: [
      {
        id: 'framework',
        name: 'The framework',
        fullName: 'AWS Well-Architected Framework',
        link: en.docs('wellarchitected/latest/framework/the-pillars-of-the-framework.html'),
        summary:
          'A set of design principles, best practices and questions for building secure, reliable, efficient, cost-effective and sustainable workloads. A review is a conversation about trade-offs, not an audit.',
        points: [
          '**6 pillars**: operational excellence, security, reliability, performance efficiency, cost optimization and sustainability.',
          '**Each pillar** has design principles, best practices, questions and a dedicated whitepaper.',
          '**Trade-offs**: improving one pillar often costs another, e.g. a multi-Region active/active design raises reliability and cost together.',
          '**Lenses** extend the framework for specific workloads, such as serverless or SaaS.',
        ],
        tip: 'The four exam domains are four pillars. Operational excellence and sustainability have no domain of their own, but show up as qualifiers such as "least operational overhead".',
        table: {
          title: 'Pillars and exam domains',
          head: ['Pillar', 'Where it shows up'],
          rows: [
            { key: 'Security', cells: ['**Domain 1**, Design Secure Architectures (30%)'] },
            { key: 'Reliability', cells: ['**Domain 2**, Design Resilient Architectures (26%)'] },
            { key: 'Performance efficiency', cells: ['**Domain 3**, Design High-Performing Architectures (24%)'] },
            { key: 'Cost optimization', cells: ['**Domain 4**, Design Cost-Optimized Architectures (20%)'] },
            {
              key: 'Operational excellence',
              cells: [
                'No domain of its own. Appears as "least operational overhead", automation and managed services.',
              ],
            },
            {
              key: 'Sustainability',
              cells: ['No domain of its own. Overlaps with rightsizing, high utilization and managed services.'],
            },
          ],
        },
      },
      {
        id: 'security-reliability',
        name: 'Security and reliability',
        link: en.docs('wellarchitected/latest/framework/sec-design.html'),
        summary:
          'The design principles behind Domains 1 and 2. Most correct answers in those domains apply one of them.',
        points: [
          '**Strong identity foundation**: least privilege, separation of duties, centralized identity and no long-term static credentials.',
          '**Security at all layers** and **traceability**: defense in depth from the edge to the code, with every action logged and alarmed.',
          '**Protect data in transit and at rest** and **keep people away from data**: encryption, tokenization and automation instead of manual access.',
          `**Reliability** ([principles](${en.docs('wellarchitected/latest/framework/rel-dp.html')})): automatically recover from failure, test recovery procedures, scale horizontally, stop guessing capacity, manage change through automation.`,
          '**Scale horizontally**: replace one large resource with several small ones so a single failure has less impact.',
        ],
        tip: 'Long-lived access keys on an instance lose to an **IAM role**. A single large instance loses to an **Auto Scaling group across AZs**. Both are these principles in answer form.',
      },
      {
        id: 'performance-cost',
        name: 'Performance and cost',
        link: en.docs('wellarchitected/latest/framework/perf-dp.html'),
        summary:
          'The design principles behind Domains 3 and 4: consume technology as a service, match it to the access pattern and pay only for what delivers value.',
        points: [
          '**Democratize advanced technologies**: consume NoSQL, transcoding or ML as managed services instead of running them yourself.',
          '**Go global in minutes**, **use serverless architectures**, **experiment more often**.',
          '**Mechanical sympathy**: choose the database or storage by data access pattern, not by habit.',
          `**Cost** ([principles](${en.docs('wellarchitected/latest/framework/cost-dp.html')})): Cloud Financial Management, consumption model, measure overall efficiency, stop undifferentiated heavy lifting, analyze and attribute expenditure.`,
          '**Consumption model**: stopping dev and test resources outside a 40 hour work week saves about 75% (40 versus 168 hours).',
        ],
        tip: '"Key-value lookups at any scale" is **mechanical sympathy** pointing to DynamoDB, not a bigger relational instance. "Environments idle at night" is the **consumption model**: schedule them off.',
      },
      {
        id: 'operations-sustainability',
        name: 'Operations and sustainability',
        link: en.docs('wellarchitected/latest/framework/oe-design-principles.html'),
        summary:
          'The two pillars without their own domain. They still decide many answers through automation, managed services and utilization.',
        points: [
          '**Operational excellence**: organize teams around business outcomes, implement observability, safely automate, make frequent small reversible changes.',
          '**Also**: refine procedures often, anticipate failure, learn from all operational events and use managed services.',
          `**Sustainability** ([principles](${en.docs('wellarchitected/latest/framework/sus-design-principles.html')})): understand your impact, set goals, maximize utilization, adopt more efficient hardware and software, use managed services, reduce downstream impact.`,
          '**Maximize utilization**: 2 hosts at 30% are less efficient than 1 host at 60%, because each host has baseline power draw.',
        ],
        tip: 'Infrastructure as code with small, reversible deployments is the operational excellence answer. Rightsizing and S3 Lifecycle to colder tiers serve both sustainability and cost.',
      },
      {
        id: 'regions-azs',
        name: 'Regions and AZs',
        link: en.docs('global-infrastructure/latest/regions/aws-regions-availability-zones.html'),
        summary:
          'A Region is a separate geographic area, isolated from the others. Each Region has at least 3 Availability Zones, each made of one or more discrete data centers.',
        points: [
          '**Region choice**: compliance and data residency, latency to users, service availability and price.',
          '**No automatic copy**: some resources can be replicated across Regions, but AWS never does it for you.',
          '**AZs** have redundant power, networking and connectivity, sit many kilometers apart but within 100 km (60 miles), and are linked by low-latency networking that supports synchronous replication.',
          '**Opt-in Regions**: Regions launched after March 20, 2019 must be enabled before use.',
          '**AZ ID** (e.g. `use1-az1`) is the same physical zone in every account. In the oldest Regions, the AZ name (e.g. `us-east-1a`) may map to different zones in accounts created before November 2025.',
        ],
        tip: '"Survive the loss of a data center" means **multi-AZ**. "Survive the loss of a Region" or "regulator requires another geography" means **multi-Region**, which costs more. To align zones across accounts, use the **AZ ID**.',
      },
      {
        id: 'edge-hybrid',
        name: 'Edge and hybrid',
        link: en.aws('about-aws/global-infrastructure/'),
        summary:
          'Infrastructure outside the Region core: edge locations for content and traffic, and zones or racks that bring AWS closer to users or into your data center.',
        points: [
          `**Edge locations**: CloudFront points of presence cache content close to viewers. **Regional edge caches** sit between them and the origin and keep less popular objects longer ([how it works](${en.docs('AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html')})).`,
          '**AWS Global Accelerator**: 2 static anycast IPv4 addresses for TCP or UDP that bring traffic onto the AWS global network at the nearest edge, with health-based failover across Regions.',
          `**Local Zones**: an extension of a Region in a metro area. Enable it, create a subnet there and run latency-sensitive workloads or meet local data residency ([guide](${en.docs('local-zones/latest/ug/what-is-aws-local-zones.html')})).`,
          `**Wavelength Zones**: AWS compute and storage inside the 5G networks of telecom carriers, reached through a **carrier gateway** ([guide](${en.docs('wavelength/latest/developerguide/what-is-wavelength.html')})).`,
          `**AWS Outposts**: AWS-managed racks (42U) or servers (1U or 2U) on your premises, an extension of an AZ and its Region for low latency, local processing and data residency ([guide](${en.docs('outposts/latest/userguide/what-is-outposts.html')})).`,
        ],
        tip: '"Single-digit millisecond latency to an on-premises system" or "data must stay in our facility" is **Outposts**. "Users in a metro without a Region" is **Local Zones**. "5G mobile devices" is **Wavelength**. "Static IP and TCP/UDP acceleration" is **Global Accelerator**, not CloudFront.',
      },
      {
        id: 'shared-responsibility',
        name: 'Shared responsibility',
        link: en.aws('compliance/shared-responsibility-model/'),
        summary:
          'AWS is responsible for security **of** the cloud, the customer for security **in** the cloud. How much stays with you depends on how abstracted the service is.',
        points: [
          '**AWS**: hardware, software, networking and facilities that run AWS services.',
          '**IaaS (EC2)**: the customer does all security configuration and management of the guest OS, applications, security groups and data.',
          '**Abstracted services (S3, DynamoDB)**: AWS runs the infrastructure, OS and platform. You manage data, encryption options and IAM permissions.',
          '**Shared controls**: patch management, configuration management, awareness and training, each party at its own layer.',
          '**Inherited controls**: physical and environmental controls come fully from AWS.',
        ],
        tip: 'At Associate level the question becomes design: moving from EC2 to a managed service is how you **shift** patching and OS hardening to AWS. Encrypting data and scoping IAM permissions always stay with you.',
      },
      {
        id: 'wa-tool',
        name: 'Well-Architected Tool',
        fullName: 'AWS Well-Architected Tool',
        link: en.aws('well-architected-tool/'),
        summary:
          'A console service, at no additional charge, for reviewing a workload against the framework, recording decisions and tracking improvements.',
        points: [
          '**Workload review**: answer the pillar questions and get identified risks, high and medium (HRIs and MRIs), plus an **improvement plan**.',
          `**Lenses** ([guide](${en.docs('wellarchitected/latest/userguide/lenses.html')})): the Well-Architected Framework Lens is applied automatically. Add **Lens Catalog** lenses from AWS or your own **custom lenses**.`,
          '**Milestones**: record the state of a workload at a point in time to measure progress.',
          '**Integrations**: AWS Trusted Advisor and AWS Service Catalog AppRegistry help answer review questions.',
        ],
        tip: '"Review a workload against AWS best practices and track remediation over time" is the **Well-Architected Tool**. Trusted Advisor checks the account for specific issues, it does not run the architecture review.',
      },
    ],
  },
]

export const ptBR: readonly Topic[] = [
  {
    slug: 'exam',
    group: 'foundations',
    icon: 'target',
    title: 'O exame',
    summary:
      'Formato, pontuação, os quatro domínios e seus pesos, o que fica fora do escopo e como ler as questões do SAA-C03.',
    lede: `O [guia do exame SAA-C03](${pt.docs(`${GUIDE}solutions-architect-associate-03.html`)}) divide o conteúdo pontuado em quatro domínios: **seguras** 30%, **resilientes** 26%, **alto desempenho** 24% e **custo otimizado** 20%.`,
    sections: [
      {
        id: 'format',
        name: 'Formato',
        fullName: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
        link: pt.aws('certification/certified-solutions-architect-associate/'),
        summary:
          'Exame de nível Associate que valida a capacidade de projetar soluções com base no AWS Well-Architected Framework: seguras, resilientes, de alto desempenho e com custo otimizado.',
        points: [
          '**65 questões**: 50 pontuadas e 15 não pontuadas. As não pontuadas não são identificadas, então trate todas como valendo.',
          '**Múltipla escolha**: 1 resposta correta e 3 distratores. **Múltipla resposta**: 2 ou mais corretas entre 5 ou mais opções.',
          '**130 minutos**. Questão em branco conta como errada e chutar não tem penalidade, então nunca deixe nada sem resposta.',
          '**150 USD**, feito em centro de testes **Pearson VUE** ou **online com supervisão**.',
          '**Idiomas**: inglês, francês (França), italiano, japonês, coreano, português (Brasil), espanhol (América Latina), espanhol (Espanha), chinês simplificado e chinês tradicional. O italiano sai após 31 de dezembro de 2026.',
          '**Tempo extra**: quem não tem inglês como língua nativa pode pedir 30 minutos a mais uma única vez, e o pedido vale para as próximas inscrições.',
        ],
        tip: 'Os distratores são respostas plausíveis da mesma área. Espere duas opções que funcionam e escolha a que atende **todos** os requisitos do enunciado.',
      },
      {
        id: 'scoring',
        name: 'Pontuação',
        link: pt.aws('certification/policies/after-testing/'),
        summary:
          'O resultado é aprovado ou reprovado, informado como pontuação escalonada para que versões do exame com dificuldade um pouco diferente sejam comparáveis.',
        points: [
          '**Pontuação escalonada** de 100 a 1000. A nota mínima para aprovação é **720**.',
          '**Modelo compensatório**: não é preciso passar em cada seção, só no exame como um todo.',
          '**Feedback por seção**: o relatório pode classificar seu desempenho por domínio. Use como indicação geral, não como nota precisa.',
          '**Resultado** publicado na sua AWS Certification Account em até 5 dias úteis.',
          '**Nova tentativa**: depois de reprovar, espere 14 dias corridos. Não há limite de tentativas, mas cada uma paga a taxa cheia.',
        ],
        tip: 'Um domínio fraco não reprova sozinho. Os Domínios 1 (30%) e 2 (26%) somam mais da metade do conteúdo pontuado e merecem a maior parte do estudo.',
      },
      {
        id: 'domains',
        name: 'Domínios',
        link: pt.docs(`${GUIDE}solutions-architect-associate-03.html`),
        summary:
          'Quatro domínios de conteúdo, cada um dividido em tarefas. O guia lista o conhecimento e as habilidades de cada tarefa, e por isso é o programa de verdade.',
        points: [
          '**Domínio 1, Criação de arquiteturas seguras (30%)**: acesso seguro, cargas de trabalho seguras e controles de segurança de dados.',
          '**Domínio 2, Criação de arquiteturas resilientes (26%)**: baixo acoplamento, escalabilidade, alta disponibilidade, tolerância a falhas e DR.',
          '**Domínio 3, Criação de arquiteturas de alto desempenho (24%)**: armazenamento, computação, banco de dados, rede e ingestão de dados.',
          '**Domínio 4, Criação de arquiteturas com custo otimizado (20%)**: custo de armazenamento, computação, banco de dados e rede.',
        ],
        tip: 'Os nomes dos domínios espelham quatro pilares do Well-Architected. Quando a questão pede "mais seguro", "mais resiliente", "melhor desempenho" ou "menor custo", ela está dizendo qual domínio, e qual trade-off, está avaliando.',
        table: {
          title: 'Domínios e tarefas',
          head: ['Domínio', 'Peso e tarefas'],
          rows: [
            {
              key: 'Domínio 1',
              cells: [
                '**Criação de arquiteturas seguras**, 30%',
                'Tarefa 1.1: projetar acesso seguro aos recursos da AWS',
                'Tarefa 1.2: projetar cargas de trabalho e aplicações seguras',
                'Tarefa 1.3: definir controles de segurança de dados adequados',
              ],
            },
            {
              key: 'Domínio 2',
              cells: [
                '**Criação de arquiteturas resilientes**, 26%',
                'Tarefa 2.1: projetar arquiteturas escaláveis e com baixo acoplamento',
                'Tarefa 2.2: projetar arquiteturas altamente disponíveis e/ou tolerantes a falhas',
              ],
            },
            {
              key: 'Domínio 3',
              cells: [
                '**Criação de arquiteturas de alto desempenho**, 24%',
                'Tarefa 3.1: armazenamento de alto desempenho e/ou escalável',
                'Tarefa 3.2: computação de alto desempenho e elástica',
                'Tarefa 3.3: bancos de dados de alto desempenho',
                'Tarefa 3.4: redes de alto desempenho e/ou escaláveis',
                'Tarefa 3.5: ingestão e transformação de dados de alto desempenho',
              ],
            },
            {
              key: 'Domínio 4',
              cells: [
                '**Criação de arquiteturas com custo otimizado**, 20%',
                'Tarefa 4.1: armazenamento com custo otimizado',
                'Tarefa 4.2: computação com custo otimizado',
                'Tarefa 4.3: bancos de dados com custo otimizado',
                'Tarefa 4.4: arquiteturas de rede com custo otimizado',
              ],
            },
          ],
        },
      },
      {
        id: 'scope',
        name: 'Candidato e escopo',
        link: pt.docs(`${GUIDE}saa-03-in-scope-services.html`),
        summary:
          'O exame mira quem tem pelo menos 1 ano de experiência prática projetando soluções com serviços da AWS. O guia publica uma lista de serviços dentro e outra fora do escopo.',
        points: [
          '**Candidato**: pelo menos 1 ano projetando na AWS. Sem experiência em TI, a AWS sugere começar pelo Cloud Practitioner.',
          '**Dentro do escopo**: análise de dados, integração de aplicações, gestão de custos, computação, contêineres, bancos de dados, rede, segurança, serverless, armazenamento, migração e alguns serviços de IA como Amazon Comprehend e Amazon Rekognition.',
          `**Fora do escopo** ([lista](${pt.docs(`${GUIDE}saa-03-out-of-scope-services.html`)})): Amazon Lightsail, AWS CDK, AWS CodeBuild, AWS CodeDeploy, AWS CodeCommit, todos os serviços de IoT, Amazon GameLift, Amazon MWAA, AWS Cloud Map, Amazon Braket e AWS Ground Station, entre outros.`,
          '**Nomes curtos**: serviços com siglas aparecem na forma curta, por exemplo Amazon SNS. A ajuda dentro do exame lista os nomes completos.',
          '**Sem código a fundo**: o exame cobra decisões de design, não escrever código, embora noções de programação ajudem.',
        ],
        tip: 'Uma opção baseada em serviço fora do escopo (Lightsail, CDK, CodeDeploy) quase nunca é a resposta esperada. Prefira o serviço gerenciado do escopo que atende o requisito.',
      },
      {
        id: 'reading-questions',
        name: 'Lendo as questões',
        link: pt.docs(`${GUIDE}solutions-architect-associate-03.html`),
        summary:
          'A maioria das questões é um cenário com várias respostas tecnicamente válidas. O qualificador da última frase decide qual é a correta.',
        points: [
          '**"Least operational overhead"** (menor esforço operacional): gerenciado ou serverless (Lambda, Fargate, DynamoDB, Aurora Serverless) ganha de tudo que você corrige e escala no EC2.',
          '**"Most cost-effective"** (mais econômico): a opção mais barata que ainda atende todos os requisitos, por exemplo Spot só quando o trabalho tolera interrupção.',
          '**"Highly available"**: distribuir em várias Availability Zones. **"Fault tolerant"**: continua funcionando quando um componente falha, sem interrupção.',
          '**"Decouple"** ou **"absorver picos"**: uma fila ou barramento de eventos (Amazon SQS, Amazon SNS, Amazon EventBridge) entre produtor e consumidor.',
          '**"Sem alterar a aplicação"**: serviços que dão confiabilidade em volta do código legado, como um load balancer com Auto Scaling ou um banco Multi-AZ.',
          '**Restrições rígidas** primeiro: RPO e RTO, compliance, Região, latência. Descarte toda opção que quebra uma delas e só então aplique o qualificador.',
        ],
        tip: 'Leia a última frase primeiro. "Mais seguro" e "menor esforço operacional" podem levar a respostas diferentes no mesmo cenário, e o distrator costuma otimizar o qualificador errado.',
      },
      {
        id: 'recertification',
        name: 'Validade',
        link: pt.aws('certification/recertification/'),
        summary: 'A certificação vale por 3 anos. Para renovar, ela precisa estar ativa.',
        points: [
          '**Refazer** a versão atual do exame: mais 3 anos de validade.',
          '**Passar no Professional**: o AWS Certified Solutions Architect - Professional também renova o Associate.',
          '**Manter pelo AWS Skill Builder**: exige assinatura paga e certificação a até 90 dias do vencimento. Acrescenta 1 ano.',
          '**Voucher de 50%**: fica na sua AWS Certification Account e vale para um exame futuro, inclusive a recertificação.',
        ],
        tip: 'Não cai na prova, mas planeje: com o voucher de 50%, o exame de renovação custa metade da taxa de 150 USD.',
      },
    ],
  },
  {
    slug: 'well-architected',
    group: 'foundations',
    icon: 'columns',
    title: 'Well-Architected e infraestrutura global',
    summary:
      'Os seis pilares do Well-Architected, Regiões, AZs, locais de borda e híbridos, e o modelo de responsabilidade compartilhada.',
    lede: `O exame valida projetos contra o [AWS Well-Architected Framework](${pt.docs('wellarchitected/latest/framework/welcome.html')}), então este tema sustenta os quatro domínios. Infraestrutura global e responsabilidade compartilhada aparecem na Tarefa 1.1 (**Domínio 1**, 30%) e na Tarefa 2.2 (**Domínio 2**, 26%).`,
    sections: [
      {
        id: 'framework',
        name: 'O framework',
        fullName: 'AWS Well-Architected Framework',
        link: pt.docs('wellarchitected/latest/framework/the-pillars-of-the-framework.html'),
        summary:
          'Um conjunto de princípios de design, boas práticas e perguntas para construir cargas seguras, confiáveis, eficientes, econômicas e sustentáveis. A revisão é uma conversa sobre trade-offs, não uma auditoria.',
        points: [
          '**6 pilares**: excelência operacional, segurança, confiabilidade, eficiência de performance, otimização de custos e sustentabilidade.',
          '**Cada pilar** tem princípios de design, boas práticas, perguntas e um whitepaper próprio.',
          '**Trade-offs**: melhorar um pilar costuma custar outro, por exemplo um desenho multi-Região ativo/ativo aumenta confiabilidade e custo juntos.',
          '**Lentes** estendem o framework para cargas específicas, como serverless ou SaaS.',
        ],
        tip: 'Os quatro domínios do exame são quatro pilares. Excelência operacional e sustentabilidade não têm domínio próprio, mas aparecem como qualificadores, por exemplo "least operational overhead".',
        table: {
          title: 'Pilares e domínios do exame',
          head: ['Pilar', 'Onde aparece'],
          rows: [
            { key: 'Segurança', cells: ['**Domínio 1**, Criação de arquiteturas seguras (30%)'] },
            { key: 'Confiabilidade', cells: ['**Domínio 2**, Criação de arquiteturas resilientes (26%)'] },
            {
              key: 'Eficiência de performance',
              cells: ['**Domínio 3**, Criação de arquiteturas de alto desempenho (24%)'],
            },
            {
              key: 'Otimização de custos',
              cells: ['**Domínio 4**, Criação de arquiteturas com custo otimizado (20%)'],
            },
            {
              key: 'Excelência operacional',
              cells: [
                'Sem domínio próprio. Aparece como "least operational overhead", automação e serviços gerenciados.',
              ],
            },
            {
              key: 'Sustentabilidade',
              cells: ['Sem domínio próprio. Se sobrepõe a rightsizing, alta utilização e serviços gerenciados.'],
            },
          ],
        },
      },
      {
        id: 'security-reliability',
        name: 'Segurança e confiabilidade',
        link: pt.docs('wellarchitected/latest/framework/sec-design.html'),
        summary:
          'Os princípios de design por trás dos Domínios 1 e 2. A maioria das respostas certas nesses domínios aplica um deles.',
        points: [
          '**Base de identidade forte**: menor privilégio, separação de funções, identidade centralizada e nada de credenciais estáticas de longo prazo.',
          '**Segurança em todas as camadas** e **rastreabilidade**: defesa em profundidade da borda até o código, com toda ação registrada e com alarme.',
          '**Proteger dados em trânsito e em repouso** e **manter pessoas longe dos dados**: criptografia, tokenização e automação no lugar de acesso manual.',
          `**Confiabilidade** ([princípios](${pt.docs('wellarchitected/latest/framework/rel-dp.html')})): recuperar automaticamente de falhas, testar a recuperação, escalar horizontalmente, parar de adivinhar capacidade, gerenciar mudanças com automação.`,
          '**Escalar horizontalmente**: trocar um recurso grande por vários pequenos para que uma falha isolada tenha menos impacto.',
        ],
        tip: 'Chaves de acesso de longo prazo numa instância perdem para uma **IAM role**. Uma instância grande sozinha perde para um **Auto Scaling group em várias AZs**. As duas são esses princípios em forma de resposta.',
      },
      {
        id: 'performance-cost',
        name: 'Performance e custo',
        link: pt.docs('wellarchitected/latest/framework/perf-dp.html'),
        summary:
          'Os princípios de design por trás dos Domínios 3 e 4: consumir tecnologia como serviço, casar com o padrão de acesso e pagar só pelo que gera valor.',
        points: [
          '**Democratizar tecnologias avançadas**: consumir NoSQL, transcodificação ou ML como serviços gerenciados em vez de operá-los.',
          '**Ficar global em minutos**, **usar arquiteturas serverless**, **experimentar com mais frequência**.',
          '**Simpatia mecânica**: escolher o banco ou o armazenamento pelo padrão de acesso aos dados, não por costume.',
          `**Custo** ([princípios](${pt.docs('wellarchitected/latest/framework/cost-dp.html')})): Cloud Financial Management, modelo de consumo, medir a eficiência geral, parar de gastar com trabalho pesado indiferenciado, analisar e atribuir gastos.`,
          '**Modelo de consumo**: desligar ambientes de dev e teste fora de uma semana de 40 horas economiza cerca de 75% (40 contra 168 horas).',
        ],
        tip: '"Consultas chave-valor em qualquer escala" é **simpatia mecânica** apontando para DynamoDB, não uma instância relacional maior. "Ambientes ociosos à noite" é o **modelo de consumo**: agende o desligamento.',
      },
      {
        id: 'operations-sustainability',
        name: 'Operações e sustentabilidade',
        link: pt.docs('wellarchitected/latest/framework/oe-design-principles.html'),
        summary:
          'Os dois pilares sem domínio próprio. Mesmo assim decidem muitas respostas por meio de automação, serviços gerenciados e utilização.',
        points: [
          '**Excelência operacional**: organizar times em torno de resultados de negócio, ter observabilidade, automatizar com segurança, fazer mudanças pequenas, frequentes e reversíveis.',
          '**Também**: refinar procedimentos com frequência, antecipar falhas, aprender com todos os eventos operacionais e usar serviços gerenciados.',
          `**Sustentabilidade** ([princípios](${pt.docs('wellarchitected/latest/framework/sus-design-principles.html')})): entender o impacto, definir metas, maximizar a utilização, adotar hardware e software mais eficientes, usar serviços gerenciados, reduzir o impacto downstream das cargas.`,
          '**Maximizar a utilização**: 2 hosts a 30% são menos eficientes que 1 host a 60%, porque cada host tem um consumo de energia de base.',
        ],
        tip: 'Infraestrutura como código com deploys pequenos e reversíveis é a resposta de excelência operacional. Rightsizing e S3 Lifecycle para classes mais frias servem tanto a sustentabilidade quanto o custo.',
      },
      {
        id: 'regions-azs',
        name: 'Regiões e AZs',
        link: pt.docs('global-infrastructure/latest/regions/aws-regions-availability-zones.html'),
        summary:
          'Uma Região é uma área geográfica separada e isolada das outras. Cada Região tem pelo menos 3 Availability Zones, cada uma com um ou mais data centers distintos.',
        points: [
          '**Escolha da Região**: compliance e residência de dados, latência para os usuários, disponibilidade do serviço e preço.',
          '**Sem cópia automática**: alguns recursos podem ser replicados entre Regiões, mas a AWS nunca faz isso por você.',
          '**AZs** têm energia, rede e conectividade redundantes, ficam a muitos quilômetros umas das outras mas dentro de 100 km (60 milhas), ligadas por rede de baixa latência que suporta replicação síncrona.',
          '**Regiões opt-in**: Regiões lançadas depois de 20 de março de 2019 precisam ser habilitadas antes do uso.',
          '**AZ ID** (ex.: `use1-az1`) é a mesma zona física em qualquer conta. Nas Regiões mais antigas, o nome da AZ (ex.: `us-east-1a`) pode apontar para zonas diferentes em contas criadas antes de novembro de 2025.',
        ],
        tip: '"Sobreviver à perda de um data center" é **multi-AZ**. "Sobreviver à perda de uma Região" ou "o regulador exige outra geografia" é **multi-Região**, que custa mais. Para alinhar zonas entre contas, use o **AZ ID**.',
      },
      {
        id: 'edge-hybrid',
        name: 'Borda e híbrido',
        link: pt.aws('about-aws/global-infrastructure/'),
        summary:
          'Infraestrutura fora do núcleo da Região: locais de borda para conteúdo e tráfego, e zonas ou racks que levam a AWS para perto dos usuários ou para dentro do seu data center.',
        points: [
          `**Edge locations**: os pontos de presença do CloudFront guardam conteúdo perto de quem acessa. Os **regional edge caches** ficam entre eles e a origem e mantêm por mais tempo objetos menos populares ([como funciona](${pt.docs('AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html')})).`,
          '**AWS Global Accelerator**: 2 endereços IPv4 anycast estáticos para TCP ou UDP que colocam o tráfego na rede global da AWS pela borda mais próxima, com failover entre Regiões conforme a saúde dos endpoints.',
          `**Local Zones**: extensão de uma Região numa área metropolitana. Habilite, crie uma sub-rede nela e rode cargas sensíveis a latência ou atenda residência de dados local ([guia](${pt.docs('local-zones/latest/ug/what-is-aws-local-zones.html')})).`,
          `**Wavelength Zones**: computação e armazenamento da AWS dentro das redes 5G de operadoras de telecom, acessadas por um **carrier gateway** ([guia](${pt.docs('wavelength/latest/developerguide/what-is-wavelength.html')})).`,
          `**AWS Outposts**: racks (42U) ou servidores (1U ou 2U) gerenciados pela AWS nas suas instalações, extensão de uma AZ e da sua Região para baixa latência, processamento local e residência de dados ([guia](${pt.docs('outposts/latest/userguide/what-is-outposts.html')})).`,
        ],
        tip: '"Latência de milissegundos de um dígito até um sistema on-premises" ou "os dados precisam ficar no nosso prédio" é **Outposts**. "Usuários numa cidade sem Região" é **Local Zones**. "Dispositivos móveis 5G" é **Wavelength**. "IP estático e aceleração TCP/UDP" é **Global Accelerator**, não CloudFront.',
      },
      {
        id: 'shared-responsibility',
        name: 'Responsabilidade compartilhada',
        link: pt.aws('compliance/shared-responsibility-model/'),
        summary:
          'A AWS responde pela segurança **da** nuvem, o cliente pela segurança **na** nuvem. Quanto fica com você depende de quão abstraído é o serviço.',
        points: [
          '**AWS**: hardware, software, rede e instalações que rodam os serviços da AWS.',
          '**IaaS (EC2)**: o cliente faz toda a configuração e gestão de segurança do sistema operacional convidado, aplicações, security groups e dados.',
          '**Serviços abstraídos (S3, DynamoDB)**: a AWS opera infraestrutura, sistema operacional e plataforma. Você cuida dos dados, das opções de criptografia e das permissões do IAM.',
          '**Controles compartilhados**: gestão de patches, gestão de configuração, conscientização e treinamento, cada parte na sua camada.',
          '**Controles herdados**: os controles físicos e ambientais vêm inteiramente da AWS.',
        ],
        tip: 'No nível Associate a pergunta vira design: trocar EC2 por um serviço gerenciado é o jeito de **transferir** patches e hardening do sistema operacional para a AWS. Criptografar dados e restringir permissões do IAM continuam sempre com você.',
      },
      {
        id: 'wa-tool',
        name: 'Well-Architected Tool',
        fullName: 'AWS Well-Architected Tool',
        link: pt.aws('well-architected-tool/'),
        summary:
          'Serviço no console, sem custo adicional, para revisar uma carga de trabalho contra o framework, registrar decisões e acompanhar melhorias.',
        points: [
          '**Revisão da carga**: responda às perguntas dos pilares e receba os riscos identificados, altos e médios (HRIs e MRIs), mais um **plano de melhoria**.',
          `**Lentes** ([guia](${pt.docs('wellarchitected/latest/userguide/lenses.html')})): a lente do Well-Architected Framework é aplicada automaticamente. Some lentes do **Lens Catalog** da AWS ou suas **lentes personalizadas**.`,
          '**Marcos (milestones)**: registram o estado da carga num ponto no tempo para medir o progresso.',
          '**Integrações**: AWS Trusted Advisor e AWS Service Catalog AppRegistry ajudam a responder as perguntas da revisão.',
        ],
        tip: '"Revisar uma carga contra as boas práticas da AWS e acompanhar a correção ao longo do tempo" é o **Well-Architected Tool**. O Trusted Advisor verifica problemas específicos na conta, ele não conduz a revisão de arquitetura.',
      },
    ],
  },
]
