import { en, pt } from '../links'
import type { Topic } from '../types'

export const enUS: readonly Topic[] = [
  {
    slug: 'decoupling',
    group: 'resilient',
    icon: 'plug',
    title: 'Decoupling and messaging',
    summary:
      'SQS, SNS, EventBridge, Step Functions, API Gateway, Amazon MQ and Kinesis: how to build loosely coupled, scalable designs.',
    lede: 'Loose coupling lets each component scale, fail and change on its own. This is task 2.1 of **Design Resilient Architectures**, 26% of scored content.',
    sections: [
      {
        id: 'sqs',
        name: 'SQS',
        fullName: 'Amazon Simple Queue Service',
        link: en.docs('AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-types.html'),
        summary:
          'A fully managed queue that buffers work between producers and consumers, so a slow or failed consumer does not lose requests. Consumers poll the queue and delete each message after processing it.',
        points: [
          '**Standard vs FIFO**: standard gives nearly unlimited throughput, at-least-once delivery and best-effort ordering. FIFO keeps order inside each `MessageGroupId` and drops duplicates sent within a 5-minute deduplication interval, at 300 API calls per second per action (3,000 messages per second with batches of 10), more with high throughput mode.',
          '**Visibility timeout**: a received message stays hidden for 30 seconds by default (0 seconds to 12 hours). If the consumer does not delete it in time, it reappears and is processed again, so set it above the processing time.',
          '**Retention and size**: messages are kept 4 days by default, from 1 minute to 14 days. A message is at most 1 MiB, larger payloads go to S3 through the Extended Client Library.',
          '**Long polling**: `WaitTimeSeconds` up to 20 seconds cuts empty responses and cost. Delay queues postpone delivery by up to 15 minutes.',
          '**Dead-letter queue**: after `maxReceiveCount` receives (1 to 1,000) a message moves to a DLQ of the same type, in the same account and Region. Standard queues keep the original enqueue timestamp, so give the DLQ a longer retention.',
          '**Scaling workers**: scale an Auto Scaling group on backlog per instance (`ApproximateNumberOfMessages` divided by in-service instances). Messages held by a terminated instance return to the queue.',
        ],
        tip: '"Decouple the tiers and absorb traffic spikes": **SQS standard**. "Process orders exactly once and in order": **SQS FIFO**. Messages processed twice point to a **visibility timeout** shorter than the processing time, not to a missing DLQ.',
      },
      {
        id: 'sns',
        name: 'SNS',
        fullName: 'Amazon Simple Notification Service',
        link: en.docs('sns/latest/dg/welcome.html'),
        summary:
          'Publish and subscribe: a producer publishes once to a topic and SNS pushes a copy to every subscriber. Subscribers do not poll.',
        points: [
          '**Subscribers**: SQS queues, Lambda functions, Amazon Data Firehose and HTTP/S endpoints, plus email, SMS and mobile push for people.',
          '**Fan-out**: one topic with several SQS queues subscribed, each consumed by its own service. A slow consumer never delays the others and its messages wait in its queue.',
          '**Message filtering**: a filter policy on the subscription, applied to message attributes or to the message body, delivers only matching messages to that subscriber.',
          '**FIFO topics**: strict ordering and deduplication, delivered only to SQS FIFO or standard queues. Email, SMS, mobile push and HTTP/S cannot subscribe to a FIFO topic.',
        ],
        tip: '"One event must trigger several independent processes": **SNS + SQS fan-out**. Writing the same message to several queues from the application is the distractor: it couples the producer to every consumer.',
      },
      {
        id: 'eventbridge',
        name: 'EventBridge',
        fullName: 'Amazon EventBridge',
        link: en.docs('eventbridge/latest/userguide/eb-what-is.html'),
        summary:
          'A serverless event router: event buses receive events from AWS services, your applications and third-party software, and rules send them to targets.',
        points: [
          '**Event bus and rules**: a rule matches an event pattern and routes to one or more targets, optionally transforming the event first. Built for many sources to many targets.',
          '**Pipes**: point-to-point integration from one source to one target, with optional filtering and enrichment, e.g. an SQS queue enriched through an API destination and sent to Step Functions. You pay only for events that pass the filter.',
          '**Scheduler**: serverless cron, rate and one-time schedules with flexible time windows and retry limits.',
          '**Archive and replay**: keep events (indefinitely by default) and replay them to the source bus to recover from errors or test new consumers.',
        ],
        tip: '"React to a change in an AWS service" or "route events by content to many targets": **EventBridge rule**. "Run a task every night without servers": **EventBridge Scheduler**, not a cron job on an EC2 instance.',
      },
      {
        id: 'step-functions',
        name: 'Step Functions',
        fullName: 'AWS Step Functions',
        link: en.docs('step-functions/latest/dg/choosing-workflow-type.html'),
        summary:
          'Workflow orchestration as a state machine: retries, error handling, parallel branches and waits are declared in the workflow instead of coded in each service.',
        points: [
          '**Standard**: up to 1 year, exactly-once execution, billed per state transition, execution history kept 90 days. Fits long and non-idempotent work such as payments.',
          '**Express**: up to 5 minutes, billed by executions, duration and memory. At-least-once when asynchronous, at-most-once when synchronous. Fits high-volume event processing and IoT ingestion.',
          '**Callbacks and jobs**: only Standard supports the `.sync` job-run and `.waitForTaskToken` callback patterns, e.g. waiting for a human approval.',
          '**Fixed type**: the workflow type cannot be changed after the state machine is created.',
        ],
        tip: '"Coordinate several Lambda functions with retries and a manual approval step": **Step Functions Standard**. Lambda functions calling each other is the distractor. "Thousands of short events per second": **Express**.',
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        fullName: 'Amazon API Gateway',
        link: en.docs('apigateway/latest/developerguide/http-api-vs-rest.html'),
        summary:
          'A managed front door for APIs that handles authorization, throttling and monitoring in front of Lambda, HTTP endpoints or AWS services.',
        points: [
          '**Throttling**: token bucket of 10,000 requests per second with a burst of 5,000 per account per Region in most Regions. Above it clients get `429 Too Many Requests`. Stage, method and per-client usage plan limits sit below it.',
          '**Caching**: REST APIs only, per stage, TTL 300 seconds by default and up to 3,600. Only `GET` methods are cached by default.',
          '**Integration timeout**: 50 milliseconds to 29 seconds for REST APIs. Regional and private APIs can raise it, possibly with a lower throttle quota. Long jobs go asynchronous through SQS or Step Functions.',
          '**Endpoint types**: edge-optimized, Regional and private. Edge-optimized and private endpoints exist only for REST APIs.',
        ],
        tip: '"Limit each partner by API key with a monthly quota": **REST API with usage plans**. "Cheapest proxy to Lambda with JWT auth": **HTTP API**. "Server pushes updates to clients": **WebSocket API**, not polling.',
        table: {
          title: 'API types',
          head: ['Type', 'When to use'],
          rows: [
            {
              key: 'REST API',
              cells: [
                'Full feature set: API keys and usage plans, per-client throttling, caching, request validation, AWS WAF, private endpoints.',
              ],
            },
            {
              key: 'HTTP API',
              cells: [
                'Minimal features at a lower price: JWT authorizers (Amazon Cognito), Lambda and HTTP proxies, private integrations.',
              ],
            },
            {
              key: 'WebSocket API',
              cells: [
                'Bidirectional connections where the service pushes data: chat, collaboration, multiplayer games, trading.',
              ],
            },
          ],
        },
      },
      {
        id: 'amazon-mq',
        name: 'Amazon MQ',
        link: en.docs('amazon-mq/latest/developer-guide/welcome.html'),
        summary:
          'Managed Apache ActiveMQ and RabbitMQ brokers, to migrate applications that already use standard messaging protocols without rewriting the messaging code.',
        points: [
          '**Protocols**: JMS, NMS, AMQP 0.9.1, AMQP 1.0, STOMP, MQTT and WebSocket.',
          '**High availability**: ActiveMQ active/standby brokers replicated across Availability Zones, RabbitMQ 3-node clusters with quorum queues spread across AZs.',
          '**Cross-Region**: ActiveMQ cross-Region data replication copies messages asynchronously to a replica broker that can be promoted.',
          '**New designs**: for brand new cloud applications AWS recommends SQS and SNS instead.',
        ],
        tip: '"Migrate an on-premises app that uses JMS or AMQP with minimal code changes": **Amazon MQ**. Rewriting it for SQS is the distractor when the question stresses keeping the existing code.',
      },
      {
        id: 'kinesis-vs-sqs',
        name: 'Kinesis vs SQS',
        fullName: 'Amazon Kinesis Data Streams',
        link: en.docs('streams/latest/dev/key-concepts.html'),
        summary:
          'A stream of ordered records kept for replay and read by several consumer applications at once. Pick it over SQS when many consumers need the same data or must reprocess it.',
        points: [
          '**Shards**: each shard takes up to 1 MB per second or 1,000 records per second of writes and serves up to 2 MB per second of reads. On-demand mode manages shards for you, provisioned mode bills per shard hour.',
          '**Ordering**: the partition key picks the shard, and each record gets a sequence number within it, so related records stay in order.',
          '**Retention and replay**: 24 hours by default, up to 365 days. Each application reads independently and can re-read, unlike SQS where a deleted message is gone.',
          '**Record size**: a data blob of up to 1 MB.',
        ],
        tip: '"Several applications must process the same clickstream in real time and replay it": **Kinesis Data Streams**. SQS is the distractor: each message is processed by one consumer and then deleted.',
        table: {
          title: 'Which service',
          head: ['Need', 'Service'],
          rows: [
            { key: 'Buffer work for a pool of workers', cells: ['**SQS**: consumers poll, process and delete.'] },
            { key: 'One message to many subscribers', cells: ['**SNS**: push fan-out, often into SQS queues.'] },
            { key: 'Route events by content', cells: ['**EventBridge**: rules, schedules, archive and replay.'] },
            {
              key: 'Real-time stream, many readers, replay',
              cells: ['**Kinesis Data Streams**: shards, up to 365 days.'],
            },
            { key: 'Multi-step workflow with state', cells: ['**Step Functions**: Standard or Express.'] },
            { key: 'Existing JMS, AMQP or MQTT apps', cells: ['**Amazon MQ**: managed ActiveMQ or RabbitMQ.'] },
          ],
        },
      },
      {
        id: 'stateless',
        name: 'Stateless design',
        link: en.aws('caching/'),
        summary:
          'Instances that keep no session data can be added, replaced or terminated at any time, which is what makes Auto Scaling and load balancing safe.',
        points: [
          '**Externalize session state**: keep sessions in Amazon ElastiCache or DynamoDB so any instance can serve any request and scale-in loses nothing.',
          '**Sticky sessions**: an ALB can pin a client to one target, but a session that lives only on that instance is lost when the instance is terminated.',
          '**Shared files**: uploads go to S3 or Amazon EFS, never to the local disk of one instance.',
          '**Horizontal over vertical**: adding instances behind a load balancer scales without the ceiling and the stop of resizing a single instance.',
        ],
        tip: '"Users are logged out when Auto Scaling terminates an instance": move sessions to **ElastiCache** or **DynamoDB**. Enabling sticky sessions is the distractor: it keeps the state on the instance.',
      },
    ],
  },
  {
    slug: 'high-availability',
    group: 'resilient',
    icon: 'refresh',
    title: 'High availability',
    summary:
      'Multi-AZ design with Elastic Load Balancing, EC2 Auto Scaling, RDS and Aurora failover, RDS Proxy and Route 53 health checks.',
    lede: 'A highly available workload keeps serving when an instance, a database or a whole Availability Zone fails. This is task 2.2 of **Design Resilient Architectures**, 26% of scored content.',
    sections: [
      {
        id: 'multi-az',
        name: 'Multi-AZ design',
        link: en.aws('about-aws/global-infrastructure/regions_az/'),
        summary:
          'Availability Zones are isolated locations inside a Region. Spreading every tier across at least 2 AZs removes the single point of failure that one AZ represents.',
        points: [
          '**Every tier**: load balancer, Auto Scaling group and database must all span several AZs. One single-AZ component makes the whole stack single-AZ.',
          '**ALB requirement**: an Application Load Balancer must have at least 2 Availability Zones enabled.',
          '**Static stability**: provision enough capacity in the remaining AZs to carry the load without depending on scaling during the failure.',
          '**Zonal shift**: Amazon Application Recovery Controller (ARC) moves load balancer traffic away from an impaired AZ with a single action.',
          '**Multi-AZ vs multi-Region**: Multi-AZ covers the loss of a data center or an AZ. Losing a whole Region is disaster recovery and needs a second Region.',
        ],
        tip: '"Survive the failure of one Availability Zone at the lowest cost": **Multi-AZ** (ALB, Auto Scaling across AZs, RDS Multi-AZ). A second Region is the distractor unless the question mentions a Region-wide outage.',
      },
      {
        id: 'load-balancing',
        name: 'Load balancers',
        fullName: 'Elastic Load Balancing',
        link: en.docs('elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html'),
        summary:
          'ELB spreads traffic across healthy targets in several Availability Zones and stops routing to a target that fails its health checks.',
        points: [
          '**Health checks**: configured per target group. Unhealthy targets stop receiving traffic and get it back once healthy.',
          '**Cross-zone**: always on at the load balancer level for ALB (can be turned off per target group), off by default for NLB and GWLB.',
          '**Auto Scaling integration**: instances launched by the group register in the target group and deregister on termination. Turn on ELB health checks in the group so it replaces instances the load balancer marks unhealthy.',
          '**Internal vs internet-facing**: an internet-facing load balancer for the web tier and an internal one for the app tier build a multi-tier design.',
        ],
        tip: '"Clients must allowlist fixed IP addresses" or "UDP traffic": **NLB**. "Route /api and /images to different services": **ALB**. "Insert third-party firewalls transparently": **GWLB**.',
        table: {
          title: 'Load balancer types',
          head: ['Type', 'When to use'],
          rows: [
            {
              key: 'ALB',
              cells: [
                'Layer 7: HTTP, HTTPS, gRPC, WebSockets. Routes by path, host, header, method, query string or source IP. Targets: instances, IPs, Lambda. Works with AWS WAF and user authentication.',
              ],
            },
            {
              key: 'NLB',
              cells: [
                'Layer 4: TCP, UDP, TLS, QUIC, millions of requests per second. A static IP per AZ, optional Elastic IP per subnet. Fronts AWS PrivateLink services.',
              ],
            },
            {
              key: 'GWLB',
              cells: [
                'Layer 3 for virtual appliances (firewalls, IDS/IPS, deep packet inspection). GENEVE on port 6081, Gateway Load Balancer endpoints as route table next hop.',
              ],
            },
          ],
        },
      },
      {
        id: 'auto-scaling',
        name: 'EC2 Auto Scaling',
        fullName: 'Amazon EC2 Auto Scaling',
        link: en.docs('autoscaling/ec2/userguide/as-scale-based-on-demand.html'),
        summary:
          'Keeps the desired number of healthy instances across AZs and changes that number with demand, between a minimum and a maximum.',
        points: [
          '**Target tracking**: the recommended policy. Keeps a metric such as average CPU or request count per target at a target value, like a thermostat.',
          '**Step and simple**: step adjusts by different amounts depending on the size of the alarm breach. Simple applies one adjustment and waits for a cooldown.',
          '**Scheduled and predictive**: scheduled changes capacity at known times. Predictive analyzes up to 14 days of history (at least 24 hours) to forecast the next 48 hours and scales out ahead of cyclical peaks.',
          '**Warm pools**: pre-initialized instances kept `Stopped`, `Hibernated` or `Running` to cut scale-out latency for apps with long boot times.',
          '**Lifecycle hooks**: hold an instance in a wait state (1 hour by default) to bootstrap it before it enters service or to copy logs before it terminates.',
          '**Instance refresh**: replaces instances in a rolling way after a new launch template or AMI.',
        ],
        tip: '"Traffic rises every weekday at 9 a.m. and instances take minutes to boot": **predictive** or **scheduled scaling**, plus a **warm pool**. "Keep CPU near a value": **target tracking**. Simple scaling is rarely the best answer.',
      },
      {
        id: 'rds-availability',
        name: 'RDS availability',
        fullName: 'Amazon RDS',
        link: en.docs('AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html'),
        summary:
          'Multi-AZ deployments fail over automatically inside a Region. Read replicas scale reads and can be promoted, but they replicate asynchronously and are promoted by hand.',
        points: [
          '**Multi-AZ DB instance**: one synchronous standby in another AZ that serves no reads. Failover points the DNS endpoint to the standby, typically in 60 to 120 seconds.',
          '**Multi-AZ DB cluster**: a writer and 2 readable standbys in 3 AZs with semisynchronous replication, for RDS for MySQL and PostgreSQL. Failover is typically under 35 seconds.',
          '**Read replicas**: asynchronous, up to 15 per source, in the same or another Region. Use them for read scaling, reporting and cross-Region DR by promotion. RDS does not auto scale them.',
          '**Reconnect**: applications must reconnect after failover and should not cache DNS for more than 60 seconds.',
        ],
        tip: '"Automatic failover with no application changes": **Multi-AZ**. "Offload reporting queries": **read replica**. A read replica is the distractor for HA: it is asynchronous and must be promoted.',
        table: {
          title: 'RDS and Aurora options',
          head: ['Option', 'What it gives you'],
          rows: [
            {
              key: 'Multi-AZ DB instance',
              cells: ['HA. Synchronous standby, no reads, failover typically 60 to 120 seconds.'],
            },
            {
              key: 'Multi-AZ DB cluster',
              cells: ['HA plus reads. 2 readable standbys, failover typically under 35 seconds.'],
            },
            { key: 'Read replica', cells: ['Read scaling and DR. Asynchronous, up to 15, manual promotion.'] },
            {
              key: 'Aurora Replica',
              cells: ['Both. Up to 15 per cluster on shared storage, automatic failover target.'],
            },
          ],
        },
      },
      {
        id: 'aurora',
        name: 'Aurora',
        fullName: 'Amazon Aurora',
        link: en.docs('AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html'),
        summary:
          'Aurora separates compute from a shared cluster volume copied across 3 AZs, so replicas add read capacity and failover targets without copying data.',
        points: [
          '**Storage**: each write is replicated synchronously to 6 storage nodes across AZs, whatever the number of instances. The volume grows automatically.',
          '**Aurora Replicas**: up to 15 readers with lag usually well under 100 milliseconds. The reader endpoint spreads read connections across them.',
          '**Failover**: a replica is promoted, typically in less than 60 seconds and often less than 30. Without replicas the writer is recreated, typically in less than 10 minutes.',
          '**Promotion tiers**: priority 0 (highest) to 15 decides which replica becomes the writer. Ties go to the largest replica.',
          '**Cluster endpoint**: always points to the current writer, so the connection string survives failover.',
        ],
        tip: '"Fastest failover for a relational database with many read replicas": **Aurora** with replicas in other AZs. "Choose which replica becomes the writer": **promotion tier**.',
      },
      {
        id: 'rds-proxy',
        name: 'RDS Proxy',
        fullName: 'Amazon RDS Proxy',
        link: en.docs('AmazonRDS/latest/UserGuide/rds-proxy.html'),
        summary:
          'A managed connection pool between the application and RDS or Aurora that absorbs connection surges and hides failovers from clients.',
        points: [
          '**Connection pooling**: reuses database connections, so thousands of Lambda invocations or threads do not exhaust the database. Excess requests are queued or throttled instead of failing.',
          '**Failover**: keeps client connections open and routes to the new instance, bypassing DNS caches to cut failover time by up to 66% for Aurora Multi-AZ.',
          '**Security**: can require IAM authentication from clients and reads database credentials from AWS Secrets Manager.',
          '**No code changes**: most applications only switch the endpoint. The proxy lives in the same VPC as the database and is never publicly accessible.',
        ],
        tip: '"Lambda functions exhaust database connections": **RDS Proxy**. A bigger instance class is the distractor. "Make an app tolerate database failover without changing code": **RDS Proxy**.',
      },
      {
        id: 'route-53-failover',
        name: 'Route 53 failover',
        fullName: 'Amazon Route 53',
        link: en.docs('Route53/latest/DeveloperGuide/dns-failover-types.html'),
        summary:
          'Route 53 health checks remove unhealthy endpoints from DNS answers, giving active-active or active-passive failover across AZs or Regions.',
        points: [
          '**Health check types**: an endpoint (IP or domain name), other health checks (calculated), or a CloudWatch alarm.',
          '**Active-passive**: the failover routing policy answers with the primary record while it is healthy and with the secondary when it is not, e.g. a static S3 website as a maintenance page.',
          '**Active-active**: any other routing policy (weighted, latency, geolocation) combined with health checks returns only healthy records.',
          '**Alias records**: for AWS targets such as an ALB, set **Evaluate Target Health** instead of creating a separate health check.',
          '**Private resources**: endpoint checks come from the internet, so monitor private resources with a health check on a CloudWatch alarm.',
        ],
        tip: '"Send users to a backup site only when the primary fails": **failover routing** with health checks. "Spread traffic and skip unhealthy Regions": **latency** or **weighted** routing with health checks.',
      },
      {
        id: 'operations',
        name: 'Quotas and operations',
        link: en.docs('servicequotas/latest/userguide/intro.html'),
        summary:
          'Resilience also depends on limits, deployments and visibility: quotas that cap scaling, throttling that needs retries and tracing that finds the failing component.',
        points: [
          '**Service quotas**: many quotas are per account per Region and adjustable through Service Quotas. Raise them before a launch or a failover needs the capacity.',
          '**Throttling**: retry with exponential backoff and jitter, cap the number of retries and retry only idempotent operations.',
          '**Immutable infrastructure**: never change production in place. Deploy new resources (new AMI, new launch template) and shift traffic with canary or blue/green, keeping the old version for rollback.',
          '**AWS X-Ray**: traces requests across services and draws a trace map that shows bottlenecks, latency spikes and errors.',
          '**Amazon Managed Service for Prometheus** and **Amazon Managed Grafana**: Prometheus metrics from containers and Grafana dashboards, with no servers to run.',
          '**AWS Health Dashboard**: AWS events that affect your resources, such as scheduled maintenance, also delivered to EventBridge.',
          '**Legacy apps that cannot change**: put them behind an ALB with an Auto Scaling group across AZs, move the database to RDS Multi-AZ with RDS Proxy, and buffer fragile back ends with SQS.',
        ],
        tip: '"The failover Region could not launch enough instances": **raise service quotas in the standby Region** beforehand. "Find which microservice adds latency": **X-Ray**, not CloudWatch Logs alone.',
      },
    ],
  },
  {
    slug: 'disaster-recovery',
    group: 'resilient',
    icon: 'lifebuoy',
    title: 'Disaster recovery',
    summary:
      'RPO and RTO, the 4 DR strategies, AWS Backup, Elastic Disaster Recovery and cross-Region copies for S3, Aurora, DynamoDB and EBS.',
    lede: 'Disaster recovery brings a workload back after a Region-wide or data-destroying event, within agreed downtime and data loss. Part of task 2.2 of **Design Resilient Architectures**, 26% of scored content.',
    sections: [
      {
        id: 'rpo-rto',
        name: 'RPO and RTO',
        link: en.docs('whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html'),
        summary:
          'The 2 recovery objectives the business sets for each workload. They drive the choice of DR strategy and its cost.',
        points: [
          '**RTO**: the maximum acceptable delay between the interruption and the restoration of service. How long can we be down.',
          '**RPO**: the maximum acceptable time since the last data recovery point. How much data can we lose.',
          '**Cost trade-off**: lower RPO and RTO cost more in resources and complexity. If recovery costs more than the loss, skip it unless regulation requires it.',
          '**Replication is not backup**: continuous replication also copies corruption and malicious deletes, so keep point-in-time backups too.',
          '**Multi-AZ first**: AZs are far enough apart that most disasters hit only one, so a Multi-AZ design may already cover much of the risk.',
        ],
        tip: '"Can lose at most 15 minutes of data" is an **RPO** requirement. "Must be back online within 1 hour" is an **RTO** requirement. Check which one the question constrains before picking a strategy.',
      },
      {
        id: 'strategies',
        name: 'DR strategies',
        link: en.docs(
          'whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html',
        ),
        summary:
          'The whitepaper Disaster Recovery of Workloads on AWS groups DR into 4 strategies, from cheap and slow to expensive and near zero.',
        points: [
          '**Backup and restore**: back up data, AMIs and infrastructure as code, then rebuild everything in the recovery Region after the event.',
          '**Pilot light**: data is replicated live and core infrastructure exists, but application servers are switched off and are started and scaled out on failover.',
          '**Warm standby**: a scaled-down but fully working copy can serve traffic at once. Failover only scales it up.',
          '**Multi-site active/active**: every Region serves traffic. Hot standby is the active/passive variant at full scale.',
          '**Data plane failover**: fail over with data plane operations such as Route 53 health checks or ARC routing controls, not control plane changes.',
        ],
        tip: '"Data must be live in the second Region but servers can start on failover": **pilot light**. "Must take traffic immediately at reduced capacity": **warm standby**. The difference is whether the DR copy serves requests without being switched on first.',
        table: {
          title: 'DR strategies compared',
          head: ['Strategy', 'RPO / RTO and cost'],
          rows: [
            {
              key: 'Backup and restore',
              cells: ['Hours. Cost $. Lower priority workloads, all resources provisioned after the event.'],
            },
            { key: 'Pilot light', cells: ['Tens of minutes. Cost $$. Data live, services idle.'] },
            { key: 'Warm standby', cells: ['Minutes. Cost $$$. Always running but smaller, business critical.'] },
            {
              key: 'Multi-site active/active',
              cells: ['Real time, near zero data loss. Cost $$$$. Mission critical services.'],
            },
          ],
        },
      },
      {
        id: 'aws-backup',
        name: 'AWS Backup',
        link: en.docs('aws-backup/latest/devguide/whatisbackup.html'),
        summary:
          'Central, policy-based backup for EC2, EBS, RDS, Aurora, DynamoDB, EFS, FSx, S3 and more, with copies to other Regions and accounts.',
        points: [
          '**Backup plans**: schedule, retention and transition to cold storage, assigned to resources by tags.',
          '**Cross-Region copy**: copy rules send each recovery point to a vault in the DR Region, on a schedule or on demand.',
          '**Cross-account copy**: copies to vaults in other accounts of the same AWS Organizations organization protect against a compromised account. Restore after copying into the target account.',
          '**Vault Lock**: WORM protection. Governance mode can be removed with IAM permissions. Compliance mode becomes immutable after a grace time of at least 72 hours, even for the root user and AWS.',
          '**Audit Manager**: built-in controls and daily reports show whether backups meet policy.',
        ],
        tip: '"Centralize backups across many accounts and copy them to another Region": **AWS Backup** with Organizations. "Ransomware must not delete backups": **Vault Lock in compliance mode** plus cross-account copies.',
      },
      {
        id: 'elastic-disaster-recovery',
        name: 'Elastic Disaster Recovery',
        fullName: 'AWS Elastic Disaster Recovery',
        link: en.aws('disaster-recovery/'),
        summary:
          'Continuous block-level replication of servers from on premises, another cloud or another AWS Region into a low-cost staging area in AWS.',
        points: [
          '**Targets**: RPO of seconds and RTO of minutes.',
          '**Staging area**: data lands in a staging subnet with affordable storage and minimal compute. Full-capacity instances launch only for drills or recovery.',
          '**Point in time**: recover from the latest state or from an earlier point, e.g. before a ransomware infection.',
          '**Failback**: once the primary site is fixed, replicate back and fail back when ready.',
          '**Scope**: applications and databases running on servers, not managed services such as RDS. It follows the pilot light pattern.',
        ],
        tip: '"Replicate on-premises servers to AWS with RPO in seconds and RTO in minutes": **Elastic Disaster Recovery**. AWS Backup is the distractor: it takes point-in-time backups, not continuous replication.',
      },
      {
        id: 's3-replication',
        name: 'S3 replication',
        fullName: 'Amazon S3 Replication',
        link: en.docs('AmazonS3/latest/userguide/replication.html'),
        summary:
          'Asynchronous copying of objects to buckets in another Region (CRR) or the same Region (SRR), owned by the same or another account.',
        points: [
          '**Requirements**: versioning on source and destination and an IAM role that lets S3 replicate. Object Lock on the source requires Object Lock on the destination.',
          '**New objects only**: live replication copies objects written after the rule exists. Use **S3 Batch Replication** for existing objects, failed ones and replicas of replicas.',
          '**Deletes**: delete markers are not replicated by default with current rules, and deleting a specific version is never replicated, which shields the copy from malicious deletes.',
          '**S3 Replication Time Control**: replicates most objects in seconds with a 15-minute SLA, plus metrics and events for late objects.',
          '**CRR vs SRR**: CRR for compliance distance, lower latency and DR. SRR for log aggregation, prod to test copies and data sovereignty inside one Region.',
        ],
        tip: '"Copy objects to another Region within a predictable 15 minutes": **CRR with S3 RTC**. "Objects that existed before the rule were not copied": **Batch Replication**.',
      },
      {
        id: 'database-replication',
        name: 'Database replication',
        link: en.docs('AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html'),
        summary:
          'Managed cross-Region replication for relational and NoSQL data keeps RPO low without building your own pipelines.',
        points: [
          '**Aurora Global Database**: 1 primary Region and up to 10 read-only secondary Regions, storage-level replication typically under 1 second. A secondary can take over writes in less than 1 minute.',
          '**Switchover vs failover**: switchover moves the primary with no data loss for planned operations. Failover recovers from an outage of the primary Region.',
          '**Write forwarding**: secondary Aurora clusters can forward write statements to the primary.',
          '**DynamoDB global tables**: multi-active, every replica takes reads and writes. Multi-Region eventual consistency (default) resolves conflicts by last writer wins, multi-Region strong consistency is the other mode. 99.999% availability SLA.',
          '**RDS cross-Region read replicas**: asynchronous, promoted by hand during DR, which takes a few minutes and includes a reboot.',
        ],
        tip: '"Relational database, Region outage, RPO in seconds and RTO under 1 minute": **Aurora Global Database**. "Users in several Regions must write locally": **DynamoDB global tables**.',
        table: {
          title: 'Cross-Region data options',
          head: ['Service', 'DR role'],
          rows: [
            { key: 'Aurora Global Database', cells: ['Write global: one writer Region, readers in up to 10 others.'] },
            { key: 'DynamoDB global tables', cells: ['Write local: active/active in every Region.'] },
            { key: 'RDS read replica', cells: ['Pilot light database, manual promotion.'] },
            { key: 'S3 CRR', cells: ['Objects, two-way rules for active/active buckets.'] },
          ],
        },
      },
      {
        id: 'ebs-snapshots',
        name: 'EBS snapshots',
        fullName: 'Amazon EBS snapshots',
        link: en.docs('ebs/latest/userguide/ebs-snapshots.html'),
        summary:
          'Incremental, point-in-time block backups stored in S3 and replicated across the AZs of the Region, the building block of EC2 backup and restore.',
        points: [
          '**Incremental**: only changed blocks are saved. AWS does not back up volumes on its own, so schedule snapshots.',
          '**Cross-Region copy**: copy completed snapshots and AMIs to the DR Region. The first copy to a Region is full, later ones can be incremental.',
          '**Data Lifecycle Manager**: automates creation, retention and deletion of snapshots and EBS-backed AMIs, including copies to other Regions or accounts, at no additional cost.',
          '**Fast snapshot restore**: volumes created from the snapshot are fully initialized at creation, without first-read latency. Billed per snapshot per AZ per hour.',
          '**Recycle Bin**: restores accidentally deleted snapshots, volumes and EBS-backed AMIs before their retention period ends.',
        ],
        tip: '"Automate daily EBS snapshots and copy them to another Region at no extra cost": **Data Lifecycle Manager**. Pick **AWS Backup** when the scope spans many services and accounts.',
      },
      {
        id: 'regional-failover',
        name: 'Regional failover',
        link: en.docs('r53recovery/latest/dg/what-is-route53-recovery.html'),
        summary:
          'Moving users to the recovery Region needs traffic routing, capacity that can actually launch and the same configuration in both Regions.',
        points: [
          '**Route 53 failover routing**: health checks switch DNS answers to the DR Region automatically, a data plane operation.',
          '**ARC routing controls**: on/off switches backed by Route 53 health checks for a manually initiated, scripted failover.',
          '**Global Accelerator**: static anycast IPs in front of endpoints in several Regions. Health checks reroute traffic without DNS caching delays.',
          '**Service quotas in the standby Region**: raise them in advance so a pilot light or warm standby can scale to production size.',
          '**Infrastructure as code**: CloudFormation (StackSets across accounts and Regions) and golden AMIs copied to both Regions rebuild the environment consistently. Test the plan regularly.',
        ],
        tip: '"The DR Region could not scale during the test": **service quotas** were not raised there. "Clients cache DNS and fail over too slowly": **Global Accelerator** instead of DNS failover.',
      },
    ],
  },
]

export const ptBR: readonly Topic[] = [
  {
    slug: 'decoupling',
    group: 'resilient',
    icon: 'plug',
    title: 'Desacoplamento e mensageria',
    summary:
      'SQS, SNS, EventBridge, Step Functions, API Gateway, Amazon MQ e Kinesis: como montar arquiteturas desacopladas e escaláveis.',
    lede: 'Com baixo acoplamento, cada componente escala, falha e muda por conta própria. Esta é a tarefa 2.1 de **Design Resilient Architectures**, 26% do conteúdo pontuado.',
    sections: [
      {
        id: 'sqs',
        name: 'SQS',
        fullName: 'Amazon Simple Queue Service',
        link: pt.docs('AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-types.html'),
        summary:
          'Fila totalmente gerenciada que segura o trabalho entre produtores e consumidores, para que um consumidor lento ou com falha não perca requisições. O consumidor consulta a fila e apaga cada mensagem depois de processá-la.',
        points: [
          '**Standard vs FIFO**: a standard tem vazão quase ilimitada, entrega pelo menos uma vez e ordem de melhor esforço. A FIFO mantém a ordem dentro de cada `MessageGroupId` e descarta duplicatas enviadas dentro de um intervalo de deduplicação de 5 minutos, com 300 chamadas por segundo por ação (3.000 mensagens por segundo em lotes de 10), mais no modo de alta vazão.',
          '**Visibility timeout**: a mensagem recebida fica oculta por 30 segundos por padrão (de 0 segundo a 12 horas). Se o consumidor não apagá-la a tempo, ela reaparece e é processada de novo, então ajuste acima do tempo de processamento.',
          '**Retenção e tamanho**: mensagens ficam 4 dias por padrão, de 1 minuto a 14 dias. Cada mensagem tem no máximo 1 MiB, e cargas maiores vão para o S3 com a Extended Client Library.',
          '**Long polling**: `WaitTimeSeconds` de até 20 segundos reduz respostas vazias e custo. Filas com atraso adiam a entrega em até 15 minutos.',
          '**Dead-letter queue**: depois de `maxReceiveCount` recebimentos (1 a 1.000) a mensagem vai para uma DLQ do mesmo tipo, na mesma conta e Região. Filas standard mantêm o horário original de entrada, então dê à DLQ uma retenção maior.',
          '**Escalar workers**: escale um grupo do Auto Scaling pelo backlog por instância (`ApproximateNumberOfMessages` dividido pelas instâncias em serviço). Mensagens de uma instância encerrada voltam para a fila.',
        ],
        tip: '"Desacoplar as camadas e absorver picos de tráfego": **SQS standard**. "Processar pedidos uma única vez e em ordem": **SQS FIFO**. Mensagem processada duas vezes indica **visibility timeout** menor que o processamento, não falta de DLQ.',
      },
      {
        id: 'sns',
        name: 'SNS',
        fullName: 'Amazon Simple Notification Service',
        link: pt.docs('sns/latest/dg/welcome.html'),
        summary:
          'Publicação e assinatura: o produtor publica uma vez em um tópico e o SNS empurra uma cópia para cada assinante. Os assinantes não fazem polling.',
        points: [
          '**Assinantes**: filas SQS, funções Lambda, Amazon Data Firehose e endpoints HTTP/S, além de e-mail, SMS e push para pessoas.',
          '**Fan-out**: um tópico com várias filas SQS assinadas, cada uma consumida pelo seu serviço. Um consumidor lento nunca atrasa os outros e suas mensagens esperam na fila dele.',
          '**Filtro de mensagens**: uma filter policy na assinatura, aplicada aos atributos ou ao corpo da mensagem, entrega a esse assinante só o que combina.',
          '**Tópicos FIFO**: ordem estrita e deduplicação, entregues apenas a filas SQS FIFO ou standard. E-mail, SMS, push e HTTP/S não podem assinar um tópico FIFO.',
        ],
        tip: '"Um evento precisa disparar vários processos independentes": **fan-out SNS + SQS**. Gravar a mesma mensagem em várias filas pela aplicação é o distrator: acopla o produtor a todos os consumidores.',
      },
      {
        id: 'eventbridge',
        name: 'EventBridge',
        fullName: 'Amazon EventBridge',
        link: pt.docs('eventbridge/latest/userguide/eb-what-is.html'),
        summary:
          'Roteador de eventos serverless: event buses recebem eventos de serviços da AWS, das suas aplicações e de software de terceiros, e regras os enviam a destinos.',
        points: [
          '**Event bus e regras**: a regra compara um event pattern e roteia para um ou mais destinos, com transformação opcional do evento. Feito para muitas origens e muitos destinos.',
          '**Pipes**: integração ponto a ponto de uma origem para um destino, com filtro e enriquecimento opcionais, por exemplo uma fila SQS enriquecida por um API destination e enviada ao Step Functions. Só os eventos que passam no filtro são cobrados.',
          '**Scheduler**: agendamentos serverless por cron, por intervalo ou de execução única, com janelas flexíveis e limite de tentativas.',
          '**Archive e replay**: guarda eventos (indefinidamente por padrão) e os reenvia ao bus de origem para corrigir erros ou testar novos consumidores.',
        ],
        tip: '"Reagir a uma mudança em um serviço da AWS" ou "rotear eventos pelo conteúdo para vários destinos": **regra do EventBridge**. "Rodar uma tarefa toda noite sem servidor": **EventBridge Scheduler**, não um cron em uma instância EC2.',
      },
      {
        id: 'step-functions',
        name: 'Step Functions',
        fullName: 'AWS Step Functions',
        link: pt.docs('step-functions/latest/dg/choosing-workflow-type.html'),
        summary:
          'Orquestração de fluxos como máquina de estados: novas tentativas, tratamento de erro, ramos paralelos e esperas ficam declarados no fluxo, não codificados em cada serviço.',
        points: [
          '**Standard**: até 1 ano, execução exatamente uma vez, cobrado por transição de estado, histórico guardado por 90 dias. Serve para trabalho longo e não idempotente, como pagamentos.',
          '**Express**: até 5 minutos, cobrado por execuções, duração e memória. Pelo menos uma vez no modo assíncrono, no máximo uma vez no síncrono. Serve para alto volume de eventos e ingestão de IoT.',
          '**Callbacks e jobs**: só o Standard aceita os padrões `.sync` e `.waitForTaskToken`, por exemplo para esperar uma aprovação humana.',
          '**Tipo fixo**: o tipo do fluxo não muda depois que a máquina de estados é criada.',
        ],
        tip: '"Coordenar várias funções Lambda com novas tentativas e uma etapa de aprovação manual": **Step Functions Standard**. Funções Lambda chamando umas às outras é o distrator. "Milhares de eventos curtos por segundo": **Express**.',
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        fullName: 'Amazon API Gateway',
        link: pt.docs('apigateway/latest/developerguide/http-api-vs-rest.html'),
        summary:
          'Porta de entrada gerenciada para APIs que cuida de autorização, throttling e monitoramento na frente de Lambda, endpoints HTTP ou serviços da AWS.',
        points: [
          '**Throttling**: token bucket de 10.000 requisições por segundo com burst de 5.000 por conta por Região na maioria das Regiões. Acima disso o cliente recebe `429 Too Many Requests`. Limites de stage, de método e de usage plan por cliente ficam abaixo dele.',
          '**Cache**: só em REST APIs, por stage, TTL de 300 segundos por padrão e até 3.600. Por padrão só métodos `GET` entram no cache.',
          '**Timeout de integração**: de 50 milissegundos a 29 segundos em REST APIs. APIs regionais e privadas podem aumentar, talvez com uma cota de throttling menor. Trabalhos longos ficam assíncronos com SQS ou Step Functions.',
          '**Tipos de endpoint**: edge-optimized, regional e privado. Edge-optimized e privado existem só para REST APIs.',
        ],
        tip: '"Limitar cada parceiro por API key com cota mensal": **REST API com usage plans**. "Proxy mais barato para Lambda com JWT": **HTTP API**. "O servidor envia atualizações aos clientes": **WebSocket API**, não polling.',
        table: {
          title: 'Tipos de API',
          head: ['Tipo', 'Quando usar'],
          rows: [
            {
              key: 'REST API',
              cells: [
                'Todos os recursos: API keys e usage plans, throttling por cliente, cache, validação de requisição, AWS WAF, endpoints privados.',
              ],
            },
            {
              key: 'HTTP API',
              cells: [
                'Recursos mínimos por um preço menor: autorizadores JWT (Amazon Cognito), proxies para Lambda e HTTP, integrações privadas.',
              ],
            },
            {
              key: 'WebSocket API',
              cells: [
                'Conexões bidirecionais em que o serviço envia dados: chat, colaboração, jogos multiplayer, trading.',
              ],
            },
          ],
        },
      },
      {
        id: 'amazon-mq',
        name: 'Amazon MQ',
        link: pt.docs('amazon-mq/latest/developer-guide/welcome.html'),
        summary:
          'Brokers Apache ActiveMQ e RabbitMQ gerenciados, para migrar aplicações que já usam protocolos padrão de mensageria sem reescrever esse código.',
        points: [
          '**Protocolos**: JMS, NMS, AMQP 0.9.1, AMQP 1.0, STOMP, MQTT e WebSocket.',
          '**Alta disponibilidade**: brokers ActiveMQ ativo/standby replicados entre Availability Zones, clusters RabbitMQ de 3 nós com quorum queues distribuídas entre AZs.',
          '**Entre Regiões**: a replicação entre Regiões do ActiveMQ copia mensagens de forma assíncrona para um broker réplica que pode ser promovido.',
          '**Projetos novos**: para aplicações novas na nuvem a AWS recomenda SQS e SNS.',
        ],
        tip: '"Migrar uma aplicação on-premises que usa JMS ou AMQP com o mínimo de mudança no código": **Amazon MQ**. Reescrever para SQS é o distrator quando a questão enfatiza manter o código.',
      },
      {
        id: 'kinesis-vs-sqs',
        name: 'Kinesis vs SQS',
        fullName: 'Amazon Kinesis Data Streams',
        link: pt.docs('streams/latest/dev/key-concepts.html'),
        summary:
          'Um stream de registros ordenados, guardados para replay e lidos por várias aplicações ao mesmo tempo. Prefira ao SQS quando muitos consumidores precisam dos mesmos dados ou de reprocessá-los.',
        points: [
          '**Shards**: cada shard recebe até 1 MB por segundo ou 1.000 registros por segundo de escrita e entrega até 2 MB por segundo de leitura. O modo on-demand gerencia os shards, o provisionado cobra por shard-hora.',
          '**Ordem**: a partition key escolhe o shard e cada registro recebe um número de sequência nele, então registros relacionados mantêm a ordem.',
          '**Retenção e replay**: 24 horas por padrão, até 365 dias. Cada aplicação lê de forma independente e pode reler, ao contrário do SQS, em que a mensagem apagada some.',
          '**Tamanho do registro**: um blob de dados de até 1 MB.',
        ],
        tip: '"Várias aplicações precisam processar o mesmo clickstream em tempo real e reprocessá-lo": **Kinesis Data Streams**. O SQS é o distrator: cada mensagem é processada por um consumidor e depois apagada.',
        table: {
          title: 'Qual serviço',
          head: ['Necessidade', 'Serviço'],
          rows: [
            {
              key: 'Fila de trabalho para um grupo de workers',
              cells: ['**SQS**: o consumidor consulta, processa e apaga.'],
            },
            {
              key: 'Uma mensagem para muitos assinantes',
              cells: ['**SNS**: fan-out por push, muitas vezes para filas SQS.'],
            },
            {
              key: 'Rotear eventos pelo conteúdo',
              cells: ['**EventBridge**: regras, agendamentos, archive e replay.'],
            },
            {
              key: 'Stream em tempo real, vários leitores, replay',
              cells: ['**Kinesis Data Streams**: shards, até 365 dias.'],
            },
            { key: 'Fluxo com várias etapas e estado', cells: ['**Step Functions**: Standard ou Express.'] },
            {
              key: 'Aplicações JMS, AMQP ou MQTT existentes',
              cells: ['**Amazon MQ**: ActiveMQ ou RabbitMQ gerenciados.'],
            },
          ],
        },
      },
      {
        id: 'stateless',
        name: 'Design stateless',
        link: pt.aws('caching/'),
        summary:
          'Instâncias que não guardam dados de sessão podem ser criadas, trocadas ou encerradas a qualquer momento, e é isso que torna seguros o Auto Scaling e o balanceamento de carga.',
        points: [
          '**Sessão fora da instância**: guarde sessões no Amazon ElastiCache ou no DynamoDB para que qualquer instância atenda qualquer requisição e o scale-in não perca nada.',
          '**Sticky sessions**: o ALB pode prender um cliente a um destino, mas uma sessão que existe só naquela instância se perde quando ela é encerrada.',
          '**Arquivos compartilhados**: uploads vão para o S3 ou o Amazon EFS, nunca para o disco local de uma instância.',
          '**Horizontal antes de vertical**: somar instâncias atrás de um load balancer escala sem o teto e sem a parada de redimensionar uma única instância.',
        ],
        tip: '"Usuários são deslogados quando o Auto Scaling encerra uma instância": mova as sessões para **ElastiCache** ou **DynamoDB**. Ativar sticky sessions é o distrator: mantém o estado na instância.',
      },
    ],
  },
  {
    slug: 'high-availability',
    group: 'resilient',
    icon: 'refresh',
    title: 'Alta disponibilidade',
    summary:
      'Design Multi-AZ com Elastic Load Balancing, EC2 Auto Scaling, failover de RDS e Aurora, RDS Proxy e health checks do Route 53.',
    lede: 'Uma carga altamente disponível continua atendendo quando cai uma instância, um banco ou uma Availability Zone inteira. Esta é a tarefa 2.2 de **Design Resilient Architectures**, 26% do conteúdo pontuado.',
    sections: [
      {
        id: 'multi-az',
        name: 'Design Multi-AZ',
        link: pt.aws('about-aws/global-infrastructure/regions_az/'),
        summary:
          'Availability Zones são locais isolados dentro de uma Região. Espalhar cada camada por pelo menos 2 AZs elimina o ponto único de falha que uma AZ representa.',
        points: [
          '**Todas as camadas**: load balancer, grupo do Auto Scaling e banco precisam cobrir várias AZs. Um único componente em uma AZ deixa a pilha inteira dependente dela.',
          '**Exigência do ALB**: um Application Load Balancer precisa de pelo menos 2 Availability Zones habilitadas.',
          '**Estabilidade estática**: provisione capacidade suficiente nas AZs restantes para aguentar a carga sem depender de escalar durante a falha.',
          '**Zonal shift**: o Amazon Application Recovery Controller (ARC) tira o tráfego do load balancer de uma AZ com problema em uma única ação.',
          '**Multi-AZ vs multi-Região**: Multi-AZ cobre a perda de um data center ou de uma AZ. Perder uma Região inteira é recuperação de desastres e exige uma segunda Região.',
        ],
        tip: '"Sobreviver à falha de uma Availability Zone com o menor custo": **Multi-AZ** (ALB, Auto Scaling entre AZs, RDS Multi-AZ). Uma segunda Região é o distrator, a menos que a questão fale em falha de Região inteira.',
      },
      {
        id: 'load-balancing',
        name: 'Load balancers',
        fullName: 'Elastic Load Balancing',
        link: pt.docs('elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html'),
        summary:
          'O ELB distribui o tráfego entre destinos saudáveis em várias Availability Zones e para de enviar tráfego a um destino que falha nos health checks.',
        points: [
          '**Health checks**: configurados por target group. Destinos com problema deixam de receber tráfego e voltam a receber quando ficam saudáveis.',
          '**Cross-zone**: sempre ativo no nível do load balancer no ALB (pode ser desligado por target group), desligado por padrão no NLB e no GWLB.',
          '**Integração com Auto Scaling**: instâncias criadas pelo grupo entram no target group e saem ao serem encerradas. Ative os health checks do ELB no grupo para que ele troque as instâncias que o load balancer marca como não saudáveis.',
          '**Interno vs voltado à internet**: um load balancer público para a camada web e um interno para a camada de aplicação formam um design em camadas.',
        ],
        tip: '"Clientes precisam liberar IPs fixos no firewall" ou "tráfego UDP": **NLB**. "Rotear /api e /images para serviços diferentes": **ALB**. "Inserir firewalls de terceiros de forma transparente": **GWLB**.',
        table: {
          title: 'Tipos de load balancer',
          head: ['Tipo', 'Quando usar'],
          rows: [
            {
              key: 'ALB',
              cells: [
                'Camada 7: HTTP, HTTPS, gRPC, WebSockets. Roteia por caminho, host, header, método, query string ou IP de origem. Destinos: instâncias, IPs, Lambda. Funciona com AWS WAF e autenticação de usuários.',
              ],
            },
            {
              key: 'NLB',
              cells: [
                'Camada 4: TCP, UDP, TLS, QUIC, milhões de requisições por segundo. Um IP estático por AZ, Elastic IP opcional por sub-rede. Fica na frente de serviços AWS PrivateLink.',
              ],
            },
            {
              key: 'GWLB',
              cells: [
                'Camada 3 para appliances virtuais (firewalls, IDS/IPS, inspeção profunda de pacotes). GENEVE na porta 6081, Gateway Load Balancer endpoints como próximo salto na tabela de rotas.',
              ],
            },
          ],
        },
      },
      {
        id: 'auto-scaling',
        name: 'EC2 Auto Scaling',
        fullName: 'Amazon EC2 Auto Scaling',
        link: pt.docs('autoscaling/ec2/userguide/as-scale-based-on-demand.html'),
        summary:
          'Mantém o número desejado de instâncias saudáveis entre AZs e muda esse número conforme a demanda, entre um mínimo e um máximo.',
        points: [
          '**Target tracking**: a política recomendada. Mantém uma métrica como CPU média ou requisições por destino em um valor alvo, como um termostato.',
          '**Step e simple**: o step ajusta em quantidades diferentes conforme o tamanho da violação do alarme. O simple aplica um único ajuste e espera um cooldown.',
          '**Agendado e preditivo**: o agendado muda a capacidade em horários conhecidos. O preditivo analisa até 14 dias de histórico (no mínimo 24 horas) para prever as próximas 48 horas e escala antes dos picos cíclicos.',
          '**Warm pools**: instâncias pré-inicializadas mantidas `Stopped`, `Hibernated` ou `Running` para reduzir a latência de scale-out de aplicações que demoram a subir.',
          '**Lifecycle hooks**: seguram a instância em estado de espera (1 hora por padrão) para prepará-la antes de entrar em serviço ou copiar logs antes de encerrar.',
          '**Instance refresh**: troca as instâncias de forma gradual depois de um novo launch template ou AMI.',
        ],
        tip: '"O tráfego sobe todo dia útil às 9h e as instâncias levam minutos para subir": **escalonamento preditivo** ou **agendado**, mais um **warm pool**. "Manter a CPU perto de um valor": **target tracking**. Simple scaling raramente é a melhor resposta.',
      },
      {
        id: 'rds-availability',
        name: 'Disponibilidade no RDS',
        fullName: 'Amazon RDS',
        link: pt.docs('AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html'),
        summary:
          'Implantações Multi-AZ fazem failover automático dentro da Região. Réplicas de leitura escalam leituras e podem ser promovidas, mas replicam de forma assíncrona e são promovidas manualmente.',
        points: [
          '**Multi-AZ DB instance**: um standby síncrono em outra AZ que não atende leituras. O failover aponta o endpoint DNS para o standby, normalmente em 60 a 120 segundos.',
          '**Multi-AZ DB cluster**: um writer e 2 standbys legíveis em 3 AZs com replicação semissíncrona, para RDS for MySQL e PostgreSQL. O failover costuma levar menos de 35 segundos.',
          '**Réplicas de leitura**: assíncronas, até 15 por origem, na mesma Região ou em outra. Servem para escalar leituras, relatórios e DR entre Regiões por promoção. O RDS não as escala automaticamente.',
          '**Reconexão**: a aplicação precisa reconectar depois do failover e não deve guardar DNS em cache por mais de 60 segundos.',
        ],
        tip: '"Failover automático sem mudar a aplicação": **Multi-AZ**. "Tirar as consultas de relatório do banco principal": **réplica de leitura**. A réplica de leitura é o distrator para HA: é assíncrona e precisa ser promovida.',
        table: {
          title: 'Opções de RDS e Aurora',
          head: ['Opção', 'O que entrega'],
          rows: [
            {
              key: 'Multi-AZ DB instance',
              cells: ['HA. Standby síncrono, sem leitura, failover normalmente de 60 a 120 segundos.'],
            },
            {
              key: 'Multi-AZ DB cluster',
              cells: ['HA e leituras. 2 standbys legíveis, failover normalmente abaixo de 35 segundos.'],
            },
            { key: 'Réplica de leitura', cells: ['Escala de leitura e DR. Assíncrona, até 15, promoção manual.'] },
            {
              key: 'Aurora Replica',
              cells: ['Os dois. Até 15 por cluster no storage compartilhado, alvo de failover automático.'],
            },
          ],
        },
      },
      {
        id: 'aurora',
        name: 'Aurora',
        fullName: 'Amazon Aurora',
        link: pt.docs('AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html'),
        summary:
          'O Aurora separa a computação de um volume de cluster compartilhado e copiado em 3 AZs, então réplicas somam capacidade de leitura e alvos de failover sem copiar dados.',
        points: [
          '**Storage**: cada escrita é replicada de forma síncrona para 6 nós de armazenamento entre AZs, seja qual for o número de instâncias. O volume cresce sozinho.',
          '**Aurora Replicas**: até 15 leitoras com atraso normalmente bem abaixo de 100 milissegundos. O reader endpoint distribui as conexões de leitura.',
          '**Failover**: uma réplica é promovida, normalmente em menos de 60 segundos e muitas vezes em menos de 30. Sem réplicas o writer é recriado, normalmente em menos de 10 minutos.',
          '**Promotion tiers**: a prioridade de 0 (maior) a 15 decide qual réplica vira writer. No empate vence a maior réplica.',
          '**Cluster endpoint**: sempre aponta para o writer atual, então a string de conexão sobrevive ao failover.',
        ],
        tip: '"Failover mais rápido para um banco relacional com muitas réplicas de leitura": **Aurora** com réplicas em outras AZs. "Escolher qual réplica vira writer": **promotion tier**.',
      },
      {
        id: 'rds-proxy',
        name: 'RDS Proxy',
        fullName: 'Amazon RDS Proxy',
        link: pt.docs('AmazonRDS/latest/UserGuide/rds-proxy.html'),
        summary:
          'Pool de conexões gerenciado entre a aplicação e o RDS ou Aurora, que absorve picos de conexão e esconde o failover dos clientes.',
        points: [
          '**Pool de conexões**: reaproveita conexões com o banco, então milhares de invocações Lambda ou threads não esgotam o banco. O excesso entra em fila ou sofre throttling em vez de falhar.',
          '**Failover**: mantém as conexões dos clientes abertas e roteia para a nova instância, ignorando caches de DNS e reduzindo o tempo de failover em até 66% no Aurora Multi-AZ.',
          '**Segurança**: pode exigir autenticação IAM dos clientes e lê as credenciais do banco no AWS Secrets Manager.',
          '**Sem mudar código**: a maioria das aplicações só troca o endpoint. O proxy fica na mesma VPC do banco e nunca é acessível publicamente.',
        ],
        tip: '"Funções Lambda esgotam as conexões do banco": **RDS Proxy**. Aumentar a classe da instância é o distrator. "Fazer uma aplicação tolerar o failover do banco sem mudar código": **RDS Proxy**.',
      },
      {
        id: 'route-53-failover',
        name: 'Failover no Route 53',
        fullName: 'Amazon Route 53',
        link: pt.docs('Route53/latest/DeveloperGuide/dns-failover-types.html'),
        summary:
          'Os health checks do Route 53 tiram endpoints com problema das respostas DNS, o que permite failover ativo-ativo ou ativo-passivo entre AZs ou Regiões.',
        points: [
          '**Tipos de health check**: um endpoint (IP ou nome de domínio), outros health checks (calculado) ou um alarme do CloudWatch.',
          '**Ativo-passivo**: a política failover responde com o registro primário enquanto ele está saudável e com o secundário quando não está, por exemplo um site estático no S3 como página de manutenção.',
          '**Ativo-ativo**: qualquer outra política (weighted, latency, geolocation) com health checks devolve só registros saudáveis.',
          '**Registros alias**: para destinos da AWS como um ALB, ative **Evaluate Target Health** em vez de criar um health check separado.',
          '**Recursos privados**: as verificações de endpoint partem da internet, então monitore recursos privados com um health check sobre um alarme do CloudWatch.',
        ],
        tip: '"Mandar usuários para um site reserva só quando o principal falhar": **roteamento failover** com health checks. "Distribuir tráfego e pular Regiões com problema": roteamento **latency** ou **weighted** com health checks.',
      },
      {
        id: 'operations',
        name: 'Cotas e operação',
        link: pt.docs('servicequotas/latest/userguide/intro.html'),
        summary:
          'Resiliência também depende de limites, deploys e visibilidade: cotas que travam o escalonamento, throttling que exige novas tentativas e rastreamento que acha o componente com falha.',
        points: [
          '**Service quotas**: muitas cotas são por conta por Região e ajustáveis no Service Quotas. Aumente antes que um lançamento ou um failover precise da capacidade.',
          '**Throttling**: repita com exponential backoff e jitter, limite o número de tentativas e repita só operações idempotentes.',
          '**Infraestrutura imutável**: nunca altere produção no lugar. Suba novos recursos (nova AMI, novo launch template) e mude o tráfego com canary ou blue/green, mantendo a versão anterior para rollback.',
          '**AWS X-Ray**: rastreia requisições entre serviços e desenha um trace map que mostra gargalos, picos de latência e erros.',
          '**Amazon Managed Service for Prometheus** e **Amazon Managed Grafana**: métricas Prometheus de contêineres e dashboards do Grafana, sem servidores para operar.',
          '**AWS Health Dashboard**: eventos da AWS que afetam seus recursos, como manutenções agendadas, também entregues ao EventBridge.',
          '**Aplicações legadas que não podem mudar**: coloque-as atrás de um ALB com um grupo do Auto Scaling entre AZs, leve o banco para RDS Multi-AZ com RDS Proxy e proteja back ends frágeis com SQS.',
        ],
        tip: '"A Região de failover não conseguiu subir instâncias suficientes": **aumentar as service quotas na Região standby** com antecedência. "Descobrir qual microsserviço adiciona latência": **X-Ray**, não só o CloudWatch Logs.',
      },
    ],
  },
  {
    slug: 'disaster-recovery',
    group: 'resilient',
    icon: 'lifebuoy',
    title: 'Recuperação de desastres',
    summary:
      'RPO e RTO, as 4 estratégias de DR, AWS Backup, Elastic Disaster Recovery e cópias entre Regiões para S3, Aurora, DynamoDB e EBS.',
    lede: 'Recuperação de desastres traz a carga de volta depois de um evento que derruba uma Região ou destrói dados, dentro do tempo parado e da perda de dados combinados. Faz parte da tarefa 2.2 de **Design Resilient Architectures**, 26% do conteúdo pontuado.',
    sections: [
      {
        id: 'rpo-rto',
        name: 'RPO e RTO',
        link: pt.docs('whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html'),
        summary:
          'Os 2 objetivos de recuperação que o negócio define para cada carga. Eles determinam a estratégia de DR e o seu custo.',
        points: [
          '**RTO**: o atraso máximo aceitável entre a interrupção e a volta do serviço. Quanto tempo podemos ficar fora.',
          '**RPO**: o tempo máximo aceitável desde o último ponto de recuperação dos dados. Quantos dados podemos perder.',
          '**Custo**: RPO e RTO menores custam mais em recursos e complexidade. Se a recuperação custa mais que a perda, não vale montá-la, a menos que a regulação exija.',
          '**Replicação não é backup**: a replicação contínua também copia corrupção e exclusões maliciosas, então mantenha backups pontuais.',
          '**Multi-AZ primeiro**: as AZs ficam distantes o bastante para que a maioria dos desastres atinja só uma, então um design Multi-AZ pode já cobrir boa parte do risco.',
        ],
        tip: '"Pode perder no máximo 15 minutos de dados" é requisito de **RPO**. "Precisa voltar em até 1 hora" é requisito de **RTO**. Veja qual dos dois a questão restringe antes de escolher a estratégia.',
      },
      {
        id: 'strategies',
        name: 'Estratégias de DR',
        link: pt.docs(
          'whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html',
        ),
        summary:
          'O whitepaper Disaster Recovery of Workloads on AWS agrupa o DR em 4 estratégias, da barata e lenta à cara e quase instantânea.',
        points: [
          '**Backup and restore**: faça backup dos dados, das AMIs e da infraestrutura como código e reconstrua tudo na Região de recuperação depois do evento.',
          '**Pilot light**: os dados são replicados ao vivo e a infraestrutura central existe, mas os servidores de aplicação ficam desligados e são ligados e escalados no failover.',
          '**Warm standby**: uma cópia menor, porém completa, já consegue atender tráfego. O failover só precisa escalar.',
          '**Multi-site active/active**: todas as Regiões atendem tráfego. Hot standby é a variante ativo-passivo em escala total.',
          '**Failover pelo data plane**: faça o failover com operações de data plane, como health checks do Route 53 ou routing controls do ARC, e não com mudanças de control plane.',
        ],
        tip: '"Os dados precisam estar ao vivo na segunda Região, mas os servidores podem subir no failover": **pilot light**. "Precisa receber tráfego na hora com capacidade reduzida": **warm standby**. A diferença é se a cópia de DR atende requisições sem antes ser ligada.',
        table: {
          title: 'Estratégias de DR comparadas',
          head: ['Estratégia', 'RPO / RTO e custo'],
          rows: [
            {
              key: 'Backup and restore',
              cells: ['Horas. Custo $. Cargas de menor prioridade, todos os recursos criados após o evento.'],
            },
            { key: 'Pilot light', cells: ['Dezenas de minutos. Custo $$. Dados ao vivo, serviços parados.'] },
            {
              key: 'Warm standby',
              cells: ['Minutos. Custo $$$. Sempre rodando, porém menor, crítico para o negócio.'],
            },
            {
              key: 'Multi-site active/active',
              cells: ['Tempo real, perda de dados quase zero. Custo $$$$. Serviços de missão crítica.'],
            },
          ],
        },
      },
      {
        id: 'aws-backup',
        name: 'AWS Backup',
        link: pt.docs('aws-backup/latest/devguide/whatisbackup.html'),
        summary:
          'Backup central e baseado em políticas para EC2, EBS, RDS, Aurora, DynamoDB, EFS, FSx, S3 e outros, com cópias para outras Regiões e contas.',
        points: [
          '**Backup plans**: agenda, retenção e transição para cold storage, aplicados aos recursos por tags.',
          '**Cópia entre Regiões**: regras de cópia mandam cada recovery point para um vault na Região de DR, por agenda ou sob demanda.',
          '**Cópia entre contas**: cópias para vaults de outras contas da mesma organização no AWS Organizations protegem contra uma conta comprometida. A restauração ocorre depois da cópia para a conta de destino.',
          '**Vault Lock**: proteção WORM. O modo governance pode ser removido com permissões IAM. O modo compliance fica imutável depois de um período de carência de pelo menos 72 horas, até para o usuário root e para a AWS.',
          '**Audit Manager**: controles prontos e relatórios diários mostram se os backups seguem a política.',
        ],
        tip: '"Centralizar backups de muitas contas e copiá-los para outra Região": **AWS Backup** com Organizations. "Ransomware não pode apagar os backups": **Vault Lock em modo compliance** mais cópias para outra conta.',
      },
      {
        id: 'elastic-disaster-recovery',
        name: 'Elastic Disaster Recovery',
        fullName: 'AWS Elastic Disaster Recovery',
        link: pt.aws('disaster-recovery/'),
        summary:
          'Replicação contínua em nível de bloco de servidores on-premises, de outra nuvem ou de outra Região da AWS para uma área de staging de baixo custo na AWS.',
        points: [
          '**Metas**: RPO de segundos e RTO de minutos.',
          '**Área de staging**: os dados chegam a uma sub-rede de staging com armazenamento barato e computação mínima. Instâncias em capacidade total só sobem para testes ou recuperação.',
          '**Ponto no tempo**: recupere o estado mais recente ou um ponto anterior, por exemplo de antes de um ransomware.',
          '**Failback**: depois de corrigir o site principal, replique de volta e faça o failback quando quiser.',
          '**Escopo**: aplicações e bancos que rodam em servidores, não serviços gerenciados como o RDS. Segue o padrão pilot light.',
        ],
        tip: '"Replicar servidores on-premises para a AWS com RPO de segundos e RTO de minutos": **Elastic Disaster Recovery**. O AWS Backup é o distrator: faz backups pontuais, não replicação contínua.',
      },
      {
        id: 's3-replication',
        name: 'Replicação no S3',
        fullName: 'Amazon S3 Replication',
        link: pt.docs('AmazonS3/latest/userguide/replication.html'),
        summary:
          'Cópia assíncrona de objetos para buckets em outra Região (CRR) ou na mesma Região (SRR), da mesma conta ou de outra.',
        points: [
          '**Requisitos**: versionamento na origem e no destino e uma role IAM que permita ao S3 replicar. Object Lock na origem exige Object Lock no destino.',
          '**Só objetos novos**: a replicação ao vivo copia o que for gravado depois da regra. Use **S3 Batch Replication** para objetos existentes, falhas e réplicas de réplicas.',
          '**Exclusões**: delete markers não são replicados por padrão nas regras atuais, e apagar uma versão específica nunca é replicado, o que protege a cópia contra exclusões maliciosas.',
          '**S3 Replication Time Control**: replica a maioria dos objetos em segundos com SLA de 15 minutos, mais métricas e eventos para objetos atrasados.',
          '**CRR vs SRR**: CRR para distância exigida por compliance, menor latência e DR. SRR para juntar logs, copiar de produção para teste e soberania de dados dentro de uma Região.',
        ],
        tip: '"Copiar objetos para outra Região em até 15 minutos previsíveis": **CRR com S3 RTC**. "Objetos que já existiam antes da regra não foram copiados": **Batch Replication**.',
      },
      {
        id: 'database-replication',
        name: 'Replicação de bancos',
        link: pt.docs('AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html'),
        summary:
          'Replicação gerenciada entre Regiões para dados relacionais e NoSQL mantém o RPO baixo sem você construir pipelines próprios.',
        points: [
          '**Aurora Global Database**: 1 Região primária e até 10 Regiões secundárias somente leitura, replicação no nível do storage normalmente abaixo de 1 segundo. Uma secundária assume as escritas em menos de 1 minuto.',
          '**Switchover vs failover**: o switchover move a primária sem perda de dados em operações planejadas. O failover recupera de uma queda da Região primária.',
          '**Write forwarding**: clusters Aurora secundários podem encaminhar comandos de escrita para o primário.',
          '**DynamoDB global tables**: multiativo, toda réplica aceita leitura e escrita. A consistência eventual entre Regiões (padrão) resolve conflitos pela última escrita, e a consistência forte entre Regiões é o outro modo. SLA de 99,999% de disponibilidade.',
          '**Réplicas de leitura do RDS entre Regiões**: assíncronas, promovidas manualmente no DR, o que leva alguns minutos e inclui um reboot.',
        ],
        tip: '"Banco relacional, queda de Região, RPO de segundos e RTO abaixo de 1 minuto": **Aurora Global Database**. "Usuários em várias Regiões precisam escrever localmente": **DynamoDB global tables**.',
        table: {
          title: 'Opções de dados entre Regiões',
          head: ['Serviço', 'Papel no DR'],
          rows: [
            {
              key: 'Aurora Global Database',
              cells: ['Escrita global: uma Região escreve, leitoras em até 10 outras.'],
            },
            { key: 'DynamoDB global tables', cells: ['Escrita local: ativo-ativo em todas as Regiões.'] },
            { key: 'Réplica de leitura do RDS', cells: ['Banco do pilot light, promoção manual.'] },
            { key: 'S3 CRR', cells: ['Objetos, regras nos dois sentidos para buckets ativo-ativo.'] },
          ],
        },
      },
      {
        id: 'ebs-snapshots',
        name: 'Snapshots do EBS',
        fullName: 'Amazon EBS snapshots',
        link: pt.docs('ebs/latest/userguide/ebs-snapshots.html'),
        summary:
          'Backups de bloco incrementais e pontuais, guardados no S3 e replicados entre as AZs da Região, base do backup e restore de EC2.',
        points: [
          '**Incremental**: só os blocos alterados são salvos. A AWS não faz backup dos volumes sozinha, então agende os snapshots.',
          '**Cópia entre Regiões**: copie snapshots concluídos e AMIs para a Região de DR. A primeira cópia para uma Região é completa, as seguintes podem ser incrementais.',
          '**Data Lifecycle Manager**: automatiza criação, retenção e exclusão de snapshots e AMIs com EBS, inclusive cópias para outras Regiões ou contas, sem custo adicional.',
          '**Fast snapshot restore**: volumes criados a partir do snapshot já nascem totalmente inicializados, sem latência na primeira leitura. Cobrado por snapshot, por AZ, por hora.',
          '**Recycle Bin**: recupera snapshots, volumes e AMIs com EBS apagados por engano antes do fim do período de retenção.',
        ],
        tip: '"Automatizar snapshots diários do EBS e copiá-los para outra Região sem custo extra": **Data Lifecycle Manager**. Escolha o **AWS Backup** quando o escopo cobre muitos serviços e contas.',
      },
      {
        id: 'regional-failover',
        name: 'Failover entre Regiões',
        link: pt.docs('r53recovery/latest/dg/what-is-route53-recovery.html'),
        summary:
          'Levar os usuários para a Região de recuperação exige roteamento de tráfego, capacidade que de fato consiga subir e a mesma configuração nas duas Regiões.',
        points: [
          '**Roteamento failover do Route 53**: health checks trocam as respostas DNS para a Região de DR automaticamente, uma operação de data plane.',
          '**Routing controls do ARC**: chaves liga/desliga apoiadas em health checks do Route 53 para um failover iniciado manualmente e roteirizado.',
          '**Global Accelerator**: IPs anycast estáticos na frente de endpoints em várias Regiões. Health checks redirecionam o tráfego sem o atraso do cache de DNS.',
          '**Service quotas na Região standby**: aumente com antecedência para que o pilot light ou o warm standby escale até o tamanho de produção.',
          '**Infraestrutura como código**: CloudFormation (StackSets entre contas e Regiões) e golden AMIs copiadas para as duas Regiões reconstroem o ambiente de forma consistente. Teste o plano com frequência.',
        ],
        tip: '"A Região de DR não conseguiu escalar no teste": as **service quotas** não foram aumentadas lá. "Clientes guardam DNS em cache e o failover demora": **Global Accelerator** em vez de failover por DNS.',
      },
    ],
  },
]
