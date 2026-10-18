import { en, pt } from '../links'
import type { Topic } from '../types'

export const enUS: readonly Topic[] = [
  {
    slug: 'databases',
    group: 'performing',
    icon: 'database',
    title: 'Databases',
    summary:
      'Choosing and scaling RDS, Aurora, DynamoDB and ElastiCache, the purpose-built engines, connection proxies and migrations.',
    lede: 'Matching the engine to the access pattern, then scaling it for reads, writes and connections. Part of **Domain 3: Design High-Performing Architectures**, 24% of the scored content.',
    sections: [
      {
        id: 'rds',
        name: 'Amazon RDS',
        fullName: 'Amazon Relational Database Service',
        link: en.aws('rds/'),
        summary:
          'Managed relational databases on instances that you size. You choose the engine, the instance class and the storage, and AWS runs patching, backups and failover.',
        points: [
          '**Engines**: Db2, MariaDB, MySQL, Oracle, PostgreSQL and SQL Server. Pick **PostgreSQL** for advanced SQL, extensions and complex queries, **MySQL** or **MariaDB** for simple, widely supported web workloads, and Oracle or SQL Server when licenses or features require them.',
          '**Instance classes**: general purpose (`db.m*`), memory optimized (`db.r*`, `db.x*`, `db.z1d`), burstable (`db.t*`) and Optimized Reads classes with local NVMe. Scale up by changing the class.',
          '**Read replicas**: asynchronous copies that serve reads, up to 15 per source (Db2 up to 3). They can live in another AZ or another Region and can be promoted to a standalone instance for DR. RDS does not add or remove replicas automatically.',
          '**Storage autoscaling**: grows storage when free space is at or below 10% for at least 5 minutes, up to the maximum storage threshold you set. It never shrinks storage.',
          '**Magnetic storage** is deprecated. New instances use gp3 or Provisioned IOPS SSD.',
        ],
        tip: '"Reporting queries slow down the production database" -> **read replica**, not Multi-AZ (the Multi-AZ standby instance serves no reads). "Consistent low-latency I/O for OLTP" -> **Provisioned IOPS (io2 Block Express)**, not gp2.',
        table: {
          title: 'RDS storage types',
          head: ['Type', 'When to use'],
          rows: [
            {
              key: 'gp3',
              cells: [
                'Default choice. Baseline 3,000 IOPS and 125 MiB/s, more provisioned independently of size (up to 64,000 IOPS).',
              ],
            },
            {
              key: 'gp2',
              cells: ['Previous generation. 3 IOPS per GiB, bursts to 3,000 IOPS on small volumes.'],
            },
            {
              key: 'io2 Block Express',
              cells: [
                'I/O-intensive OLTP. Up to 256,000 IOPS with sub-millisecond latency. Recommended Provisioned IOPS type.',
              ],
            },
            {
              key: 'io1',
              cells: ['Previous generation Provisioned IOPS. Up to 256,000 IOPS, single-digit ms latency.'],
            },
          ],
        },
      },
      {
        id: 'aurora',
        name: 'Amazon Aurora',
        link: en.aws('rds/aurora/'),
        summary:
          'MySQL and PostgreSQL compatible engine with a distributed storage layer shared by the writer and all readers, which makes replicas cheap and failover fast.',
        points: [
          '**Storage**: 6 copies of the data across 3 AZs in a cluster volume that grows automatically, up to 256 TiB on recent engine versions.',
          '**Aurora Replicas**: up to 15 per cluster, lag usually much less than 100 ms. The **reader endpoint** spreads connections across them and failover promotes one by priority (tier 0 is highest).',
          '**Aurora Serverless v2**: capacity in ACUs (about 2 GiB of memory each) from 0 to 256, scaling in steps as small as 0.5 ACU. At 0 ACU the instance pauses on supported versions.',
          '**Global Database**: up to 10 secondary Regions with replication typically under 1 second, RPO of 1 second and RTO under 1 minute. Up to 16 read-only instances per secondary. Write forwarding sends writes to the primary.',
          '**I/O-Optimized**: no charge for read and write I/O. Worth it when I/O is 25% or more of the Aurora bill (savings up to 40%). Standard to I/O-Optimized once every 30 days.',
        ],
        tip: '"Unpredictable or spiky relational load, pay for what is used" -> **Aurora Serverless v2**. "Global reads with sub-second lag and Regional DR" -> **Aurora Global Database**, not cross-Region RDS read replicas.',
      },
      {
        id: 'dynamodb',
        name: 'Amazon DynamoDB',
        link: en.aws('dynamodb/'),
        summary:
          'Serverless key-value and document database with single-digit millisecond latency at any scale. Performance depends on capacity mode and on how evenly the partition key spreads traffic.',
        points: [
          '**On-demand**: pay per request, no capacity planning, for unknown or spiky traffic. **Provisioned**: set RCUs and WCUs, with auto scaling, for predictable traffic at lower cost. Provisioned to on-demand up to 4 times per 24 hours, back at any time.',
          '**RCU**: 1 strongly consistent read or 2 eventually consistent reads per second of an item up to 4 KB. **WCU**: 1 write per second of an item up to 1 KB. Transactions cost 2x.',
          '**Partition key**: choose a high-cardinality attribute (user ID, device ID) so requests spread across partitions. A low-cardinality key creates **hot partitions** and throttling.',
          '**Item size**: up to 400 KB. Store large objects in S3 and keep the key in the item.',
          '**PITR**: restore to any second in a recovery period you set from 1 to 35 days.',
        ],
        tip: '"Millions of requests per second, schemaless, single-digit ms" -> **DynamoDB**, not RDS. Throttling on a few keys points to a **bad partition key**, not to a lack of total capacity.',
      },
      {
        id: 'dynamodb-features',
        name: 'DynamoDB features',
        link: en.aws('dynamodb/features/'),
        summary:
          'Indexes, caching, change streams, expiry and multi-Region replication extend DynamoDB beyond simple key lookups.',
        points: [
          '**GSI**: different partition and sort key, created at any time, eventually consistent reads only, its own capacity. Default quota of 20 per table.',
          '**LSI**: same partition key, different sort key, created only with the table, supports strongly consistent reads. Up to 5 per table and 10 GB per partition key value.',
          '**DAX**: in-memory cache in front of DynamoDB, API compatible, microsecond reads, up to 10x faster.',
          '**Streams**: ordered item changes kept for 24 hours, consumed by Lambda for event-driven processing. **TTL** deletes expired items within a few days, without consuming write throughput.',
          '**Global tables**: multi-active, multi-Region replicas. Default **MREC** replicates typically within a second. **MRSC** gives strong consistency across Regions, chosen at creation.',
        ],
        tip: '"Read-heavy DynamoDB, microsecond latency, no code change" -> **DAX**, not ElastiCache. "Query by another attribute after the table exists" -> **GSI** (an LSI cannot be added later).',
      },
      {
        id: 'elasticache',
        name: 'Amazon ElastiCache',
        link: en.aws('elasticache/'),
        summary:
          'Managed in-memory cache with Valkey, Redis OSS or Memcached. It offloads repeated reads from databases and stores sessions, with node-based or serverless deployment.',
        points: [
          '**Valkey or Redis OSS**: replication, automatic failover across AZs, backup and restore, pub/sub and sorted sets (leaderboards). **Global Datastore** replicates across Regions.',
          '**Memcached**: multithreaded and simple, no replication and no failover. Fits a plain object cache that can be lost.',
          '**Lazy loading** (cache-aside): read the cache, on a miss read the database and fill the cache. Only requested data is cached, but data can be stale and misses cost 3 trips.',
          '**Write-through**: update the cache on every database write. Data is never stale, but every write takes 2 trips and unread data fills the cache.',
          '**TTL**: add an expiry to either strategy to bound staleness and free memory.',
        ],
        tip: '"Leaderboard, sorted ranking, HA cache, session store with failover" -> **ElastiCache for Valkey or Redis OSS**. "Simple multithreaded cache, no persistence" -> **Memcached**.',
      },
      {
        id: 'purpose-built',
        name: 'Purpose-built databases',
        link: en.aws('products/databases/'),
        summary:
          'Each data model has its own managed engine. The exam describes the data and the queries and expects the matching service.',
        points: [
          '**Amazon DocumentDB**: JSON documents with MongoDB compatibility.',
          '**Amazon Keyspaces**: serverless, Apache Cassandra compatible wide-column store.',
          '**Amazon Neptune**: graph database for highly connected data, queried with Gremlin, openCypher or SPARQL.',
          '**Amazon Redshift**: columnar data warehouse for analytics (OLAP) over large data sets, not for transactions.',
        ],
        tip: '"Migrate MongoDB with minimal changes" -> **DocumentDB**. "Cassandra workload, no servers" -> **Keyspaces**. "Social network, fraud rings, recommendations" -> **Neptune**.',
        table: {
          title: 'Requirement to database',
          head: ['Requirement', 'Choice'],
          rows: [
            { key: 'Relational, joins, transactions', cells: ['**RDS** or **Aurora**'] },
            { key: 'Key-value at any scale', cells: ['**DynamoDB**'] },
            { key: 'Sub-millisecond cache', cells: ['**ElastiCache**, or **DAX** for DynamoDB'] },
            { key: 'Documents (MongoDB)', cells: ['**DocumentDB**'] },
            { key: 'Wide-column (Cassandra)', cells: ['**Keyspaces**'] },
            { key: 'Graph relationships', cells: ['**Neptune**'] },
            { key: 'Analytics on terabytes', cells: ['**Redshift**'] },
          ],
        },
      },
      {
        id: 'rds-proxy',
        name: 'RDS Proxy',
        fullName: 'Amazon RDS Proxy',
        link: en.aws('rds/proxy/'),
        summary:
          'Managed connection pool between the application and the database. It absorbs connection storms and keeps connections open during failover.',
        points: [
          '**Connection pooling**: many short-lived clients (Lambda functions) share a small set of database connections.',
          '**Failover**: reduces failover time by up to 66% for Aurora and RDS.',
          '**Security**: credentials stay in AWS Secrets Manager and IAM authentication can be enforced. The proxy is never publicly accessible and runs in the database VPC.',
          '**Engines**: Aurora MySQL, Aurora PostgreSQL, RDS for MySQL, PostgreSQL, MariaDB and SQL Server.',
        ],
        tip: '"Lambda functions exhaust database connections" or "too many connections errors" -> **RDS Proxy**, not a larger instance class.',
      },
      {
        id: 'migration',
        name: 'Database migration',
        fullName: 'AWS Database Migration Service',
        link: en.aws('dms/'),
        summary:
          'AWS DMS moves data into AWS while the source stays operational. Changing the engine also requires converting the schema and code.',
        points: [
          '**Homogeneous**: same engine (MySQL to RDS for MySQL). DMS or the native engine tools move the data.',
          '**Heterogeneous**: different engine (Oracle to Aurora PostgreSQL). Convert schema and code with **DMS Schema Conversion** or the **AWS Schema Conversion Tool**, then move the data with DMS.',
          '**CDC**: change data capture keeps replicating ongoing changes for a near-zero downtime cutover.',
          '**Source stays online**: applications keep using the source during the migration.',
        ],
        tip: '"Oracle to PostgreSQL with minimal downtime" -> **DMS Schema Conversion (or SCT) + DMS with CDC**. DMS alone does not convert stored procedures or schema.',
      },
    ],
  },
  {
    slug: 'networking',
    group: 'performing',
    icon: 'network',
    title: 'Networking',
    summary:
      'VPC design, egress, VPC-to-VPC connectivity, PrivateLink and hybrid links with Site-to-Site VPN, Client VPN and Direct Connect.',
    lede: 'Designing subnets, routing and connections that scale with the workload and reach on premises networks. Part of **Domain 3: Design High-Performing Architectures**, 24% of the scored content.',
    sections: [
      {
        id: 'vpc-design',
        name: 'VPC design',
        fullName: 'Amazon Virtual Private Cloud',
        link: en.aws('vpc/'),
        summary:
          'A VPC is a private network in one Region, divided into subnets that each live in one AZ. Address planning and subnet tiers decide how far it can grow.',
        points: [
          '**CIDR**: IPv4 blocks from /16 to /28. Add more blocks later (5 per VPC by default, adjustable up to 50). Avoid overlapping ranges with networks you will connect to.',
          '**Reserved addresses**: AWS keeps 5 IPs in every subnet (the first 4 and the last one).',
          '**Subnet tiers**: public (load balancers, NAT), private (application) and data (databases), each repeated in at least 2 AZs.',
          '**Route tables**: a subnet is **public** when its route table has a route to an internet gateway. Private subnets route outbound traffic through NAT.',
          '**VPC Flow Logs**: IP traffic metadata to CloudWatch Logs, S3 or Data Firehose for troubleshooting.',
        ],
        tip: '"Running out of IPs in the VPC" -> **add a secondary CIDR block**, not a new VPC. A /28 subnet has only 11 usable addresses because 5 are reserved.',
      },
      {
        id: 'internet-egress',
        name: 'Internet and egress',
        link: en.docs('vpc/latest/userguide/vpc-nat-gateway.html'),
        summary:
          'Internet gateways give public subnets two-way internet access. NAT and egress-only gateways let private resources reach out without being reachable.',
        points: [
          '**Internet gateway**: horizontally scaled, redundant and highly available, no bandwidth constraint. No charge for the gateway itself, only data transfer.',
          '**NAT gateway (zonal)**: IPv4 outbound for private subnets, 5 Gbps scaling to 100 Gbps. Create one per AZ so an AZ failure does not cut egress for the others.',
          '**NAT gateway (regional mode)**: one NAT gateway ID that expands across the AZs where workloads run, without a public subnet.',
          '**Egress-only internet gateway**: IPv6 outbound only and stateful. IPv6 addresses are public, so this is the IPv6 equivalent of NAT.',
          '**Elastic IP**: static public IPv4, 5 per Region by default. AWS charges for every public IPv4 address, in use or idle.',
        ],
        tip: '"Private instances need patches from the internet, highly available" -> **NAT gateway in each AZ**, not a NAT instance. "IPv6 outbound only" -> **egress-only internet gateway**.',
      },
      {
        id: 'vpc-to-vpc',
        name: 'Peering and Transit Gateway',
        link: en.aws('transit-gateway/'),
        summary:
          'Peering links two VPCs directly. AWS Transit Gateway is a Regional hub that scales to many VPCs and on premises connections.',
        points: [
          '**VPC peering**: one-to-one, across accounts and Regions, no single point of failure or bandwidth bottleneck. **Not transitive** and no overlapping CIDRs. 50 active peerings per VPC by default, up to 125.',
          '**Transit Gateway**: hub and spoke router for VPCs, Site-to-Site VPN, Direct Connect gateways and Transit Gateway Connect. Up to 100 Gbps per VPC attachment per AZ.',
          '**Route tables** on the transit gateway segment traffic (for example, keep prod and dev apart).',
          '**Peering attachments** connect transit gateways across Regions. Share a transit gateway with other accounts through AWS RAM.',
          '**ECMP** over several VPN tunnels with BGP aggregates VPN bandwidth to the transit gateway.',
        ],
        tip: '"Dozens of VPCs and on premises sites, full mesh is unmanageable" -> **Transit Gateway**. "Two VPCs, lowest cost, no transit" -> **VPC peering**. A peered VPC never forwards traffic for a third one.',
      },
      {
        id: 'privatelink',
        name: 'PrivateLink and endpoints',
        fullName: 'AWS PrivateLink',
        link: en.aws('privatelink/'),
        summary:
          'Private access to AWS services and to services in other VPCs without internet gateways, NAT or peering. Traffic stays on the AWS network.',
        points: [
          '**Interface endpoint**: network interfaces with private IPs in your subnets for an AWS service or an endpoint service, resolved through DNS.',
          '**Endpoint service**: expose your own application behind a Network Load Balancer to consumers in other VPCs or accounts. Works with overlapping CIDRs because only the endpoint is shared.',
          '**Gateway endpoint**: only for S3 and DynamoDB, no extra cost, a route in the route table, same Region only. It is not PrivateLink.',
          '**Consumer initiated**: the consumer opens the connection and the provider accepts or rejects the request.',
        ],
        tip: '"Expose one service to hundreds of customer VPCs with overlapping CIDRs" -> **PrivateLink endpoint service**, not peering. "EC2 to S3 without NAT, no cost" -> **gateway endpoint**.',
      },
      {
        id: 'vpn',
        name: 'VPN options',
        link: en.aws('vpn/site-to-site-vpn/'),
        summary:
          'Encrypted IPsec tunnels over the internet. Site-to-Site VPN joins networks, Client VPN connects individual users.',
        points: [
          '**Site-to-Site VPN**: 2 tunnels per connection, each in a different AZ. Ends on a virtual private gateway or a transit gateway, with a customer gateway on premises.',
          '**Bandwidth**: up to 1.25 Gbps per standard tunnel. **Large Bandwidth Tunnels** reach up to 5 Gbps on transit gateway or Cloud WAN attachments.',
          '**Accelerated Site-to-Site VPN**: enters the AWS global network at the nearest edge through Global Accelerator. Requires a transit gateway.',
          '**AWS Client VPN**: managed, OpenVPN-based remote access for users, authenticated with Active Directory, SAML federation or mutual certificates.',
        ],
        tip: '"Connect the office this week, encrypted, low cost" -> **Site-to-Site VPN**. "Remote employees on laptops" -> **Client VPN**. More than 1.25 Gbps over VPN -> **ECMP on a transit gateway** or Large Bandwidth Tunnels.',
      },
      {
        id: 'direct-connect',
        name: 'Direct Connect',
        fullName: 'AWS Direct Connect',
        link: en.aws('directconnect/'),
        summary:
          'A private, dedicated link from your network to AWS that bypasses the internet, for consistent bandwidth and latency.',
        points: [
          '**Dedicated connection**: 1, 10, 100 or 400 Gbps port. **Hosted connection**: 50 Mbps to 25 Gbps through a partner.',
          '**Not encrypted by default**: use **MACsec** on 10, 100 and 400 Gbps dedicated connections at supported locations, or run an IPsec VPN over Direct Connect.',
          '**Virtual interfaces**: private VIF to a VPC, public VIF to AWS public services, transit VIF to transit gateways.',
          '**Direct Connect gateway**: global resource that links one connection to VPCs in many Regions (except China). It does not route VPC to VPC.',
          '**Resiliency**: maximum resiliency (separate devices in more than 1 location, 99.99% SLA) or high resiliency (connections at multiple locations, 99.9%). A Site-to-Site VPN is the low-cost backup.',
        ],
        tip: '"Consistent throughput, large daily transfers, no internet" -> **Direct Connect**. "Needed now" is a VPN, because a new connection takes time to provision. "Encrypted private link" -> **DX + IPsec VPN** or MACsec.',
        table: {
          title: 'Hybrid connectivity',
          head: ['Option', 'Fits when'],
          rows: [
            { key: 'Site-to-Site VPN', cells: ['Fast setup, encrypted, over the internet, variable latency.'] },
            { key: 'Client VPN', cells: ['Individual users connecting from their devices.'] },
            { key: 'Direct Connect', cells: ['Private, consistent bandwidth and latency, high volume.'] },
            { key: 'Direct Connect + VPN', cells: ['Encryption over DX, or VPN as the backup path for DX.'] },
          ],
        },
      },
      {
        id: 'load-balancing',
        name: 'Load balancer choice',
        fullName: 'Elastic Load Balancing',
        link: en.aws('elasticloadbalancing/'),
        summary:
          'Pick the load balancer by protocol layer and requirement. High availability and health checks are covered in the resilience notes.',
        points: [
          '**Application Load Balancer**: layer 7, HTTP and HTTPS, routing by path, host and headers, containers and Lambda targets.',
          '**Network Load Balancer**: layer 4 (TCP, UDP, TLS, QUIC), millions of requests per second, a static IP per AZ and optional Elastic IPs.',
          '**Gateway Load Balancer**: layer 3, inserts third-party appliances (firewalls, IDS) using GENEVE on port 6081.',
        ],
        tip: '"Path-based routing to microservices" -> **ALB**. "Static IP for allowlisting, UDP, extreme throughput" -> **NLB**. "Inline third-party firewall fleet" -> **Gateway Load Balancer**.',
      },
    ],
  },
  {
    slug: 'edge',
    group: 'performing',
    icon: 'globe',
    title: 'Edge and DNS',
    summary:
      'Route 53 records and routing policies, CloudFront caching and security, edge functions, Global Accelerator and S3 Transfer Acceleration.',
    lede: 'Bringing content and endpoints closer to global users and steering traffic by latency, location and health. Part of **Domain 3: Design High-Performing Architectures**, 24% of the scored content.',
    sections: [
      {
        id: 'route53-records',
        name: 'Route 53 records',
        fullName: 'Amazon Route 53',
        link: en.docs('Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html'),
        summary:
          'Route 53 hosts public and private DNS zones. The alias record is the AWS extension that the exam tests most.',
        points: [
          '**Common types**: A (IPv4), AAAA (IPv6), CNAME, MX, NS, SOA, TXT, CAA, SRV, PTR. AWS recommends TXT instead of SPF records.',
          '**CNAME**: maps a name to another name, never at the zone apex (`example.com`).',
          '**Alias**: points to AWS resources (CloudFront, ELB, S3 website, API Gateway, Global Accelerator, VPC interface endpoint or another record in the zone), works at the apex and queries to AWS resources are free.',
          '**Private hosted zone**: DNS names resolvable only inside associated VPCs.',
        ],
        tip: '"Point the root domain to a load balancer or CloudFront" -> **alias record**, never a CNAME. Alias also avoids query charges.',
      },
      {
        id: 'route53-routing',
        name: 'Routing policies',
        link: en.docs('Route53/latest/DeveloperGuide/routing-policy.html'),
        summary:
          'The routing policy decides which record answers each DNS query. Combined with health checks it gives DNS-level failover and traffic steering.',
        points: [
          '**Geolocation** answers by the user location (continent, country, state). Add a **default** record or unmatched users get no answer.',
          '**Geoproximity** routes by distance to resources and shifts load with a **bias** from -99 to +99.',
          '**Multivalue answer** returns up to 8 healthy records at random. It is not a substitute for a load balancer.',
          '**IP-based** routes by the client CIDR (CIDR collections), useful for ISP-specific routing. Not available in private hosted zones.',
        ],
        tip: '"Lowest latency for global users" -> **latency**, not geolocation. "Content rights or language by country" -> **geolocation**. "Send 10% to the new version" -> **weighted**.',
        table: {
          title: 'Route 53 routing policies',
          head: ['Policy', 'Use it for'],
          rows: [
            { key: 'Simple', cells: ['A single resource, no health checks on the answer.'] },
            { key: 'Weighted', cells: ['Splitting traffic by percentage: canary, blue/green, A/B tests.'] },
            { key: 'Latency', cells: ['Sending users to the Region with the lowest latency for them.'] },
            { key: 'Failover', cells: ['Active-passive: primary while healthy, secondary otherwise.'] },
            { key: 'Geolocation', cells: ['Answering by the user location: compliance, localization.'] },
            { key: 'Geoproximity', cells: ['Routing by distance, with a bias to grow or shrink a region.'] },
            { key: 'IP-based', cells: ['Routing by the client IP range you know (CIDR collections).'] },
            { key: 'Multivalue answer', cells: ['Up to 8 healthy records returned at random.'] },
          ],
        },
      },
      {
        id: 'route53-health',
        name: 'Health checks',
        link: en.docs('Route53/latest/DeveloperGuide/dns-failover.html'),
        summary:
          'Route 53 health checks remove unhealthy endpoints from DNS answers, which drives failover between Regions.',
        points: [
          '**Endpoint check**: health checkers around the world probe an IP or domain. The endpoint is healthy when more than 18% of them report it healthy.',
          '**Calculated check**: combines the results of other health checks.',
          '**CloudWatch alarm check**: follows an alarm. Required for resources with only private IPs, because the checkers run outside the VPC.',
          '**Failover routing** uses the check on the primary record to switch to the secondary (for example, a static S3 site).',
        ],
        tip: '"Fail over to a backup Region automatically when the primary is unhealthy" -> **failover routing + health check**. "Health of a private resource" -> **CloudWatch alarm based check**.',
      },
      {
        id: 'cloudfront',
        name: 'Amazon CloudFront',
        link: en.aws('cloudfront/'),
        summary:
          'Content delivery network with more than 750 points of presence and 15 Regional edge caches. It caches static and dynamic content close to users and protects the origin.',
        points: [
          '**Origins**: S3 bucket, S3 website, ALB, NLB, EC2, API Gateway, Lambda function URL, MediaPackage or any HTTP server. **VPC origins** reach ALB, NLB and EC2 in private subnets.',
          '**Cache behaviors**: path patterns (`/images/*`, `/api/*`) map to origins and cache policies. Defaults: min TTL 0, default TTL 86,400 s (24 hours), max TTL 31,536,000 s (1 year).',
          '**Origin Shield**: an extra caching layer that reduces load on the origin.',
          '**Origin failover**: an origin group with primary and secondary origins, for GET, HEAD and OPTIONS requests.',
          '**HTTPS**: the ACM certificate for a custom domain must be in `us-east-1`.',
        ],
        tip: '"Global users, static content from S3, lower latency and lower origin load" -> **CloudFront**. A cache hit ratio problem points to **cache policy and TTLs**, not to a bigger origin.',
      },
      {
        id: 'cloudfront-security',
        name: 'Restricting content',
        link: en.docs('AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html'),
        summary:
          'CloudFront can keep the origin private, require signed access, block countries and encrypt sensitive fields at the edge.',
        points: [
          '**Origin access control (OAC)**: the S3 bucket accepts only requests signed by CloudFront. Supports SSE-KMS and PUT/DELETE. The legacy origin access identity (OAI) is not recommended.',
          '**Signed URLs**: one URL per file, or clients that do not support cookies. **Signed cookies**: many restricted files without changing URLs. Sign with **trusted key groups**.',
          '**Geographic restrictions**: allow list or block list of countries for the whole distribution.',
          '**Field-level encryption**: encrypts up to 10 POST fields at the edge with a public key, so only the backend with the private key reads them.',
          '**AWS WAF** and **Shield Standard** protect the distribution at the edge.',
        ],
        tip: '"Users must not reach the S3 bucket directly" -> **OAC**. "Paid video library, many files per subscriber" -> **signed cookies**. "One download link" -> **signed URL**, not presigned S3 URLs when CloudFront is in front.',
      },
      {
        id: 'edge-functions',
        name: 'Edge functions',
        link: en.docs('AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html'),
        summary:
          'Code that runs in CloudFront to change requests and responses. CloudFront Functions are light and cheap, Lambda@Edge is more capable.',
        points: [
          '**CloudFront Functions**: JavaScript, viewer request and viewer response only, sub-millisecond, 10 KB max size, no network access, millions of requests per second.',
          '**Lambda@Edge**: Node.js or Python, viewer and origin events, network access, up to 30 s, created in `us-east-1`.',
          '**Typical CloudFront Functions jobs**: header manipulation, URL rewrites and redirects, cache key normalization, simple token checks.',
          '**Typical Lambda@Edge jobs**: calls to external services, larger bodies, origin selection, logic that needs more memory or time.',
        ],
        tip: '"Rewrite URLs or add headers at massive scale, lowest cost" -> **CloudFront Functions**. "Call a third-party API or change the origin request" -> **Lambda@Edge**.',
        table: {
          title: 'CloudFront Functions or Lambda@Edge',
          head: ['Aspect', 'CloudFront Functions and Lambda@Edge'],
          rows: [
            {
              key: 'Events',
              cells: [
                '**CloudFront Functions**: viewer request and response.',
                '**Lambda@Edge**: viewer and origin request and response.',
              ],
            },
            { key: 'Runtime', cells: ['**CloudFront Functions**: JavaScript.', '**Lambda@Edge**: Node.js, Python.'] },
            {
              key: 'Duration',
              cells: ['**CloudFront Functions**: sub-millisecond.', '**Lambda@Edge**: up to 30 seconds.'],
            },
            { key: 'Network access', cells: ['**CloudFront Functions**: no.', '**Lambda@Edge**: yes.'] },
            {
              key: 'Memory',
              cells: ['**CloudFront Functions**: 2 MB.', '**Lambda@Edge**: 128 MB (viewer) up to 10,240 MB (origin).'],
            },
          ],
        },
      },
      {
        id: 'global-accelerator',
        name: 'Global Accelerator',
        fullName: 'AWS Global Accelerator',
        link: en.aws('global-accelerator/'),
        summary:
          'Static anycast IP addresses that send users onto the AWS global network at the nearest edge and on to healthy Regional endpoints. No caching.',
        points: [
          '**Static IPs**: 2 anycast IPv4 addresses (4 with dual stack) that never change while endpoints move behind them.',
          '**Protocols**: TCP and UDP, so it fits gaming, IoT (MQTT) and VoIP that CloudFront does not serve.',
          '**Endpoints**: ALB, NLB, EC2 instances and Elastic IPs in one or more Regions.',
          '**Failover**: detects an unhealthy endpoint and takes it out of service in less than 1 minute, with no DNS caching delay.',
          '**Traffic dials** per Region and **weights** per endpoint, plus client affinity.',
        ],
        tip: '"Static IPs for allowlisting, UDP, fast Regional failover" -> **Global Accelerator**. "Cache content at the edge, HTTP" -> **CloudFront**. Both use the edge, only CloudFront caches.',
      },
      {
        id: 'transfer-acceleration',
        name: 'S3 Transfer Acceleration',
        fullName: 'Amazon S3 Transfer Acceleration',
        link: en.docs('AmazonS3/latest/userguide/transfer-acceleration.html'),
        summary:
          'Faster uploads and downloads to a bucket over long distances, entering the AWS network at a CloudFront edge location.',
        points: [
          '**Endpoint**: `bucketname.s3-accelerate.amazonaws.com` (or the dual-stack endpoint).',
          '**Bucket name**: must be DNS-compliant without periods.',
          '**Pricing**: you pay only for accelerated transfers. If it would not be faster, there is no charge.',
          '**Speed Comparison tool** shows the gain for your location before you enable it.',
        ],
        tip: '"Users on other continents upload large files to one bucket" -> **S3 Transfer Acceleration**, combined with **multipart upload** for large objects. Not CloudFront, which is mainly for delivery.',
      },
    ],
  },
  {
    slug: 'data-analytics',
    group: 'performing',
    icon: 'chart',
    title: 'Data ingestion and analytics',
    summary:
      'Streaming with Kinesis and MSK, data lakes with Glue, Lake Formation and Athena, warehouses, visualization and data transfer.',
    lede: 'Ingesting, transforming and analyzing data at the right speed and size, from streams to data lakes and warehouses. Part of **Domain 3: Design High-Performing Architectures**, 24% of the scored content.',
    sections: [
      {
        id: 'kinesis-data-streams',
        name: 'Kinesis Data Streams',
        fullName: 'Amazon Kinesis Data Streams',
        link: en.aws('kinesis/data-streams/'),
        summary:
          'Real-time stream that stores records in shards so several consumers can read, and re-read, them in order.',
        points: [
          '**Shard**: writes up to 1 MB/s or 1,000 records/s, reads up to 2 MB/s shared by the consumers.',
          '**Enhanced fan-out**: each registered consumer gets its own 2 MB/s per shard.',
          '**Retention**: 24 hours by default, up to 365 days. Consumers can **replay** data.',
          '**Ordering**: the partition key picks the shard, records with the same key stay in order.',
          '**Capacity modes**: on-demand (scales automatically) or provisioned (you manage shards).',
        ],
        tip: '"Real-time, multiple consumers, replay, ordering per key" -> **Kinesis Data Streams**. Throttled writes -> **more shards** or a better partition key.',
      },
      {
        id: 'firehose',
        name: 'Amazon Data Firehose',
        link: en.aws('firehose/'),
        summary:
          'Fully managed delivery of streaming data to storage and analytics destinations, with buffering, transformation and format conversion. No shards to manage.',
        points: [
          '**Destinations**: S3, Redshift (staged in S3, then COPY), OpenSearch Service and Serverless, Splunk, Snowflake, Apache Iceberg tables and HTTP endpoints.',
          '**Buffering**: delivers when a size (1 to 128 MiB for S3) or time (0 to 900 s) threshold is reached, so it is near real time.',
          '**Format conversion**: JSON to **Parquet** or **ORC** using a schema from the Glue Data Catalog.',
          '**Transformation**: a Lambda function can transform records, for example CSV to JSON before conversion.',
          '**Sources** include direct PUT and Kinesis data streams.',
        ],
        tip: '"Load streaming data into S3 or Redshift with no code, near real time" -> **Data Firehose**. "Custom consumers, replay, milliseconds" -> **Kinesis Data Streams**.',
      },
      {
        id: 'msk-video',
        name: 'MSK and video streams',
        fullName: 'Amazon MSK and Amazon Kinesis Video Streams',
        link: en.aws('msk/'),
        summary: 'Managed Apache Kafka for teams already on Kafka, and a dedicated service for video from devices.',
        points: [
          '**Amazon MSK**: runs open-source Apache Kafka, so existing producers and consumers work without code changes.',
          '**MSK options**: provisioned (Standard or Express brokers), **MSK Serverless**, **MSK Connect** for connectors and MSK Replicator.',
          '**Kinesis Video Streams**: ingests, stores and indexes video from cameras for playback (HLS, MPEG-DASH), analytics and ML.',
          '**WebRTC** in Kinesis Video Streams supports two-way real-time media.',
        ],
        tip: '"Migrate an on premises Kafka cluster with minimal changes" -> **Amazon MSK**, not Kinesis. "Camera streams for analysis with Rekognition" -> **Kinesis Video Streams**.',
      },
      {
        id: 'data-lake',
        name: 'Glue and Lake Formation',
        fullName: 'AWS Glue and AWS Lake Formation',
        link: en.aws('glue/'),
        summary:
          'Glue discovers, catalogs and transforms data, and Lake Formation governs who can read which parts of the data lake in S3.',
        points: [
          '**Crawlers** infer schemas and populate the **Glue Data Catalog**, a Hive metastore compatible catalog used by Athena, EMR and Redshift Spectrum.',
          '**Glue ETL**: serverless Apache Spark jobs (batch or streaming). **Job bookmarks** avoid reprocessing old data. A typical job converts **CSV to Parquet**.',
          '**AWS Glue DataBrew**: visual data preparation without code.',
          '**Lake Formation**: permissions at database, table, column, row and cell level, **LF-Tags** for tag-based access and cross-account sharing.',
        ],
        tip: '"Convert CSV in S3 to Parquet on a schedule, serverless" -> **Glue ETL job**. "Column-level access to the data lake for different teams" -> **Lake Formation**, not bucket policies.',
      },
      {
        id: 'athena-quick',
        name: 'Athena and Quick',
        fullName: 'Amazon Athena and Amazon Quick',
        link: en.aws('athena/'),
        summary: 'Athena queries S3 with SQL without servers, and Amazon Quick turns the results into dashboards.',
        points: [
          '**Athena**: serverless SQL on S3, billed per TB scanned. Uses the Glue Data Catalog for tables.',
          '**Cut cost and time**: columnar formats (Parquet, ORC), compression and partitioning reduce the data scanned.',
          '**Federated Query**: Lambda-based connectors query sources outside S3 (relational, NoSQL).',
          '**Amazon Quick**: evolved from Amazon QuickSight. Its BI feature, **Amazon Quick Sight**, builds dashboards with the SPICE in-memory engine and natural language questions.',
        ],
        tip: '"Ad hoc SQL on logs in S3, no infrastructure" -> **Athena**. "Athena too slow and costly on CSV" -> **convert to Parquet and partition**. "Interactive BI dashboards" -> **Amazon Quick**.',
      },
      {
        id: 'processing',
        name: 'EMR, Redshift, OpenSearch',
        link: en.aws('redshift/'),
        summary:
          'Big data frameworks, the data warehouse and search and log analytics answer different questions about the same data.',
        points: [
          '**Amazon EMR**: managed Spark, Hive, Trino, Flink and Hadoop on EC2, EKS or Serverless. Primary, core and task nodes. Spot is common on task nodes, avoid it on core nodes (HDFS).',
          '**Amazon Redshift**: columnar warehouse for SQL analytics. **Redshift Serverless** bills by RPU usage. **Spectrum** queries S3 without loading.',
          '**Redshift features**: concurrency scaling, data sharing and **zero-ETL** from Aurora, RDS and DynamoDB.',
          '**Amazon OpenSearch Service**: full-text search and log analytics with OpenSearch Dashboards. UltraWarm and cold tiers, OpenSearch Serverless and Ingestion.',
        ],
        tip: '"Existing Spark or Hadoop jobs, full control of the cluster" -> **EMR**. "Complex SQL joins across terabytes for BI" -> **Redshift**. "Full-text search over logs or a catalog" -> **OpenSearch**.',
        table: {
          title: 'Which analytics service',
          head: ['Service', 'Best for'],
          rows: [
            { key: 'Athena', cells: ['Ad hoc SQL on S3, serverless, pay per query.'] },
            { key: 'Redshift', cells: ['Recurring BI and complex SQL on structured data.'] },
            { key: 'EMR', cells: ['Spark, Hadoop and other frameworks at large scale.'] },
            { key: 'Glue', cells: ['Serverless ETL and the Data Catalog.'] },
            { key: 'OpenSearch Service', cells: ['Search, log analytics, dashboards over text.'] },
            { key: 'Amazon Quick', cells: ['Visualization and BI dashboards.'] },
          ],
        },
      },
      {
        id: 'data-transfer',
        name: 'Data transfer',
        link: en.aws('datasync/'),
        summary:
          'Online services move data over the network on a schedule or protocol, physical options move it when the network is too slow.',
        points: [
          '**AWS DataSync**: online copies from NFS, SMB, HDFS, object storage and other clouds to S3, EFS and FSx, with encryption, integrity checks and scheduling. An agent is needed for on premises sources.',
          '**AWS Transfer Family**: managed SFTP, FTPS, FTP and AS2 endpoints into S3 or EFS, with your existing identity provider. FTP only on internal VPC endpoints.',
          '**AWS Snowball Edge**: since November 7, 2025, available only to existing customers, and support in commercial Regions ends on December 31, 2026.',
          '**AWS Data Transfer Terminal**: physical locations where you bring your own storage devices and upload over a high-bandwidth connection.',
        ],
        tip: '"Partners send files over SFTP into S3" -> **Transfer Family**. "Recurring sync of an NFS share to S3 or EFS" -> **DataSync**. Exam questions with petabytes and little bandwidth still point to **Snowball Edge**.',
        table: {
          title: 'Transfer option by need',
          head: ['Need', 'Choice'],
          rows: [
            { key: 'Online copy or recurring sync', cells: ['**DataSync**'] },
            { key: 'SFTP, FTPS, FTP, AS2 partners', cells: ['**Transfer Family**'] },
            {
              key: 'Offline, limited bandwidth',
              cells: ['**Snowball Edge** (existing customers) or **Data Transfer Terminal**'],
            },
            { key: 'SaaS application data', cells: ['**Amazon AppFlow**'] },
            { key: 'Third-party data sets', cells: ['**AWS Data Exchange**'] },
          ],
        },
      },
      {
        id: 'saas-data',
        name: 'AppFlow and Data Exchange',
        fullName: 'Amazon AppFlow and AWS Data Exchange',
        link: en.aws('appflow/'),
        summary: 'Managed ways to bring data from SaaS applications and from third-party providers into AWS.',
        points: [
          '**Amazon AppFlow**: no-code flows between SaaS apps (Salesforce, ServiceNow, Zendesk, Slack) and S3, Redshift or Snowflake, in both directions.',
          '**AppFlow triggers**: on demand, on a schedule or on an event. Transformations include filtering, masking, mapping and validation. Supports PrivateLink.',
          '**AWS Data Exchange**: find, subscribe to and use third-party data delivered as files, APIs, Redshift datashares or S3 data access.',
        ],
        tip: '"Import Salesforce data into S3 daily without code" -> **AppFlow**, not a custom Lambda. "Subscribe to a commercial data set" -> **Data Exchange**.',
      },
    ],
  },
]

export const ptBR: readonly Topic[] = [
  {
    slug: 'databases',
    group: 'performing',
    icon: 'database',
    title: 'Bancos de dados',
    summary:
      'Como escolher e escalar RDS, Aurora, DynamoDB e ElastiCache, os bancos especializados, proxies de conexão e migrações.',
    lede: 'Escolher o motor que combina com o padrão de acesso e escalá-lo para leituras, escritas e conexões. Faz parte do **Domínio 3: Projetar arquiteturas de alto desempenho**, 24% do conteúdo pontuado.',
    sections: [
      {
        id: 'rds',
        name: 'Amazon RDS',
        fullName: 'Amazon Relational Database Service',
        link: pt.aws('rds/'),
        summary:
          'Bancos relacionais gerenciados em instâncias que você dimensiona. Você escolhe motor, classe de instância e armazenamento, e a AWS cuida de patches, backups e failover.',
        points: [
          '**Motores**: Db2, MariaDB, MySQL, Oracle, PostgreSQL e SQL Server. **PostgreSQL** para SQL avançado, extensões e consultas complexas, **MySQL** ou **MariaDB** para cargas web simples e amplamente suportadas, Oracle ou SQL Server quando licença ou recursos exigem.',
          '**Classes de instância**: uso geral (`db.m*`), otimizadas para memória (`db.r*`, `db.x*`, `db.z1d`), expansíveis (`db.t*`) e classes Optimized Reads com NVMe local. Escala vertical trocando a classe.',
          '**Réplicas de leitura**: cópias assíncronas que atendem leituras, até 15 por origem (Db2 até 3). Podem ficar em outra AZ ou outra Região e ser promovidas a instância independente para DR. O RDS não cria nem remove réplicas sozinho.',
          '**Autoscaling de armazenamento**: aumenta o disco quando o espaço livre fica em 10% ou menos por pelo menos 5 minutos, até o limite máximo definido. Nunca reduz.',
          '**Armazenamento magnético** foi descontinuado. Instâncias novas usam gp3 ou SSD com IOPS provisionadas.',
        ],
        tip: '"Relatórios deixam o banco de produção lento" -> **réplica de leitura**, não Multi-AZ (a standby do Multi-AZ em instância não atende leituras). "I/O consistente e de baixa latência para OLTP" -> **IOPS provisionadas (io2 Block Express)**, não gp2.',
        table: {
          title: 'Tipos de armazenamento do RDS',
          head: ['Tipo', 'Quando usar'],
          rows: [
            {
              key: 'gp3',
              cells: [
                'Escolha padrão. Base de 3.000 IOPS e 125 MiB/s, com mais desempenho provisionado sem depender do tamanho (até 64.000 IOPS).',
              ],
            },
            {
              key: 'gp2',
              cells: ['Geração anterior. 3 IOPS por GiB, picos de 3.000 IOPS em volumes pequenos.'],
            },
            {
              key: 'io2 Block Express',
              cells: [
                'OLTP com I/O intenso. Até 256.000 IOPS com latência abaixo de 1 ms. Tipo de IOPS provisionadas recomendado.',
              ],
            },
            { key: 'io1', cells: ['IOPS provisionadas da geração anterior. Até 256.000 IOPS, latência de poucos ms.'] },
          ],
        },
      },
      {
        id: 'aurora',
        name: 'Amazon Aurora',
        link: pt.aws('rds/aurora/'),
        summary:
          'Motor compatível com MySQL e PostgreSQL, com uma camada de armazenamento distribuída compartilhada entre a instância de escrita e as leitoras, o que torna réplicas baratas e o failover rápido.',
        points: [
          '**Armazenamento**: 6 cópias dos dados em 3 AZs, num volume de cluster que cresce sozinho, até 256 TiB nas versões recentes do motor.',
          '**Aurora Replicas**: até 15 por cluster, com atraso normalmente bem abaixo de 100 ms. O **reader endpoint** distribui as conexões e o failover promove uma réplica por prioridade (tier 0 é a mais alta).',
          '**Aurora Serverless v2**: capacidade em ACUs (cerca de 2 GiB de memória cada) de 0 a 256, escalando em passos de até 0,5 ACU. Em 0 ACU a instância pausa nas versões suportadas.',
          '**Global Database**: até 10 Regiões secundárias, replicação normalmente abaixo de 1 segundo, RPO de 1 segundo e RTO abaixo de 1 minuto. Até 16 instâncias de leitura por secundária. Write forwarding encaminha escritas para a primária.',
          '**I/O-Optimized**: sem cobrança por I/O de leitura e escrita. Compensa quando o I/O passa de 25% da conta do Aurora (economia de até 40%). De Standard para I/O-Optimized uma vez a cada 30 dias.',
        ],
        tip: '"Carga relacional imprevisível ou com picos, pagar pelo uso" -> **Aurora Serverless v2**. "Leituras globais com atraso abaixo de 1 segundo e DR entre Regiões" -> **Aurora Global Database**, não réplicas de leitura do RDS entre Regiões.',
      },
      {
        id: 'dynamodb',
        name: 'Amazon DynamoDB',
        link: pt.aws('dynamodb/'),
        summary:
          'Banco serverless de chave-valor e documentos, com latência de poucos milissegundos em qualquer escala. O desempenho depende do modo de capacidade e de quão bem a chave de partição distribui o tráfego.',
        points: [
          '**On-demand**: paga por requisição, sem planejar capacidade, para tráfego desconhecido ou com picos. **Provisionado**: define RCUs e WCUs, com auto scaling, para tráfego previsível e mais barato. De provisionado para on-demand até 4 vezes em 24 horas, a volta a qualquer momento.',
          '**RCU**: 1 leitura fortemente consistente ou 2 eventualmente consistentes por segundo de um item de até 4 KB. **WCU**: 1 escrita por segundo de um item de até 1 KB. Transações custam o dobro.',
          '**Chave de partição**: use um atributo de alta cardinalidade (ID de usuário, ID de dispositivo) para espalhar as requisições. Chave de baixa cardinalidade gera **partições quentes** e throttling.',
          '**Tamanho do item**: até 400 KB. Objetos grandes vão para o S3 e o item guarda a chave.',
          '**PITR**: restaura para qualquer segundo dentro de um período configurável de 1 a 35 dias.',
        ],
        tip: '"Milhões de requisições por segundo, sem esquema, latência de poucos ms" -> **DynamoDB**, não RDS. Throttling em poucas chaves indica **chave de partição ruim**, não falta de capacidade total.',
      },
      {
        id: 'dynamodb-features',
        name: 'Recursos do DynamoDB',
        link: pt.aws('dynamodb/features/'),
        summary:
          'Índices, cache, fluxo de alterações, expiração e replicação entre Regiões levam o DynamoDB além de buscas simples por chave.',
        points: [
          '**GSI**: chave de partição e de ordenação diferentes, criado a qualquer momento, só leituras eventualmente consistentes, capacidade própria. Cota padrão de 20 por tabela.',
          '**LSI**: mesma chave de partição, outra chave de ordenação, criado só junto com a tabela, aceita leitura fortemente consistente. Até 5 por tabela e 10 GB por valor de chave de partição.',
          '**DAX**: cache em memória na frente do DynamoDB, compatível com a API, leituras em microssegundos, até 10x mais rápido.',
          '**Streams**: alterações de itens em ordem, guardadas por 24 horas e consumidas pelo Lambda para processamento por eventos. **TTL** apaga itens expirados em poucos dias, sem consumir capacidade de escrita.',
          '**Global tables**: réplicas multiativas em várias Regiões. O padrão **MREC** replica normalmente em até 1 segundo. **MRSC** dá consistência forte entre Regiões e é escolhido na criação.',
        ],
        tip: '"DynamoDB com muita leitura, latência de microssegundos, sem mudar código" -> **DAX**, não ElastiCache. "Consultar por outro atributo depois que a tabela existe" -> **GSI** (LSI não pode ser adicionado depois).',
      },
      {
        id: 'elasticache',
        name: 'Amazon ElastiCache',
        link: pt.aws('elasticache/'),
        summary:
          'Cache em memória gerenciado com Valkey, Redis OSS ou Memcached. Tira leituras repetidas do banco e guarda sessões, em clusters de nós ou serverless.',
        points: [
          '**Valkey ou Redis OSS**: replicação, failover automático entre AZs, backup e restauração, pub/sub e sorted sets (rankings). O **Global Datastore** replica entre Regiões.',
          '**Memcached**: multithread e simples, sem replicação e sem failover. Serve para um cache de objetos que pode ser perdido.',
          '**Lazy loading** (cache-aside): lê do cache e, se faltar, lê do banco e preenche o cache. Só guarda o que é pedido, mas o dado pode ficar desatualizado e cada miss custa 3 idas.',
          '**Write-through**: atualiza o cache a cada escrita no banco. O dado nunca fica velho, mas toda escrita faz 2 idas e dados nunca lidos ocupam memória.',
          '**TTL**: some uma expiração a qualquer estratégia para limitar dados velhos e liberar memória.',
        ],
        tip: '"Ranking, ordenação, cache com alta disponibilidade, sessões com failover" -> **ElastiCache para Valkey ou Redis OSS**. "Cache simples e multithread, sem persistência" -> **Memcached**.',
      },
      {
        id: 'purpose-built',
        name: 'Bancos especializados',
        link: pt.aws('products/databases/'),
        summary:
          'Cada modelo de dados tem o seu motor gerenciado. A prova descreve os dados e as consultas e espera o serviço correspondente.',
        points: [
          '**Amazon DocumentDB**: documentos JSON, compatível com MongoDB.',
          '**Amazon Keyspaces**: banco wide-column serverless, compatível com Apache Cassandra.',
          '**Amazon Neptune**: banco de grafos para dados muito conectados, consultado com Gremlin, openCypher ou SPARQL.',
          '**Amazon Redshift**: data warehouse colunar para análises (OLAP) sobre grandes volumes, não para transações.',
        ],
        tip: '"Migrar MongoDB com o mínimo de mudanças" -> **DocumentDB**. "Carga Cassandra, sem servidores" -> **Keyspaces**. "Rede social, fraude em rede, recomendações" -> **Neptune**.',
        table: {
          title: 'Requisito para banco',
          head: ['Requisito', 'Escolha'],
          rows: [
            { key: 'Relacional, joins, transações', cells: ['**RDS** ou **Aurora**'] },
            { key: 'Chave-valor em qualquer escala', cells: ['**DynamoDB**'] },
            { key: 'Cache abaixo de 1 ms', cells: ['**ElastiCache**, ou **DAX** para DynamoDB'] },
            { key: 'Documentos (MongoDB)', cells: ['**DocumentDB**'] },
            { key: 'Wide-column (Cassandra)', cells: ['**Keyspaces**'] },
            { key: 'Relações em grafo', cells: ['**Neptune**'] },
            { key: 'Análise sobre terabytes', cells: ['**Redshift**'] },
          ],
        },
      },
      {
        id: 'rds-proxy',
        name: 'RDS Proxy',
        fullName: 'Amazon RDS Proxy',
        link: pt.aws('rds/proxy/'),
        summary:
          'Pool de conexões gerenciado entre a aplicação e o banco. Absorve rajadas de conexões e mantém as conexões abertas durante o failover.',
        points: [
          '**Pool de conexões**: muitos clientes de vida curta (funções Lambda) compartilham poucas conexões com o banco.',
          '**Failover**: reduz o tempo de failover em até 66% no Aurora e no RDS.',
          '**Segurança**: as credenciais ficam no AWS Secrets Manager e a autenticação IAM pode ser exigida. O proxy nunca é público e roda na VPC do banco.',
          '**Motores**: Aurora MySQL, Aurora PostgreSQL, RDS for MySQL, PostgreSQL, MariaDB e SQL Server.',
        ],
        tip: '"Funções Lambda esgotam as conexões do banco" ou "erros de too many connections" -> **RDS Proxy**, não uma classe de instância maior.',
      },
      {
        id: 'migration',
        name: 'Migração de bancos',
        fullName: 'AWS Database Migration Service',
        link: pt.aws('dms/'),
        summary:
          'O AWS DMS leva os dados para a AWS enquanto a origem continua operando. Trocar de motor exige também converter esquema e código.',
        points: [
          '**Homogênea**: mesmo motor (MySQL para RDS for MySQL). O DMS ou as ferramentas nativas do motor movem os dados.',
          '**Heterogênea**: motores diferentes (Oracle para Aurora PostgreSQL). Converta esquema e código com o **DMS Schema Conversion** ou o **AWS Schema Conversion Tool** e depois mova os dados com o DMS.',
          '**CDC**: a captura de alterações replica as mudanças contínuas para um corte com downtime quase zero.',
          '**Origem continua no ar**: as aplicações seguem usando a origem durante a migração.',
        ],
        tip: '"Oracle para PostgreSQL com downtime mínimo" -> **DMS Schema Conversion (ou SCT) + DMS com CDC**. O DMS sozinho não converte procedures nem esquema.',
      },
    ],
  },
  {
    slug: 'networking',
    group: 'performing',
    icon: 'network',
    title: 'Redes',
    summary:
      'Desenho de VPC, saída para a internet, conexão entre VPCs, PrivateLink e links híbridos com Site-to-Site VPN, Client VPN e Direct Connect.',
    lede: 'Projetar sub-redes, rotas e conexões que acompanham o crescimento da carga e alcançam a rede local. Faz parte do **Domínio 3: Projetar arquiteturas de alto desempenho**, 24% do conteúdo pontuado.',
    sections: [
      {
        id: 'vpc-design',
        name: 'Desenho de VPC',
        fullName: 'Amazon Virtual Private Cloud',
        link: pt.aws('vpc/'),
        summary:
          'Uma VPC é uma rede privada em uma Região, dividida em sub-redes que ficam cada uma em uma AZ. O plano de endereços e as camadas de sub-rede definem até onde ela cresce.',
        points: [
          '**CIDR**: blocos IPv4 de /16 a /28. Dá para adicionar blocos depois (5 por VPC por padrão, ajustável até 50). Evite faixas sobrepostas às redes que você vai conectar.',
          '**Endereços reservados**: a AWS reserva 5 IPs em cada sub-rede (os 4 primeiros e o último).',
          '**Camadas de sub-rede**: pública (load balancers, NAT), privada (aplicação) e de dados (bancos), cada uma repetida em pelo menos 2 AZs.',
          '**Tabelas de rotas**: uma sub-rede é **pública** quando sua tabela tem rota para um internet gateway. Sub-redes privadas saem pela NAT.',
          '**VPC Flow Logs**: metadados do tráfego IP para CloudWatch Logs, S3 ou Data Firehose, para diagnóstico.',
        ],
        tip: '"Acabando os IPs da VPC" -> **adicione um bloco CIDR secundário**, não uma VPC nova. Uma sub-rede /28 tem só 11 endereços utilizáveis porque 5 são reservados.',
      },
      {
        id: 'internet-egress',
        name: 'Internet e saída',
        link: pt.docs('vpc/latest/userguide/vpc-nat-gateway.html'),
        summary:
          'O internet gateway dá às sub-redes públicas acesso de ida e volta à internet. NAT e egress-only gateway deixam recursos privados saírem sem ficarem alcançáveis.',
        points: [
          '**Internet gateway**: escala horizontal, redundante e altamente disponível, sem limite de banda. O gateway não é cobrado, só a transferência de dados.',
          '**NAT gateway (zonal)**: saída IPv4 para sub-redes privadas, 5 Gbps escalando até 100 Gbps. Crie um por AZ para que a falha de uma AZ não corte a saída das outras.',
          '**NAT gateway (modo regional)**: um único ID de NAT gateway que se expande pelas AZs onde há carga, sem sub-rede pública.',
          '**Egress-only internet gateway**: só saída IPv6, com estado. Como endereços IPv6 são públicos, é o equivalente à NAT no IPv6.',
          '**Elastic IP**: IPv4 público fixo, 5 por Região por padrão. A AWS cobra por todo IPv4 público, em uso ou parado.',
        ],
        tip: '"Instâncias privadas precisam baixar patches da internet, com alta disponibilidade" -> **NAT gateway em cada AZ**, não instância NAT. "Só saída IPv6" -> **egress-only internet gateway**.',
      },
      {
        id: 'vpc-to-vpc',
        name: 'Peering e Transit Gateway',
        link: pt.aws('transit-gateway/'),
        summary:
          'O peering liga duas VPCs diretamente. O AWS Transit Gateway é um hub regional que escala para muitas VPCs e conexões com a rede local.',
        points: [
          '**VPC peering**: um para um, entre contas e Regiões, sem ponto único de falha nem gargalo de banda. **Não é transitivo** e não aceita CIDRs sobrepostos. 50 peerings ativos por VPC por padrão, até 125.',
          '**Transit Gateway**: roteador hub and spoke para VPCs, Site-to-Site VPN, Direct Connect gateways e Transit Gateway Connect. Até 100 Gbps por anexo de VPC por AZ.',
          '**Tabelas de rotas** no transit gateway segmentam o tráfego (por exemplo, separar produção e desenvolvimento).',
          '**Anexos de peering** ligam transit gateways entre Regiões. O compartilhamento com outras contas é feito pelo AWS RAM.',
          '**ECMP** sobre vários túneis VPN com BGP soma a banda de VPN até o transit gateway.',
        ],
        tip: '"Dezenas de VPCs e sites locais, malha completa impossível de gerenciar" -> **Transit Gateway**. "Duas VPCs, menor custo, sem trânsito" -> **VPC peering**. Uma VPC pareada nunca encaminha tráfego para uma terceira.',
      },
      {
        id: 'privatelink',
        name: 'PrivateLink e endpoints',
        fullName: 'AWS PrivateLink',
        link: pt.aws('privatelink/'),
        summary:
          'Acesso privado a serviços da AWS e a serviços em outras VPCs, sem internet gateway, NAT ou peering. O tráfego fica na rede da AWS.',
        points: [
          '**Interface endpoint**: interfaces de rede com IPs privados nas suas sub-redes para um serviço da AWS ou um endpoint service, resolvido via DNS.',
          '**Endpoint service**: expõe sua aplicação atrás de um Network Load Balancer para consumidores em outras VPCs ou contas. Funciona com CIDRs sobrepostos porque só o endpoint é compartilhado.',
          '**Gateway endpoint**: só para S3 e DynamoDB, sem custo extra, uma rota na tabela de rotas, só na mesma Região. Não é PrivateLink.',
          '**Iniciado pelo consumidor**: o consumidor abre a conexão e o provedor aceita ou rejeita o pedido.',
        ],
        tip: '"Expor um serviço para centenas de VPCs de clientes com CIDRs sobrepostos" -> **endpoint service do PrivateLink**, não peering. "EC2 acessando S3 sem NAT e sem custo" -> **gateway endpoint**.',
      },
      {
        id: 'vpn',
        name: 'Opções de VPN',
        link: pt.aws('vpn/site-to-site-vpn/'),
        summary:
          'Túneis IPsec criptografados pela internet. O Site-to-Site VPN une redes, o Client VPN conecta usuários individuais.',
        points: [
          '**Site-to-Site VPN**: 2 túneis por conexão, cada um em uma AZ diferente. Termina em um virtual private gateway ou transit gateway, com um customer gateway no local.',
          '**Banda**: até 1,25 Gbps por túnel padrão. **Large Bandwidth Tunnels** chegam a 5 Gbps em anexos de transit gateway ou Cloud WAN.',
          '**Accelerated Site-to-Site VPN**: entra na rede global da AWS pela borda mais próxima via Global Accelerator. Exige transit gateway.',
          '**AWS Client VPN**: acesso remoto gerenciado, baseado em OpenVPN, para usuários, com autenticação via Active Directory, federação SAML ou certificados mútuos.',
        ],
        tip: '"Conectar o escritório nesta semana, criptografado, barato" -> **Site-to-Site VPN**. "Funcionários remotos em notebooks" -> **Client VPN**. Mais de 1,25 Gbps por VPN -> **ECMP em transit gateway** ou Large Bandwidth Tunnels.',
      },
      {
        id: 'direct-connect',
        name: 'Direct Connect',
        fullName: 'AWS Direct Connect',
        link: pt.aws('directconnect/'),
        summary:
          'Um link privado e dedicado da sua rede até a AWS, sem passar pela internet, para banda e latência consistentes.',
        points: [
          '**Conexão dedicada**: porta de 1, 10, 100 ou 400 Gbps. **Conexão hospedada**: de 50 Mbps a 25 Gbps por meio de um parceiro.',
          '**Sem criptografia por padrão**: use **MACsec** em conexões dedicadas de 10, 100 e 400 Gbps nos locais suportados, ou uma VPN IPsec sobre o Direct Connect.',
          '**Interfaces virtuais**: VIF privada para uma VPC, VIF pública para serviços públicos da AWS, VIF de trânsito para transit gateways.',
          '**Direct Connect gateway**: recurso global que liga uma conexão a VPCs em várias Regiões (exceto China). Não roteia de VPC para VPC.',
          '**Resiliência**: máxima (dispositivos separados em mais de 1 local, SLA de 99,99%) ou alta (conexões em locais diferentes, 99,9%). Um Site-to-Site VPN é o backup de baixo custo.',
        ],
        tip: '"Banda consistente, grandes transferências diárias, sem internet" -> **Direct Connect**. "Precisa para agora" é VPN, porque uma conexão nova leva tempo para ser provisionada. "Link privado e criptografado" -> **DX + VPN IPsec** ou MACsec.',
        table: {
          title: 'Conectividade híbrida',
          head: ['Opção', 'Serve quando'],
          rows: [
            {
              key: 'Site-to-Site VPN',
              cells: ['Configuração rápida, criptografada, pela internet, latência variável.'],
            },
            { key: 'Client VPN', cells: ['Usuários individuais conectando dos seus dispositivos.'] },
            { key: 'Direct Connect', cells: ['Privado, banda e latência consistentes, alto volume.'] },
            { key: 'Direct Connect + VPN', cells: ['Criptografia sobre o DX, ou VPN como caminho de backup do DX.'] },
          ],
        },
      },
      {
        id: 'load-balancing',
        name: 'Escolha do load balancer',
        fullName: 'Elastic Load Balancing',
        link: pt.aws('elasticloadbalancing/'),
        summary:
          'Escolha o load balancer pela camada de protocolo e pelo requisito. Alta disponibilidade e health checks estão nas notas de resiliência.',
        points: [
          '**Application Load Balancer**: camada 7, HTTP e HTTPS, roteamento por caminho, host e cabeçalhos, alvos em contêineres e Lambda.',
          '**Network Load Balancer**: camada 4 (TCP, UDP, TLS, QUIC), milhões de requisições por segundo, um IP fixo por AZ e Elastic IPs opcionais.',
          '**Gateway Load Balancer**: camada 3, insere appliances de terceiros (firewalls, IDS) usando GENEVE na porta 6081.',
        ],
        tip: '"Roteamento por caminho para microsserviços" -> **ALB**. "IP fixo para allowlist, UDP, vazão extrema" -> **NLB**. "Frota de firewalls de terceiros no caminho do tráfego" -> **Gateway Load Balancer**.',
      },
    ],
  },
  {
    slug: 'edge',
    group: 'performing',
    icon: 'globe',
    title: 'Borda e DNS',
    summary:
      'Registros e políticas de roteamento do Route 53, cache e segurança no CloudFront, funções na borda, Global Accelerator e S3 Transfer Acceleration.',
    lede: 'Levar conteúdo e endpoints para perto de usuários no mundo todo e direcionar o tráfego por latência, localização e saúde. Faz parte do **Domínio 3: Projetar arquiteturas de alto desempenho**, 24% do conteúdo pontuado.',
    sections: [
      {
        id: 'route53-records',
        name: 'Registros do Route 53',
        fullName: 'Amazon Route 53',
        link: pt.docs('Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html'),
        summary:
          'O Route 53 hospeda zonas DNS públicas e privadas. O registro alias é a extensão da AWS que a prova mais cobra.',
        points: [
          '**Tipos comuns**: A (IPv4), AAAA (IPv6), CNAME, MX, NS, SOA, TXT, CAA, SRV, PTR. A AWS recomenda TXT no lugar de registros SPF.',
          '**CNAME**: aponta um nome para outro nome, nunca no apex da zona (`example.com`).',
          '**Alias**: aponta para recursos da AWS (CloudFront, ELB, site do S3, API Gateway, Global Accelerator, interface endpoint de VPC ou outro registro da zona), funciona no apex e consultas a recursos da AWS são gratuitas.',
          '**Zona hospedada privada**: nomes DNS resolvidos só dentro das VPCs associadas.',
        ],
        tip: '"Apontar o domínio raiz para um load balancer ou CloudFront" -> **registro alias**, nunca CNAME. O alias também evita cobrança por consulta.',
      },
      {
        id: 'route53-routing',
        name: 'Políticas de roteamento',
        link: pt.docs('Route53/latest/DeveloperGuide/routing-policy.html'),
        summary:
          'A política de roteamento decide qual registro responde a cada consulta DNS. Junto com health checks, dá failover e direcionamento de tráfego no nível do DNS.',
        points: [
          '**Geolocation** responde pela localização do usuário (continente, país, estado). Crie um registro **padrão** ou usuários sem correspondência ficam sem resposta.',
          '**Geoproximity** roteia pela distância até os recursos e desloca carga com um **bias** de -99 a +99.',
          '**Multivalue answer** devolve até 8 registros saudáveis ao acaso. Não substitui um load balancer.',
          '**IP-based** roteia pelo CIDR do cliente (CIDR collections), útil para rotas por provedor. Não existe em zonas privadas.',
        ],
        tip: '"Menor latência para usuários globais" -> **latency**, não geolocation. "Direitos de conteúdo ou idioma por país" -> **geolocation**. "Mandar 10% para a nova versão" -> **weighted**.',
        table: {
          title: 'Políticas de roteamento do Route 53',
          head: ['Política', 'Use para'],
          rows: [
            { key: 'Simple', cells: ['Um único recurso, sem health check na resposta.'] },
            { key: 'Weighted', cells: ['Dividir tráfego por percentual: canário, blue/green, testes A/B.'] },
            { key: 'Latency', cells: ['Mandar o usuário para a Região com menor latência para ele.'] },
            { key: 'Failover', cells: ['Ativo-passivo: primário enquanto saudável, secundário caso contrário.'] },
            { key: 'Geolocation', cells: ['Responder pela localização do usuário: conformidade, localização.'] },
            { key: 'Geoproximity', cells: ['Rotear pela distância, com bias para aumentar ou reduzir uma área.'] },
            { key: 'IP-based', cells: ['Rotear pela faixa de IP do cliente que você conhece (CIDR collections).'] },
            { key: 'Multivalue answer', cells: ['Até 8 registros saudáveis devolvidos ao acaso.'] },
          ],
        },
      },
      {
        id: 'route53-health',
        name: 'Health checks',
        link: pt.docs('Route53/latest/DeveloperGuide/dns-failover.html'),
        summary:
          'Os health checks do Route 53 tiram endpoints não saudáveis das respostas DNS, o que viabiliza failover entre Regiões.',
        points: [
          '**Checagem de endpoint**: verificadores espalhados pelo mundo testam um IP ou domínio. O endpoint é saudável quando mais de 18% deles o consideram saudável.',
          '**Checagem calculada**: combina o resultado de outros health checks.',
          '**Checagem por alarme do CloudWatch**: segue um alarme. Obrigatória para recursos só com IP privado, porque os verificadores ficam fora da VPC.',
          '**Roteamento failover** usa a checagem do registro primário para trocar para o secundário (por exemplo, um site estático no S3).',
        ],
        tip: '"Trocar para uma Região de backup automaticamente quando a primária falhar" -> **roteamento failover + health check**. "Saúde de um recurso privado" -> **checagem baseada em alarme do CloudWatch**.',
      },
      {
        id: 'cloudfront',
        name: 'Amazon CloudFront',
        link: pt.aws('cloudfront/'),
        summary:
          'Rede de entrega de conteúdo com mais de 750 pontos de presença e 15 caches regionais de borda. Guarda conteúdo estático e dinâmico perto do usuário e protege a origem.',
        points: [
          '**Origens**: bucket S3, site do S3, ALB, NLB, EC2, API Gateway, URL de função Lambda, MediaPackage ou qualquer servidor HTTP. **VPC origins** alcançam ALB, NLB e EC2 em sub-redes privadas.',
          '**Cache behaviors**: padrões de caminho (`/images/*`, `/api/*`) apontam para origens e políticas de cache. Padrões: TTL mínimo 0, padrão 86.400 s (24 horas), máximo 31.536.000 s (1 ano).',
          '**Origin Shield**: uma camada extra de cache que reduz a carga na origem.',
          '**Failover de origem**: um origin group com origem primária e secundária, para requisições GET, HEAD e OPTIONS.',
          '**HTTPS**: o certificado do ACM para domínio próprio precisa estar em `us-east-1`.',
        ],
        tip: '"Usuários globais, conteúdo estático no S3, menos latência e menos carga na origem" -> **CloudFront**. Problema de taxa de acerto de cache aponta para **política de cache e TTLs**, não para uma origem maior.',
      },
      {
        id: 'cloudfront-security',
        name: 'Restringir conteúdo',
        link: pt.docs('AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html'),
        summary:
          'O CloudFront mantém a origem privada, exige acesso assinado, bloqueia países e criptografa campos sensíveis na borda.',
        points: [
          '**Origin access control (OAC)**: o bucket S3 só aceita requisições assinadas pelo CloudFront. Suporta SSE-KMS e PUT/DELETE. O legado origin access identity (OAI) não é recomendado.',
          '**URLs assinadas**: uma URL por arquivo, ou clientes que não aceitam cookies. **Cookies assinados**: muitos arquivos restritos sem mudar as URLs. Assine com **trusted key groups**.',
          '**Restrição geográfica**: lista de países permitidos ou bloqueados para a distribuição inteira.',
          '**Field-level encryption**: criptografa até 10 campos de POST na borda com chave pública, e só o backend com a chave privada consegue lê-los.',
          '**AWS WAF** e **Shield Standard** protegem a distribuição na borda.',
        ],
        tip: '"Usuários não podem acessar o bucket S3 diretamente" -> **OAC**. "Biblioteca de vídeos paga, muitos arquivos por assinante" -> **cookies assinados**. "Um link de download" -> **URL assinada**, não URL pré-assinada do S3 quando há CloudFront na frente.',
      },
      {
        id: 'edge-functions',
        name: 'Funções na borda',
        link: pt.docs('AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html'),
        summary:
          'Código que roda no CloudFront para alterar requisições e respostas. CloudFront Functions são leves e baratas, Lambda@Edge é mais capaz.',
        points: [
          '**CloudFront Functions**: JavaScript, só viewer request e viewer response, abaixo de 1 ms, tamanho máximo de 10 KB, sem acesso à rede, milhões de requisições por segundo.',
          '**Lambda@Edge**: Node.js ou Python, eventos de viewer e de origem, acesso à rede, até 30 s, criado em `us-east-1`.',
          '**Usos típicos de CloudFront Functions**: manipular cabeçalhos, reescrever URLs e redirecionar, normalizar a chave de cache, validar tokens simples.',
          '**Usos típicos de Lambda@Edge**: chamar serviços externos, corpos maiores, escolher a origem, lógica que precisa de mais memória ou tempo.',
        ],
        tip: '"Reescrever URLs ou adicionar cabeçalhos em escala massiva, menor custo" -> **CloudFront Functions**. "Chamar uma API de terceiros ou alterar a requisição à origem" -> **Lambda@Edge**.',
        table: {
          title: 'CloudFront Functions ou Lambda@Edge',
          head: ['Aspecto', 'CloudFront Functions e Lambda@Edge'],
          rows: [
            {
              key: 'Eventos',
              cells: [
                '**CloudFront Functions**: viewer request e response.',
                '**Lambda@Edge**: viewer e origin request e response.',
              ],
            },
            { key: 'Runtime', cells: ['**CloudFront Functions**: JavaScript.', '**Lambda@Edge**: Node.js, Python.'] },
            {
              key: 'Duração',
              cells: ['**CloudFront Functions**: abaixo de 1 ms.', '**Lambda@Edge**: até 30 segundos.'],
            },
            { key: 'Acesso à rede', cells: ['**CloudFront Functions**: não.', '**Lambda@Edge**: sim.'] },
            {
              key: 'Memória',
              cells: ['**CloudFront Functions**: 2 MB.', '**Lambda@Edge**: 128 MB (viewer) até 10.240 MB (origem).'],
            },
          ],
        },
      },
      {
        id: 'global-accelerator',
        name: 'Global Accelerator',
        fullName: 'AWS Global Accelerator',
        link: pt.aws('global-accelerator/'),
        summary:
          'IPs anycast fixos que colocam o usuário na rede global da AWS pela borda mais próxima e o levam a endpoints regionais saudáveis. Sem cache.',
        points: [
          '**IPs fixos**: 2 endereços IPv4 anycast (4 com dual stack) que não mudam enquanto os endpoints mudam por trás.',
          '**Protocolos**: TCP e UDP, então atende jogos, IoT (MQTT) e VoIP, que o CloudFront não atende.',
          '**Endpoints**: ALB, NLB, instâncias EC2 e Elastic IPs em uma ou mais Regiões.',
          '**Failover**: detecta um endpoint não saudável e o tira de serviço em menos de 1 minuto, sem esperar cache de DNS.',
          '**Traffic dials** por Região e **pesos** por endpoint, além de afinidade de cliente.',
        ],
        tip: '"IPs fixos para allowlist, UDP, failover regional rápido" -> **Global Accelerator**. "Cache de conteúdo na borda, HTTP" -> **CloudFront**. Os dois usam a borda, só o CloudFront faz cache.',
      },
      {
        id: 'transfer-acceleration',
        name: 'S3 Transfer Acceleration',
        fullName: 'Amazon S3 Transfer Acceleration',
        link: pt.docs('AmazonS3/latest/userguide/transfer-acceleration.html'),
        summary:
          'Uploads e downloads mais rápidos para um bucket a longas distâncias, entrando na rede da AWS por um ponto de presença do CloudFront.',
        points: [
          '**Endpoint**: `bucketname.s3-accelerate.amazonaws.com` (ou o endpoint dual-stack).',
          '**Nome do bucket**: precisa ser compatível com DNS e sem pontos.',
          '**Preço**: só paga pelas transferências aceleradas. Se não ficar mais rápido, não há cobrança.',
          '**Speed Comparison tool** mostra o ganho para a sua localização antes de ativar.',
        ],
        tip: '"Usuários em outros continentes enviam arquivos grandes para um bucket" -> **S3 Transfer Acceleration**, junto com **multipart upload** para objetos grandes. Não CloudFront, que é voltado à entrega.',
      },
    ],
  },
  {
    slug: 'data-analytics',
    group: 'performing',
    icon: 'chart',
    title: 'Ingestão e análise de dados',
    summary:
      'Streaming com Kinesis e MSK, data lakes com Glue, Lake Formation e Athena, data warehouses, visualização e transferência de dados.',
    lede: 'Ingerir, transformar e analisar dados na velocidade e no volume certos, de streams a data lakes e data warehouses. Faz parte do **Domínio 3: Projetar arquiteturas de alto desempenho**, 24% do conteúdo pontuado.',
    sections: [
      {
        id: 'kinesis-data-streams',
        name: 'Kinesis Data Streams',
        fullName: 'Amazon Kinesis Data Streams',
        link: pt.aws('kinesis/data-streams/'),
        summary:
          'Stream em tempo real que guarda registros em shards para que vários consumidores leiam, e releiam, em ordem.',
        points: [
          '**Shard**: escrita de até 1 MB/s ou 1.000 registros/s, leitura de até 2 MB/s dividida entre os consumidores.',
          '**Enhanced fan-out**: cada consumidor registrado ganha 2 MB/s próprios por shard.',
          '**Retenção**: 24 horas por padrão, até 365 dias. Os consumidores podem **reprocessar** os dados.',
          '**Ordem**: a chave de partição escolhe o shard, e registros com a mesma chave ficam em ordem.',
          '**Modos de capacidade**: on-demand (escala sozinho) ou provisionado (você gerencia os shards).',
        ],
        tip: '"Tempo real, vários consumidores, reprocessamento, ordem por chave" -> **Kinesis Data Streams**. Escritas com throttling -> **mais shards** ou uma chave de partição melhor.',
      },
      {
        id: 'firehose',
        name: 'Amazon Data Firehose',
        link: pt.aws('firehose/'),
        summary:
          'Entrega totalmente gerenciada de dados de streaming para destinos de armazenamento e análise, com buffer, transformação e conversão de formato. Sem shards para gerenciar.',
        points: [
          '**Destinos**: S3, Redshift (passa pelo S3 e usa COPY), OpenSearch Service e Serverless, Splunk, Snowflake, tabelas Apache Iceberg e endpoints HTTP.',
          '**Buffer**: entrega quando atinge um tamanho (1 a 128 MiB para S3) ou um tempo (0 a 900 s), por isso é quase tempo real.',
          '**Conversão de formato**: JSON para **Parquet** ou **ORC** com esquema do Glue Data Catalog.',
          '**Transformação**: uma função Lambda pode transformar registros, por exemplo CSV para JSON antes da conversão.',
          '**Origens** incluem PUT direto e Kinesis data streams.',
        ],
        tip: '"Carregar dados de streaming no S3 ou no Redshift sem código, quase em tempo real" -> **Data Firehose**. "Consumidores próprios, reprocessamento, milissegundos" -> **Kinesis Data Streams**.',
      },
      {
        id: 'msk-video',
        name: 'MSK e streams de vídeo',
        fullName: 'Amazon MSK e Amazon Kinesis Video Streams',
        link: pt.aws('msk/'),
        summary: 'Apache Kafka gerenciado para quem já usa Kafka, e um serviço dedicado a vídeo vindo de dispositivos.',
        points: [
          '**Amazon MSK**: roda Apache Kafka de código aberto, então produtores e consumidores existentes funcionam sem mudar código.',
          '**Opções do MSK**: provisionado (brokers Standard ou Express), **MSK Serverless**, **MSK Connect** para conectores e MSK Replicator.',
          '**Kinesis Video Streams**: ingere, armazena e indexa vídeo de câmeras para reprodução (HLS, MPEG-DASH), análise e ML.',
          '**WebRTC** no Kinesis Video Streams permite mídia em tempo real nos dois sentidos.',
        ],
        tip: '"Migrar um cluster Kafka local com o mínimo de mudanças" -> **Amazon MSK**, não Kinesis. "Streams de câmeras para análise com Rekognition" -> **Kinesis Video Streams**.',
      },
      {
        id: 'data-lake',
        name: 'Glue e Lake Formation',
        fullName: 'AWS Glue e AWS Lake Formation',
        link: pt.aws('glue/'),
        summary:
          'O Glue descobre, cataloga e transforma dados, e o Lake Formation controla quem lê cada parte do data lake no S3.',
        points: [
          '**Crawlers** inferem esquemas e preenchem o **Glue Data Catalog**, um catálogo compatível com o Hive metastore usado por Athena, EMR e Redshift Spectrum.',
          '**Glue ETL**: jobs Apache Spark serverless (lote ou streaming). **Job bookmarks** evitam reprocessar dados antigos. Um job típico converte **CSV para Parquet**.',
          '**AWS Glue DataBrew**: preparação visual de dados, sem código.',
          '**Lake Formation**: permissões por banco, tabela, coluna, linha e célula, **LF-Tags** para acesso baseado em tags e compartilhamento entre contas.',
        ],
        tip: '"Converter CSV do S3 para Parquet com agendamento, sem servidores" -> **job de ETL do Glue**. "Acesso por coluna ao data lake para equipes diferentes" -> **Lake Formation**, não políticas de bucket.',
      },
      {
        id: 'athena-quick',
        name: 'Athena e Quick',
        fullName: 'Amazon Athena e Amazon Quick',
        link: pt.aws('athena/'),
        summary:
          'O Athena consulta o S3 com SQL sem servidores, e o Amazon Quick transforma os resultados em dashboards.',
        points: [
          '**Athena**: SQL serverless sobre o S3, cobrado por TB lido. Usa o Glue Data Catalog para as tabelas.',
          '**Menos custo e tempo**: formatos colunares (Parquet, ORC), compressão e particionamento reduzem os dados lidos.',
          '**Federated Query**: conectores baseados em Lambda consultam fontes fora do S3 (relacionais, NoSQL).',
          '**Amazon Quick**: evoluiu do Amazon QuickSight. Seu recurso de BI, o **Amazon Quick Sight**, cria dashboards com o motor em memória SPICE e perguntas em linguagem natural.',
        ],
        tip: '"SQL ad hoc sobre logs no S3, sem infraestrutura" -> **Athena**. "Athena lento e caro sobre CSV" -> **converta para Parquet e particione**. "Dashboards de BI interativos" -> **Amazon Quick**.',
      },
      {
        id: 'processing',
        name: 'EMR, Redshift, OpenSearch',
        link: pt.aws('redshift/'),
        summary:
          'Frameworks de big data, o data warehouse e a busca e análise de logs respondem perguntas diferentes sobre os mesmos dados.',
        points: [
          '**Amazon EMR**: Spark, Hive, Trino, Flink e Hadoop gerenciados em EC2, EKS ou Serverless. Nós primary, core e task. Spot é comum nos nós task, evite nos nós core (HDFS).',
          '**Amazon Redshift**: data warehouse colunar para análise com SQL. O **Redshift Serverless** cobra pelo uso de RPUs. O **Spectrum** consulta o S3 sem carregar os dados.',
          '**Recursos do Redshift**: concurrency scaling, data sharing e **zero-ETL** a partir de Aurora, RDS e DynamoDB.',
          '**Amazon OpenSearch Service**: busca textual e análise de logs com OpenSearch Dashboards. Camadas UltraWarm e cold, OpenSearch Serverless e Ingestion.',
        ],
        tip: '"Jobs Spark ou Hadoop existentes, controle total do cluster" -> **EMR**. "Joins SQL complexos sobre terabytes para BI" -> **Redshift**. "Busca textual em logs ou num catálogo" -> **OpenSearch**.',
        table: {
          title: 'Qual serviço de análise',
          head: ['Serviço', 'Melhor para'],
          rows: [
            { key: 'Athena', cells: ['SQL ad hoc sobre o S3, serverless, paga por consulta.'] },
            { key: 'Redshift', cells: ['BI recorrente e SQL complexo sobre dados estruturados.'] },
            { key: 'EMR', cells: ['Spark, Hadoop e outros frameworks em grande escala.'] },
            { key: 'Glue', cells: ['ETL serverless e o Data Catalog.'] },
            { key: 'OpenSearch Service', cells: ['Busca, análise de logs e dashboards sobre texto.'] },
            { key: 'Amazon Quick', cells: ['Visualização e dashboards de BI.'] },
          ],
        },
      },
      {
        id: 'data-transfer',
        name: 'Transferência de dados',
        link: pt.aws('datasync/'),
        summary:
          'Serviços online movem dados pela rede por agendamento ou protocolo, e opções físicas movem quando a rede é lenta demais.',
        points: [
          '**AWS DataSync**: cópias online de NFS, SMB, HDFS, armazenamento de objetos e outras nuvens para S3, EFS e FSx, com criptografia, verificação de integridade e agendamento. Precisa de agente para origens locais.',
          '**AWS Transfer Family**: endpoints gerenciados SFTP, FTPS, FTP e AS2 para S3 ou EFS, com o seu provedor de identidade. FTP só em endpoints internos de VPC.',
          '**AWS Snowball Edge**: desde 7 de novembro de 2025, só para clientes existentes, e o suporte nas Regiões comerciais termina em 31 de dezembro de 2026.',
          '**AWS Data Transfer Terminal**: locais físicos onde você leva seus próprios dispositivos de armazenamento e envia os dados por uma conexão de alta banda.',
        ],
        tip: '"Parceiros enviam arquivos por SFTP para o S3" -> **Transfer Family**. "Sincronizar um compartilhamento NFS com S3 ou EFS periodicamente" -> **DataSync**. Questões com petabytes e pouca banda ainda apontam para **Snowball Edge**.',
        table: {
          title: 'Opção de transferência por necessidade',
          head: ['Necessidade', 'Escolha'],
          rows: [
            { key: 'Cópia online ou sincronização recorrente', cells: ['**DataSync**'] },
            { key: 'Parceiros com SFTP, FTPS, FTP, AS2', cells: ['**Transfer Family**'] },
            {
              key: 'Offline, pouca banda',
              cells: ['**Snowball Edge** (clientes existentes) ou **Data Transfer Terminal**'],
            },
            { key: 'Dados de aplicações SaaS', cells: ['**Amazon AppFlow**'] },
            { key: 'Conjuntos de dados de terceiros', cells: ['**AWS Data Exchange**'] },
          ],
        },
      },
      {
        id: 'saas-data',
        name: 'AppFlow e Data Exchange',
        fullName: 'Amazon AppFlow e AWS Data Exchange',
        link: pt.aws('appflow/'),
        summary: 'Formas gerenciadas de trazer para a AWS dados de aplicações SaaS e de provedores terceiros.',
        points: [
          '**Amazon AppFlow**: fluxos sem código entre aplicações SaaS (Salesforce, ServiceNow, Zendesk, Slack) e S3, Redshift ou Snowflake, nos dois sentidos.',
          '**Gatilhos do AppFlow**: sob demanda, agendado ou por evento. As transformações incluem filtro, mascaramento, mapeamento e validação. Suporta PrivateLink.',
          '**AWS Data Exchange**: encontre, assine e use dados de terceiros entregues como arquivos, APIs, datashares do Redshift ou acesso a dados no S3.',
        ],
        tip: '"Importar dados do Salesforce para o S3 todo dia sem código" -> **AppFlow**, não um Lambda próprio. "Assinar um conjunto de dados comercial" -> **Data Exchange**.',
      },
    ],
  },
]
