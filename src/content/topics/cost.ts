import { en, pt } from '../links'
import type { Topic } from '../types'

export const enUS: readonly Topic[] = [
  {
    slug: 'cost-compute',
    group: 'cost',
    icon: 'coin',
    title: 'Compute costs',
    summary:
      'Purchase options, Spot, rightsizing and serverless trade-offs that cut the compute bill without losing the availability you need.',
    lede: 'Paying the lowest price for the capacity a workload really needs: the right purchase option, the right size and only the hours it runs. This is **Domain 4: Design Cost-Optimized Architectures**, 20% of the scored content.',
    sections: [
      {
        id: 'purchase-options',
        name: 'Purchase options',
        fullName: 'Amazon EC2 billing and purchasing options',
        link: en.docs('AWSEC2/latest/UserGuide/instance-purchasing-options.html'),
        summary:
          'The same instance costs very different amounts depending on how you buy it. Match the option to how steady, how long and how interruptible the workload is.',
        points: [
          '**Steady baseline**: cover it with Savings Plans or Reserved Instances, then let Auto Scaling add On-Demand or Spot capacity for the peaks.',
          '**On-Demand billing**: per second with a 60-second minimum for Linux and Windows. SUSE Linux Enterprise Server is billed per full hour.',
          '**Payment options**: All Upfront, Partial Upfront or No Upfront. The more you pay upfront, the lower the rate.',
          '**Capacity is not a discount**: zonal Reserved Instances and Capacity Reservations hold capacity in one AZ. Regional Reserved Instances and Savings Plans give a discount but reserve no capacity.',
          '**Stacking**: a Capacity Reservation has no discount of its own, but Savings Plans or regional Reserved Instances apply to it.',
        ],
        tip: '"Steady 24/7 load for 3 years, lowest price" -> **Savings Plans or Standard Reserved Instances**. "Guarantee capacity in one AZ for a launch, no long commitment" -> **On-Demand Capacity Reservation**, not a Reserved Instance.',
        table: {
          title: 'Purchase options at a glance',
          head: ['Option', 'Fit and maximum discount'],
          rows: [
            { key: 'On-Demand', cells: ['No commitment. Short, spiky or unknown workloads. Full price.'] },
            {
              key: 'Compute Savings Plans',
              cells: [
                'USD per hour for 1 or 3 years across EC2, Fargate and Lambda, any family, size or Region. Up to 66%.',
              ],
            },
            {
              key: 'EC2 Instance Savings Plans',
              cells: ['One instance family in one Region, any size, OS or tenancy. Up to 72%.'],
            },
            {
              key: 'Standard Reserved Instances',
              cells: [
                'Fixed configuration for 1 or 3 years. Up to 72%. Can be sold in the Reserved Instance Marketplace.',
              ],
            },
            {
              key: 'Convertible Reserved Instances',
              cells: ['Can be exchanged for another family, type, platform, scope or tenancy. Up to 66%.'],
            },
            { key: 'Spot Instances', cells: ['Spare capacity, interruptible with a 2-minute notice. Up to 90%.'] },
            {
              key: 'Dedicated Hosts',
              cells: ['A whole physical server with socket and core visibility, for server-bound licenses.'],
            },
            {
              key: 'Capacity Reservations',
              cells: ['Capacity in one AZ, no term for immediate use, billed whether instances run or not.'],
            },
          ],
        },
      },
      {
        id: 'commitments',
        name: 'Savings Plans vs RIs',
        fullName: 'Savings Plans and Reserved Instances',
        link: en.aws('savingsplans/'),
        summary:
          'Both trade a commitment for a lower rate. Savings Plans commit to an hourly spend and follow the workload, Reserved Instances commit to an instance configuration.',
        points: [
          '**Compute Savings Plans**: the most flexible. Apply to EC2 regardless of family, size, AZ, Region, OS or tenancy, and also to Fargate and Lambda. Up to 66%.',
          '**EC2 Instance Savings Plans**: tied to one family in one Region, free to change size, OS and tenancy. Up to 72%.',
          '**Convertible vs Standard RIs**: Convertible can be exchanged during the term but cannot be sold. Standard cannot be exchanged but can be sold in the Reserved Instance Marketplace.',
          '**Database Savings Plans**: 1-year, No Upfront commitment across Aurora, RDS, DynamoDB, ElastiCache, DocumentDB, Neptune, Keyspaces, Timestream, DMS and OpenSearch Service. Up to 35%.',
          '**Sharing**: by default the discount flows to every account in the organization. The management account can restrict it to groups or turn it off per account.',
        ],
        tip: '"Workloads may move from EC2 to Fargate or Lambda, or to another Region" -> **Compute Savings Plans**. "Highest discount, the instance family will not change" -> **EC2 Instance Savings Plans** or **Standard RIs**. Convertible RIs are the distractor when Fargate or Lambda appear.',
      },
      {
        id: 'spot',
        name: 'Spot Instances',
        fullName: 'Amazon EC2 Spot Instances',
        link: en.docs('AWSEC2/latest/UserGuide/spot-best-practices.html'),
        summary:
          'Spare EC2 capacity at up to 90% off On-Demand. EC2 can reclaim it at any time, so the workload must tolerate interruption.',
        points: [
          '**Interruption notice**: a 2-minute warning arrives as an EventBridge event and in instance metadata. The behavior can be terminate, stop or hibernate.',
          '**Rebalance recommendation**: an earlier signal of elevated risk. **Capacity Rebalancing** in Auto Scaling groups and EC2 Fleet replaces the instance before the notice.',
          '**Diversify**: be flexible across instance types (at least 10 per workload is the rule of thumb) and every AZ, or use attribute-based instance type selection.',
          '**Allocation strategy**: `price-capacity-optimized` picks the pools with the most spare capacity at the lowest price, which lowers the chance of interruption.',
          '**Mixed instances group**: one Auto Scaling group with an On-Demand base and Spot above it, across several types. EC2 Fleet does the same when you manage the lifecycle yourself. Spot Fleet (`RequestSpotFleet`) is a legacy API.',
          '**Fit**: stateless web tiers, batch, CI/CD, big data, HPC, rendering and containers. Not for stateful, tightly coupled or interruption-intolerant work.',
        ],
        tip: '"Batch job, can restart, lowest cost" -> **Spot** with checkpoints. "Database that must stay up" -> never Spot. "Always keep 2 instances, scale out cheaply" -> **mixed instances group** with an On-Demand base and Spot on top.',
      },
      {
        id: 'dedicated-capacity',
        name: 'Dedicated capacity',
        fullName: 'Dedicated Hosts, Dedicated Instances and Capacity Reservations',
        link: en.aws('ec2/dedicated-hosts/'),
        summary:
          'Single-tenant hardware answers compliance and licensing needs, and Capacity Reservations answer capacity needs. Neither is the cheap option on its own.',
        points: [
          '**Dedicated Hosts**: a whole physical server with visibility of sockets and physical cores, host affinity and per-host billing. Bring per-socket, per-core or per-VM licenses.',
          '**Dedicated Instances**: instances on single-tenant hardware, billed per instance, without control over placement on the host.',
          '**On-Demand Capacity Reservations**: capacity in one AZ for any duration, no commitment for immediate use, cancel at any time. Billed whether instances run or not.',
          '**Future-dated reservations**: request capacity for a future date with a commitment period, for planned events and launches.',
          '**Capacity Blocks**: reserve a cluster of GPU instances for machine learning.',
        ],
        tip: '"License priced per socket or per core, keep using it on AWS" -> **Dedicated Hosts**. "Only needs single-tenant hardware, no license visibility" -> **Dedicated Instances**.',
      },
      {
        id: 'rightsizing',
        name: 'Rightsizing',
        fullName: 'AWS Compute Optimizer',
        link: en.aws('compute-optimizer/'),
        summary:
          'A discount on an oversized instance still wastes money. Rightsize and remove idle resources first, then commit to the new baseline.',
        points: [
          '**Compute Optimizer**: analyzes the last 14 days of CloudWatch metrics and recommends sizes and idle resources for EC2, Auto Scaling groups, EBS, Lambda, ECS on Fargate, RDS, Aurora and more.',
          '**Enhanced infrastructure metrics**: a paid option that extends the lookback to 93 days, so monthly or quarterly peaks count.',
          '**Instance family**: pick by the bottleneck. General purpose (M, T), compute optimized (C), memory optimized (R, X), storage optimized (I).',
          '**Graviton**: Arm-based instances cost up to 20% less than comparable x86 instances and use up to 60% less energy for the same performance. Also offered in RDS, Aurora and EKS.',
          '**Order of work**: rightsize, then buy Savings Plans or Reserved Instances, so the commitment is not sized to waste.',
        ],
        tip: '"Instances average 10% CPU, cut cost with least effort" -> **Compute Optimizer** recommendations and a smaller size. "Same performance, lower price, code runs on Arm" -> **Graviton**.',
      },
      {
        id: 'serverless-containers',
        name: 'Lambda and Fargate',
        fullName: 'AWS Lambda and AWS Fargate',
        link: en.aws('fargate/pricing/'),
        summary:
          'Serverless removes idle cost: you pay per request and duration, or per task second. At a high, steady load, well-used instances can be cheaper.',
        points: [
          '**Lambda**: billed by requests and duration in GB-seconds, so memory size drives cost. Nothing is billed while idle.',
          '**Lambda on Arm**: the `arm64` architecture (Graviton2) offers up to 34% better price performance than x86.',
          '**Provisioned Concurrency**: removes cold starts, but you pay for the configured concurrency for as long as it is set, even with no traffic.',
          '**Fargate**: billed per second for vCPU, memory and storage above the 20 GB included, with a 1-minute minimum (5 minutes for Windows). No instances to patch or bin-pack.',
          '**Fargate Spot and Savings Plans**: Fargate Spot is up to 70% off for interruption-tolerant ECS tasks. Compute Savings Plans cut steady Fargate use by up to 50%.',
          '**Trade-off**: EC2 with Auto Scaling for constant high utilization, Lambda for spiky or event-driven loads, Fargate for containers without cluster management.',
        ],
        tip: '"Runs a few times a day, a few seconds each time" -> **Lambda**, not an always-on instance. "Containers, no servers to manage, can be interrupted" -> **Fargate Spot**.',
      },
      {
        id: 'scheduling',
        name: 'Scheduling and hibernation',
        fullName: 'Instance Scheduler on AWS',
        link: en.docs('solutions/instance-scheduler-on-aws/'),
        summary:
          'Non-production environments rarely need to run at night or need production availability. Stop them off hours, run them smaller and in fewer AZs.',
        points: [
          '**Instance Scheduler on AWS**: an AWS Solution that starts and stops EC2 instances, Auto Scaling groups and RDS instances on tag-based schedules, across accounts and Regions.',
          '**Stopped EC2**: no instance charge, but EBS volumes and public IPv4 or Elastic IP addresses are still billed.',
          '**Hibernation**: saves RAM to the encrypted EBS root volume and resumes the processes with the same instance ID. Enabled at launch, Linux RAM under 150 GiB. Pre-warms apps with slow startup.',
          '**Stopped RDS**: no instance-hour charge, but storage and backups are billed, and RDS starts the instance again after 7 consecutive days.',
          '**Availability by class**: production gets Multi-AZ and headroom. Dev and test can run in one AZ, smaller and only in working hours.',
        ],
        tip: '"Dev environment used only in business hours" -> **scheduled stop and start** with Instance Scheduler. "App needs 20 minutes to warm its memory before serving" -> **hibernation**, not a plain stop.',
      },
    ],
  },
  {
    slug: 'cost-storage',
    group: 'cost',
    icon: 'storage',
    title: 'Storage costs',
    summary:
      'S3 classes, lifecycle and tiering, cheaper EBS and file storage, archive retrieval times and the lowest cost way to move data in.',
    lede: 'Keeping each byte in the cheapest tier its access pattern allows, and moving it there automatically. This is **Domain 4: Design Cost-Optimized Architectures**, 20% of the scored content.',
    sections: [
      {
        id: 's3-classes',
        name: 'S3 storage classes',
        fullName: 'Amazon S3 storage classes',
        link: en.docs('AmazonS3/latest/userguide/storage-class-intro.html'),
        summary:
          'Cheaper classes trade storage price for retrieval fees, minimum storage durations and minimum billable sizes. These hidden charges decide most exam answers.',
        points: [
          '**Minimum duration**: 30 days for Standard-IA and One Zone-IA, 90 days for Glacier Instant Retrieval and Glacier Flexible Retrieval, 180 days for Glacier Deep Archive. Deleting earlier is billed as if kept.',
          '**Minimum billable size**: 128 KB for Standard-IA, One Zone-IA and Glacier Instant Retrieval. Glacier Flexible Retrieval and Deep Archive add 40 KB of metadata per object.',
          '**Retrieval fees**: per GB for the IA and Glacier classes. Standard and Intelligent-Tiering have none.',
          '**One Zone-IA**: one AZ and cheaper than Standard-IA, for data you can re-create, such as replicas or derived files.',
          '**Express One Zone**: single-digit millisecond access in one AZ with request costs 50% lower than Standard. A performance class, not an archive.',
        ],
        tip: '"Millions of 20 KB objects, rarely read" -> keep them in **Standard** or aggregate them, the 128 KB minimum makes IA cost more. "Re-creatable thumbnails, rarely read" -> **One Zone-IA**.',
        table: {
          title: 'S3 classes and their hidden charges',
          head: ['Class', 'Minimums and fees'],
          rows: [
            { key: 'Standard', cells: ['No minimum duration or size, no retrieval fee. 3 or more AZs.'] },
            {
              key: 'Intelligent-Tiering',
              cells: ['No minimum duration, no retrieval fee, a monitoring fee per object.'],
            },
            { key: 'Standard-IA', cells: ['30 days, 128 KB, per-GB retrieval. 3 or more AZs.'] },
            { key: 'One Zone-IA', cells: ['30 days, 128 KB, per-GB retrieval. 1 AZ.'] },
            {
              key: 'Glacier Instant Retrieval',
              cells: ['90 days, 128 KB, per-GB retrieval. Milliseconds, for data read about once a quarter.'],
            },
            {
              key: 'Glacier Flexible Retrieval',
              cells: ['90 days, 40 KB overhead per object, restore in minutes to hours.'],
            },
            { key: 'Glacier Deep Archive', cells: ['180 days, 40 KB overhead per object, restore in 12 to 48 hours.'] },
          ],
        },
      },
      {
        id: 's3-lifecycle',
        name: 'S3 Lifecycle',
        fullName: 'Amazon S3 Lifecycle',
        link: en.docs('AmazonS3/latest/userguide/object-lifecycle-mgmt.html'),
        summary:
          'Lifecycle rules move objects down the storage class waterfall or delete them on a schedule, with no code. The schedule must respect each class minimum.',
        points: [
          '**Transition actions**: move objects by age, prefix, tag or size, from Standard down to IA, Intelligent-Tiering, Glacier and Deep Archive. Deep Archive is a one-way door.',
          '**Expiration actions**: delete current versions, permanently delete noncurrent versions with `NoncurrentVersionExpiration` and clean up expired delete markers.',
          '**Small objects**: by default objects under 128 KB are not transitioned, because the per-object transition request can cost more than it saves. A size filter overrides it.',
          '**Minimum duration**: moving out of a class early bills the rest of its minimum. One rule cannot go to Glacier Instant Retrieval at day 4 and Deep Archive at day 20, the second step must wait until day 94.',
          '**Billing date**: transitions to Glacier Flexible Retrieval and Deep Archive bill at the new rate from the day the rule is met. Intelligent-Tiering bills after the physical move.',
        ],
        tip: '"Logs read for 30 days, kept 7 years for audit, lowest cost" -> **Lifecycle** transitions down to **Deep Archive** plus an expiration at 7 years. A scheduled Lambda that copies objects is the distractor.',
      },
      {
        id: 'intelligent-tiering',
        name: 'Intelligent-Tiering',
        fullName: 'Amazon S3 Intelligent-Tiering',
        link: en.aws('s3/storage-classes/intelligent-tiering/'),
        summary:
          'The class for unknown or changing access patterns. It moves each object between tiers by its own access history, with no retrieval fees.',
        points: [
          '**Automatic tiers**: Frequent Access, Infrequent Access after 30 days without access, Archive Instant Access after 90 days. Any access moves the object back to Frequent Access.',
          '**Optional archive tiers**: Archive Access from 90 days and Deep Archive Access from 180 days, configurable up to 730 days. Objects there must be restored before reading.',
          '**Costs**: a small monthly monitoring and automation fee per object, no retrieval fees and no minimum storage duration.',
          '**Small objects**: under 128 KB they are not monitored and always stay in Frequent Access.',
          '**Adoption**: set it as the storage class at upload, or move existing objects into it with a Lifecycle rule.',
        ],
        tip: '"Access pattern unknown or unpredictable, no operational effort" -> **Intelligent-Tiering**. "Known pattern, hot for 30 days and then cold" -> a **Lifecycle** rule, which avoids the per-object monitoring fee.',
      },
      {
        id: 's3-visibility',
        name: 'S3 cost visibility',
        fullName: 'S3 Storage Lens, Storage Class Analysis and Requester Pays',
        link: en.docs('AmazonS3/latest/userguide/storage_lens.html'),
        summary:
          'Storage Lens and Storage Class Analysis show where the bytes and the waste are. Requester Pays moves download costs to whoever reads the data.',
        points: [
          '**S3 Storage Lens**: organization-wide view down to account, Region, storage class, bucket and prefix. Flags buckets without lifecycle rules for incomplete multipart uploads older than 7 days. Free metrics plus a paid advanced tier.',
          '**Storage Class Analysis**: observes a bucket, prefix or tag for 30 days or more and tells when to move Standard objects to Standard-IA. It recommends nothing else.',
          '**Requester Pays**: the requester pays for requests and data download, the bucket owner still pays storage. Requests must be authenticated and send `x-amz-request-payer`, anonymous access is not allowed.',
        ],
        tip: '"Share a large dataset, the consumers must pay for downloads" -> **Requester Pays**. "Find the age when objects become cold to tune lifecycle" -> **Storage Class Analysis**. "Organization-wide view of storage and waste" -> **Storage Lens**.',
      },
      {
        id: 'ebs',
        name: 'EBS volumes and snapshots',
        fullName: 'Amazon EBS',
        link: en.docs('ebs/latest/userguide/general-purpose.html'),
        summary:
          'Block storage is billed for what you provision, not what you use. Pick the cheapest type that meets IOPS and throughput, and archive old snapshots.',
        points: [
          '**gp2 to gp3**: gp3 costs 20% less per GiB, includes 3,000 IOPS and 125 MiB/s at any size, and scales IOPS and throughput apart from size. Change it in place with Elastic Volumes, no downtime.',
          '**gp2 trap**: IOPS grow at 3 per GiB, so teams buy capacity just to get IOPS. gp3 removes that.',
          '**HDD types**: `st1` for frequent, large sequential throughput (EMR, ETL, logs), `sc1` the lowest cost for cold sequential data. Neither can be a boot volume.',
          '**Snapshots Archive**: up to 75% lower snapshot storage cost for snapshots kept 90 days or more. Stored as full snapshots, 90-day minimum, restore takes up to 72 hours.',
          '**Clean up**: unattached volumes and old snapshots keep billing. Compute Optimizer and Trusted Advisor flag underutilized volumes.',
        ],
        tip: '"Lower EBS cost, same performance, no downtime" -> **modify gp2 to gp3**. "Keep yearly snapshots for compliance, rarely restored" -> **EBS Snapshots Archive**.',
      },
      {
        id: 'file-storage',
        name: 'EFS and FSx',
        fullName: 'Amazon EFS and Amazon FSx',
        link: en.aws('efs/storage-classes/'),
        summary:
          'File storage gets much cheaper when cold files leave the primary tier. EFS does it with lifecycle policies, FSx with storage type and data reduction choices.',
        points: [
          '**EFS classes**: Standard (sub-millisecond), Infrequent Access (up to 95% cheaper) and Archive (up to 50% cheaper than IA, 90-day minimum). IA and Archive bill at least 128 KiB per file.',
          '**EFS lifecycle management**: by default moves files not accessed for 30 days to IA and for 90 days to Archive. It can move a file back to Standard on first access.',
          '**EFS One Zone**: data in a single AZ, for data that does not need multi-AZ resilience. Access from another AZ pays $0.01 per GB cross-AZ transfer. Archive needs a Regional file system with Elastic Throughput.',
          '**FSx for Windows File Server**: HDD for home directories and shares, SSD for latency-sensitive work. Data Deduplication typically saves 50 to 60% on general file shares.',
          '**FSx for Lustre**: scratch file systems for short, temporary processing with no replication, persistent ones for long-term data. The Intelligent-Tiering storage class moves cold data to cheaper tiers.',
        ],
        tip: '"Shared Linux files, most untouched after a month" -> **EFS lifecycle management** to IA or Archive. "Temporary HPC working space at the lowest cost" -> **FSx for Lustre scratch**, not persistent.',
      },
      {
        id: 'archive',
        name: 'Archive retrieval',
        fullName: 'S3 Glacier storage classes',
        link: en.docs('AmazonS3/latest/userguide/restoring-objects-retrieval-options.html'),
        summary:
          'The cheaper the archive, the slower and costlier the way back. Choose the class by how fast a restore must finish, not only by price per GB.',
        points: [
          '**Glacier Instant Retrieval**: millisecond reads with no restore step, for archives read about once a quarter.',
          '**Bulk is free**: Bulk retrievals cost nothing from Glacier Flexible Retrieval and Intelligent-Tiering. Expedited is a premium option.',
          '**Provisioned capacity**: guarantees Expedited retrievals from Glacier Flexible Retrieval when demand is high.',
          '**Restored copy**: a temporary copy is billed at the Standard rate while the archived object keeps billing at its own rate.',
          '**Large restores**: up to 1 to 2 PB per day per account, and S3 Batch Operations to restore many objects with one request.',
        ],
        tip: '"Archive, occasionally needed within minutes" -> **Glacier Flexible Retrieval** with Expedited. "Kept 10 years, 48 hours is fine, lowest cost" -> **Glacier Deep Archive**. "Rarely read but must open in milliseconds" -> **Glacier Instant Retrieval**.',
        table: {
          title: 'Restore times',
          head: ['Class or tier', 'Retrieval options'],
          rows: [
            { key: 'Glacier Instant Retrieval', cells: ['Milliseconds, no restore needed.'] },
            {
              key: 'Glacier Flexible Retrieval',
              cells: ['Expedited 1 to 5 minutes. Standard 3 to 5 hours. Bulk 5 to 12 hours.'],
            },
            { key: 'Glacier Deep Archive', cells: ['No Expedited. Standard within 12 hours. Bulk within 48 hours.'] },
            { key: 'Intelligent-Tiering Archive Access', cells: ['Same as Glacier Flexible Retrieval.'] },
            { key: 'Intelligent-Tiering Deep Archive Access', cells: ['Same as Glacier Deep Archive.'] },
          ],
        },
      },
      {
        id: 'data-transfer-in',
        name: 'Moving data in',
        fullName: 'AWS DataSync and AWS Transfer Family',
        link: en.aws('datasync/'),
        summary:
          'Data transfer from the internet into AWS is free, so the cost is in the tool, the link and the time. Pick by data size, bandwidth and deadline.',
        points: [
          '**AWS DataSync**: managed online transfer from NFS, SMB, HDFS, object storage and other clouds to S3, EFS and FSx, or straight to Glacier classes. Incremental, compressed, validated and encrypted, and one task can fill 10 Gbps.',
          '**Slow links**: for a large migration, run DataSync over a hosted Direct Connect connection bought only for the project.',
          '**Snowball Edge**: no longer available to new customers. AWS points them to DataSync, to [AWS Data Transfer Terminal](https://aws.amazon.com/data-transfer-terminal/) for physical uploads and to Outposts for edge compute.',
          '**AWS Transfer Family**: managed SFTP, FTPS, FTP, AS2 and browser-based transfers into S3 or EFS, so partners keep their clients and you run no servers.',
          '**Batch uploads**: fewer, larger objects cut per-request charges and lifecycle transition costs.',
        ],
        tip: '"Partners upload over SFTP, retire the self-managed server" -> **Transfer Family**. "Migrate hundreds of TB from NFS with ongoing sync and integrity checks" -> **DataSync**. Older questions may still offer Snowball Edge as the offline option for huge datasets on thin links.',
      },
    ],
  },
  {
    slug: 'cost-network',
    group: 'cost',
    icon: 'network',
    title: 'Network costs',
    summary:
      'Data transfer pricing, NAT gateways, VPC endpoints, CloudFront and hybrid links, chosen to keep traffic on the cheapest path.',
    lede: 'Data transfer is the part of the bill that architecture decides: where traffic crosses AZs, Regions, NAT and the internet. This is **Domain 4: Design Cost-Optimized Architectures**, 20% of the scored content.',
    sections: [
      {
        id: 'data-transfer',
        name: 'Data transfer pricing',
        link: en.docs('cur/latest/userguide/cur-data-transfers-charges.html'),
        summary:
          'In AWS you pay mostly for data going out and across boundaries. Every AZ, Region or internet hop on the path can add a charge.',
        points: [
          '**Inbound**: data from the internet into AWS is free.',
          '**Internet egress**: billed per GB, with the first 100 GB per month free, aggregated across services and Regions.',
          '**Between AZs**: billed in both directions, for example $0.01 per GB in and out over VPC peering. Chatty tiers spread across AZs pay on every call.',
          '**Between Regions**: billed on the sending Region, the receiving side is free. Cross-Region replication always carries this cost.',
          '**S3 in the same Region**: transfer from S3 to other AWS services in the same Region, and from S3 to CloudFront, is free.',
          '**Public IPv4**: every public IPv4 address, in use or idle, costs $0.005 per hour.',
        ],
        tip: '"Cut transfer cost between the app tier and the database" -> keep chatty components in the **same AZ** where availability allows, or cache. Cross-Region replication only pays off when DR or latency requires it.',
        table: {
          title: 'What it costs to move a GB',
          head: ['Path', 'Charge'],
          rows: [
            { key: 'Internet to AWS', cells: ['Free.'] },
            { key: 'AWS to internet', cells: ['Per GB, first 100 GB per month free across all services.'] },
            { key: 'Same AZ over VPC peering', cells: ['Free since May 2021.'] },
            { key: 'Across AZs', cells: ['Per GB in each direction.'] },
            { key: 'Across Regions', cells: ['Per GB on the source Region, inbound free.'] },
            { key: 'S3 to CloudFront', cells: ['Free.'] },
            { key: 'Through a NAT gateway', cells: ['Per GB processing fee on top of data transfer.'] },
          ],
        },
      },
      {
        id: 'nat',
        name: 'NAT gateways',
        fullName: 'NAT gateways and NAT instances',
        link: en.docs('vpc/latest/userguide/vpc-nat-gateway.html'),
        summary:
          'A NAT gateway bills per hour and per GB processed, so heavy outbound traffic, or traffic to AWS services sent through NAT, gets expensive.',
        points: [
          '**Charges**: an hourly fee plus a per-GB processing fee whatever the destination, for example $0.045 per hour and $0.045 per GB in US East (Ohio), plus normal data transfer.',
          '**One per AZ vs shared**: a zonal NAT gateway in each AZ survives an AZ failure and avoids cross-AZ charges. One shared gateway saves hours but is a single point of failure and adds inter-AZ transfer.',
          '**Regional NAT gateway**: one gateway ID that expands to every AZ with workloads, billed per AZ hour, with no public subnet needed. It does not support private NAT.',
          '**NAT instance**: you pay only for the instance, with no processing fee, but you manage failover, patching and sizing, and bandwidth depends on the instance type. AWS recommends NAT gateways.',
          '**Avoid NAT for AWS services**: gateway endpoints for S3 and DynamoDB, interface endpoints for other services.',
        ],
        tip: '"Production, must survive an AZ failure" -> **one NAT gateway per AZ** or a regional NAT gateway. "Dev VPC, minimize cost" -> **one shared NAT gateway**. "Large NAT bill caused by S3 traffic" -> **S3 gateway endpoint**.',
      },
      {
        id: 'vpc-endpoints',
        name: 'VPC endpoints',
        fullName: 'Gateway and interface VPC endpoints',
        link: en.aws('privatelink/pricing/'),
        summary:
          'Endpoints keep traffic to AWS services off the NAT gateway and the internet. Gateway endpoints are free, interface endpoints are not.',
        points: [
          '**Gateway endpoints**: S3 and DynamoDB only, a target in the route table, with no hourly or processing charge.',
          '**Interface endpoints**: an ENI per AZ through PrivateLink, billed per hour per AZ plus per GB processed, for example $0.01 per hour and $0.01 per GB for the first PB.',
          '**Reach**: a gateway endpoint serves only its own VPC and Region. Resources in a peered VPC cannot use it.',
          '**Break-even**: an interface endpoint pays off when the NAT processing it replaces costs more than its hours and per-GB fee.',
        ],
        tip: '"Private instances push TBs to S3 through NAT, cut cost" -> **S3 gateway endpoint**. An interface endpoint for S3 is the distractor here, it bills per hour and per GB.',
      },
      {
        id: 'cloudfront',
        name: 'CloudFront',
        fullName: 'Amazon CloudFront',
        link: en.aws('cloudfront/pricing/'),
        summary:
          'Caching at the edge cuts origin load and origin egress. Fewer requests reach EC2 or S3, so the origin can be smaller and transfers less.',
        points: [
          '**S3 to CloudFront**: free, so you pay CloudFront delivery instead of S3 internet egress.',
          '**Cache hit ratio**: longer TTLs and fewer cache key values mean fewer origin fetches and smaller origins.',
          '**Price class**: set the maximum price you want to pay, serving from fewer edge Regions, at the cost of latency for distant viewers.',
          '**Flat-rate plans**: monthly plans with no overage charges, from a Free plan with 100 GB upward. Blocked DDoS attacks and WAF-blocked requests do not count against the allowance.',
          '**vs Global Accelerator**: CloudFront caches HTTP content, Global Accelerator does not cache.',
        ],
        tip: '"Global users download the same static files, reduce cost and latency" -> **CloudFront** in front of S3. Bigger instances or replicating buckets to more Regions are the distractors.',
      },
      {
        id: 'hybrid-connectivity',
        name: 'Direct Connect vs VPN',
        fullName: 'AWS Direct Connect and AWS Site-to-Site VPN',
        link: en.aws('directconnect/pricing/pay-as-you-go/'),
        summary:
          'The cheapest link depends on volume and bandwidth. VPN rides the internet and is quick to set up. Direct Connect bills port hours but lowers per-GB egress and gives consistent bandwidth.',
        points: [
          '**Site-to-Site VPN**: billed per connection hour plus normal data transfer out. Up to 1.25 Gbps per standard tunnel and up to 5 Gbps per large bandwidth tunnel.',
          '**Scaling VPN**: ECMP across several tunnels on a transit gateway, with dynamic routing, aggregates bandwidth.',
          '**Direct Connect**: port hours are billed even with no traffic, data in is free, data out has its own lower rate, for example $0.02 per GB from US East (Ohio) to Columbus.',
          '**Port speeds**: dedicated 1, 10, 100 and 400 Gbps, hosted from 50 Mbps to 25 Gbps through partners. Pick the smallest port that meets the peak.',
        ],
        tip: '"Moves tens of TB per month to on premises, needs consistent throughput" -> **Direct Connect**. "Connect a branch within days, low volume" -> **Site-to-Site VPN**. "Need more than 1.25 Gbps over VPN" -> **several tunnels with ECMP** on a transit gateway.',
        table: {
          title: 'Choosing the link',
          head: ['Link', 'Cheapest fit'],
          rows: [
            { key: 'Internet', cells: ['Low volume, no private connectivity requirement. Only data transfer out.'] },
            {
              key: 'Site-to-Site VPN',
              cells: ['Encrypted private access set up quickly, moderate volume, up to 1.25 Gbps per tunnel.'],
            },
            { key: 'Direct Connect hosted', cells: ['50 Mbps to 25 Gbps through a partner, steady traffic.'] },
            {
              key: 'Direct Connect dedicated',
              cells: ['1 to 400 Gbps, large steady volumes where the port hours pay off.'],
            },
          ],
        },
      },
      {
        id: 'vpc-connectivity',
        name: 'Transit Gateway vs peering',
        fullName: 'AWS Transit Gateway and VPC peering',
        link: en.aws('transit-gateway/pricing/'),
        summary:
          'Peering is the cheaper path for a few VPCs. Transit Gateway adds a per-attachment and per-GB fee in exchange for hub-and-spoke routing at scale.',
        points: [
          '**VPC peering**: no charge to create, data transfer within the same AZ is free and across AZs or Regions is billed. Not transitive and no overlapping CIDRs.',
          '**Transit Gateway**: billed per attachment hour and per GB sent into it, for example $0.05 per VPC attachment hour and $0.02 per GB in US East (Ohio). Data from a peering attachment has no processing fee.',
          '**Scale**: AWS recommends Transit Gateway or PrivateLink to connect hundreds or thousands of VPCs.',
          '**Shared hybrid link**: one VPN or Direct Connect attachment on the transit gateway serves every attached VPC.',
        ],
        tip: '"3 VPCs exchanging heavy traffic, lowest cost" -> **VPC peering**. "200 VPCs plus on premises, central routing" -> **Transit Gateway**.',
      },
      {
        id: 'global-accelerator',
        name: 'Global Accelerator',
        fullName: 'AWS Global Accelerator',
        link: en.aws('global-accelerator/pricing/'),
        summary:
          'Brings user traffic onto the AWS global network through 2 static anycast IPv4 addresses. It buys performance and availability, it does not reduce transfer cost.',
        points: [
          '**Fixed fee**: $0.025 per hour per accelerator, charged even while it is disabled.',
          '**DT-Premium**: per GB on the dominant traffic direction, on top of standard data transfer out.',
          '**Fit**: static IPs, fast failover between Regions, endpoints such as NLB, ALB, EC2 or Elastic IPs. No caching.',
          '**Cost lever**: pay for it only when the requirement is performance or static IPs. For cacheable HTTP content, CloudFront lowers origin cost instead.',
        ],
        tip: '"Game over UDP, static IPs, fast failover between Regions" -> **Global Accelerator**. "Reduce the cost of serving static content" -> **CloudFront**, not Global Accelerator.',
      },
      {
        id: 'api-gateway',
        name: 'API Gateway levers',
        fullName: 'Amazon API Gateway',
        link: en.docs('apigateway/latest/developerguide/api-gateway-caching.html'),
        summary: 'Throttling and caching keep the backend from paying for traffic it does not need to serve.',
        points: [
          '**Throttling**: limits per Region and account, per stage and method, and per client through usage plans. Excess requests get `429 Too Many Requests`.',
          '**Usage plans**: API keys with rate, burst and quotas per client. Throttles and quotas are best effort targets, not hard ceilings.',
          '**Caching**: REST API stage cache with a TTL of 300 seconds by default and up to 3600, only `GET` cached by default. Fewer calls reach Lambda or the database.',
          '**Cache cost**: billed per hour by cache size and not in the Free Tier, so it pays off only with a good hit rate.',
        ],
        tip: '"The same reads hit Lambda and DynamoDB over and over" -> **API Gateway caching**. "Limit a partner to 1,000 requests per day" -> **usage plan quota** with an API key.',
      },
    ],
  },
  {
    slug: 'cost-management',
    group: 'cost',
    icon: 'chart',
    title: 'Cost management',
    summary:
      'Cost Explorer, Budgets, Data Exports, tags, consolidated billing and the tools that find savings, plus database pricing choices.',
    lede: 'Seeing, allocating, alerting on and forecasting spend, and choosing database pricing that fits the load. This is **Domain 4: Design Cost-Optimized Architectures**, 20% of the scored content.',
    sections: [
      {
        id: 'cost-explorer',
        name: 'Cost Explorer',
        fullName: 'AWS Cost Explorer',
        link: en.aws('aws-cost-management/aws-cost-explorer/'),
        summary:
          'The interactive view of cost and usage: filter, group, compare periods and forecast. The usual answer to "analyze where the money goes".',
        points: [
          '**History and forecast**: up to 13 months of history and a forecast for the next 18 months. Data refreshes at least once every 24 hours.',
          '**Analysis**: filter and group by service, account, Region, usage type or tag, and download as CSV.',
          '**Recommendations**: Reserved Instance purchase recommendations. Savings Plans recommendations, based on past usage, sit in the same Billing and Cost Management console and in the Cost Explorer API.',
          '**Cost**: free in the console. The API costs $0.01 per paginated request.',
        ],
        tip: '"Visualize which service drove last month increase" -> **Cost Explorer**. "Be warned before overspending" is AWS Budgets, not Cost Explorer.',
      },
      {
        id: 'budgets',
        name: 'Budgets',
        fullName: 'AWS Budgets',
        link: en.aws('aws-cost-management/aws-budgets/'),
        summary:
          'Thresholds on cost, usage or commitment metrics, with alerts on actual or forecasted values and optional automatic actions.',
        points: [
          '**Types**: cost, usage, RI utilization, RI coverage, Savings Plans utilization and Savings Plans coverage.',
          '**Alerts**: on actual or forecasted values, to email or an SNS topic, and to chat applications.',
          '**Budget actions**: apply an IAM policy or an SCP, or stop specific EC2 or RDS instances, automatically or after approval.',
          '**Not a hard cap**: data updates up to 3 times a day, so spend can pass the threshold before the alert arrives.',
          '**Organizations**: from the management account an action can apply an SCP to another account, but cannot stop instances in it.',
        ],
        tip: '"Block new provisioning automatically when the forecast passes 90%" -> **budget action** with a deny IAM policy or SCP. "Notify when Savings Plans utilization drops below 80%" -> **Savings Plans utilization budget**.',
      },
      {
        id: 'anomaly-detection',
        name: 'Anomaly Detection',
        fullName: 'AWS Cost Anomaly Detection',
        link: en.aws('aws-cost-management/aws-cost-anomaly-detection/'),
        summary:
          'Machine learning that learns normal spend and alerts on unusual spikes with root cause analysis, without fixed thresholds.',
        points: [
          '**Monitors**: all AWS services evaluated independently, or specific member accounts, cost allocation tags or cost categories.',
          '**Alerts**: individual alerts or aggregated reports, by email or an SNS topic, which can be routed to Slack or Chime.',
          '**Root cause**: ranked by dollar impact across service, account, Region and usage type.',
          '**Timing**: runs about 3 times a day on net unblended cost and can take up to 24 hours to flag an anomaly. A new service needs 10 days of history.',
          '**Gap**: most AWS Marketplace charges are not monitored, use Budgets for those.',
        ],
        tip: '"Detect unexpected spend spikes without setting thresholds" -> **Cost Anomaly Detection**. A fixed budget threshold is the distractor.',
      },
      {
        id: 'data-exports',
        name: 'Data Exports and CUR',
        fullName: 'AWS Data Exports',
        link: en.docs('cur/latest/userguide/what-is-data-exports.html'),
        summary:
          'The most granular cost data, delivered as files to S3 for Athena, Redshift or Amazon Quick. CUR 2.0 in Data Exports is the current form of the Cost and Usage Report.',
        points: [
          '**CUR 2.0**: the recommended export, with a fixed schema, nested columns for tags, cost categories, product and discount, and account names.',
          '**SQL customization**: choose columns, filter rows and rename them, so the export carries only what you need.',
          '**Other tables**: Cost Optimization Hub recommendations, FOCUS 1.0 and 1.2 with AWS columns, and carbon emissions.',
          '**Legacy CUR**: still offered as a legacy data export, with a schema that changes with your usage.',
          '**Delivery**: ZIP, GZIP or Parquet to an S3 bucket. A pre-built cost and usage dashboard can be deployed to Amazon Quick.',
        ],
        tip: '"Most detailed line-item cost data, query it with SQL in Athena" -> **CUR 2.0 through Data Exports**. Cost Explorer is the distractor, it is for interactive analysis, not raw files.',
      },
      {
        id: 'cost-allocation-tags',
        name: 'Cost allocation tags',
        link: en.docs('awsaccountbilling/latest/aboutv2/cost-alloc-tags.html'),
        summary:
          'Tags become cost dimensions only after activation in the Billing console. They are how showback and chargeback by team, project or environment work.',
        points: [
          '**User-defined**: you create and apply them. They show with the `user:` prefix.',
          '**AWS-generated**: AWS or Marketplace sellers apply them, with the `aws:` prefix, for example `aws:createdBy`.',
          '**Activation**: each type is activated separately, only by the management account or a standalone account, and can take up to 24 hours to appear.',
          '**Backfill**: the management account can backfill activation for up to 12 months, once every 24 hours.',
          '**Use**: filters in Cost Explorer and Budgets, columns in the CUR, monitors in Cost Anomaly Detection.',
        ],
        tip: '"Resources are tagged but per-project costs do not show in Cost Explorer" -> **activate the cost allocation tags** in the Billing console. Tagging the resources again is the distractor.',
      },
      {
        id: 'consolidated-billing',
        name: 'Consolidated billing',
        fullName: 'Consolidated billing in AWS Organizations',
        link: en.docs('awsaccountbilling/latest/aboutv2/consolidated-billing.html'),
        summary:
          'One bill for every account in the organization, paid by the management account, with usage combined for discounts.',
        points: [
          '**One bill**: the management account pays for all member accounts, at no extra cost.',
          '**Volume discounts**: usage is combined across accounts, so tiered prices drop sooner than in standalone accounts.',
          '**RI and Savings Plans sharing**: on by default, applied first to the owner account and then to the rest. It can be turned off per account or limited to groups defined with Cost Categories.',
          '**Leaving**: an account that leaves the organization loses access to Cost Explorer data from its time in it.',
        ],
        tip: '"Several accounts, want one invoice and volume discounts" -> **AWS Organizations consolidated billing**. "Keep one unit RI discount away from other accounts" -> **restrict or turn off RI and Savings Plans sharing**.',
      },
      {
        id: 'optimization-tools',
        name: 'Advisors and estimates',
        fullName: 'Trusted Advisor, Cost Optimization Hub and AWS Pricing Calculator',
        link: en.aws('premiumsupport/technology/trusted-advisor/'),
        summary: 'Tools that find waste in what runs today and estimate what you plan to run next.',
        points: [
          '**Trusted Advisor cost checks**: low utilization EC2 instances, idle load balancers, underutilized EBS volumes, unassociated Elastic IPs, idle RDS instances and commitment recommendations.',
          '**Support plan**: all checks need Business Support+, Enterprise Support or Unified Operations. Basic only gets service limits and some security and fault tolerance checks.',
          '**Cost Optimization Hub**: rightsizing, idle, Savings Plans and RI recommendations across accounts and Regions in one place, with deduplicated savings that reflect your discounts.',
          '**AWS Pricing Calculator**: free estimates before you build, shared by link or exported to CSV or PDF. Taxes are not included.',
        ],
        tip: '"Estimate the monthly cost of a planned migration" -> **AWS Pricing Calculator**, not Cost Explorer, which only covers what already runs.',
        table: {
          title: 'Which tool answers which question',
          head: ['Question', 'Tool'],
          rows: [
            { key: 'What will this new design cost?', cells: ['AWS Pricing Calculator.'] },
            { key: 'Where did the money go?', cells: ['Cost Explorer.'] },
            { key: 'Warn or act at a limit', cells: ['AWS Budgets.'] },
            { key: 'Alert on an unusual spike', cells: ['Cost Anomaly Detection.'] },
            { key: 'Raw line items for SQL', cells: ['Data Exports with CUR 2.0.'] },
            {
              key: 'Oversized or idle resources',
              cells: ['Compute Optimizer, Cost Optimization Hub, Trusted Advisor.'],
            },
            { key: 'Cost per team or project', cells: ['Cost allocation tags.'] },
          ],
        },
      },
      {
        id: 'database-costs',
        name: 'Database pricing',
        fullName: 'Amazon DynamoDB, Aurora and RDS pricing models',
        link: en.aws('dynamodb/pricing/'),
        summary:
          'Database bills follow the capacity model: per request, per provisioned unit, per ACU or per instance hour. Match it to how steady the load is.',
        points: [
          '**DynamoDB on-demand**: pay per request with no capacity planning, the default and recommended mode for most workloads. An optional maximum throughput caps cost.',
          '**DynamoDB provisioned**: pay hourly for RCUs and WCUs whether used or not, with auto scaling (70% target recommended). Reserved capacity saves up to 54% for 1 year or 77% for 3 years.',
          '**DynamoDB switches**: provisioned to on-demand up to 4 times in a rolling 24 hours, back at any time. The Standard-IA table class fits tables where storage dominates.',
          '**Aurora Serverless v2**: capacity in ACUs. With a minimum of 0 ACUs it pauses after 5 minutes to 1 day idle, with no instance charge while paused. Resuming takes about 15 seconds.',
          '**RDS**: Reserved Instances save up to 69% at steady state, with size flexibility for most engines. Database Savings Plans cover RDS, Aurora, DynamoDB and more for up to 35%.',
          '**Backups**: automated backup retention from 0 to 35 days (0 disables it). Manual snapshots stay, and keep billing, until you delete them.',
        ],
        tip: '"New app, unpredictable traffic, no capacity planning" -> **DynamoDB on-demand**. "Steady, well-known traffic, lowest cost" -> **provisioned with auto scaling and reserved capacity**. "Dev database idle most of the day" -> **Aurora Serverless v2 scaling to 0 ACUs**.',
        table: {
          title: 'Capacity models',
          head: ['Model', 'Best fit'],
          rows: [
            { key: 'DynamoDB on-demand', cells: ['Unknown, spiky or new traffic. Pay per request.'] },
            {
              key: 'DynamoDB provisioned',
              cells: ['Steady, predictable traffic with auto scaling, plus reserved capacity for the baseline.'],
            },
            {
              key: 'Aurora Serverless v2',
              cells: ['Variable or intermittent relational load, and dev or test that can pause at 0 ACUs.'],
            },
            {
              key: 'RDS or Aurora provisioned',
              cells: ['Steady 24/7 relational load, covered by RIs or Savings Plans.'],
            },
          ],
        },
      },
    ],
  },
]

export const ptBR: readonly Topic[] = [
  {
    slug: 'cost-compute',
    group: 'cost',
    icon: 'coin',
    title: 'Custos de computação',
    summary:
      'Opções de compra, Spot, rightsizing e os trade-offs do serverless para baixar a conta de computação sem perder a disponibilidade necessária.',
    lede: 'Pagar o menor preço pela capacidade que a carga realmente precisa: a opção de compra certa, o tamanho certo e só as horas em que ela roda. Este é o **Domínio 4: Design Cost-Optimized Architectures**, 20% do conteúdo pontuado.',
    sections: [
      {
        id: 'purchase-options',
        name: 'Opções de compra',
        fullName: 'Amazon EC2 billing and purchasing options',
        link: pt.docs('AWSEC2/latest/UserGuide/instance-purchasing-options.html'),
        summary:
          'A mesma instância custa valores bem diferentes conforme o jeito de comprar. Escolha a opção pelo quanto a carga é estável, longa e tolerante a interrupção.',
        points: [
          '**Base estável**: cubra com Savings Plans ou Reserved Instances e deixe o Auto Scaling somar On-Demand ou Spot nos picos.',
          '**Cobrança On-Demand**: por segundo, com mínimo de 60 segundos, para Linux e Windows. SUSE Linux Enterprise Server é cobrado por hora cheia.',
          '**Formas de pagamento**: All Upfront, Partial Upfront ou No Upfront. Quanto mais se paga adiantado, menor a tarifa.',
          '**Capacidade não é desconto**: Reserved Instances zonais e Capacity Reservations seguram capacidade em uma AZ. Reserved Instances regionais e Savings Plans dão desconto, mas não reservam capacidade.',
          '**Combinação**: Capacity Reservation não tem desconto próprio, mas Savings Plans ou Reserved Instances regionais se aplicam a ela.',
        ],
        tip: '"Carga estável 24/7 por 3 anos, menor preço" -> **Savings Plans ou Standard Reserved Instances**. "Garantir capacidade em uma AZ para um lançamento, sem compromisso longo" -> **On-Demand Capacity Reservation**, não Reserved Instance.',
        table: {
          title: 'Opções de compra em resumo',
          head: ['Opção', 'Uso ideal e desconto máximo'],
          rows: [
            { key: 'On-Demand', cells: ['Sem compromisso. Cargas curtas, com picos ou desconhecidas. Preço cheio.'] },
            {
              key: 'Compute Savings Plans',
              cells: [
                'USD por hora por 1 ou 3 anos em EC2, Fargate e Lambda, qualquer família, tamanho ou Region. Até 66%.',
              ],
            },
            {
              key: 'EC2 Instance Savings Plans',
              cells: ['Uma família de instância em uma Region, qualquer tamanho, SO ou tenancy. Até 72%.'],
            },
            {
              key: 'Standard Reserved Instances',
              cells: [
                'Configuração fixa por 1 ou 3 anos. Até 72%. Podem ser vendidas no Reserved Instance Marketplace.',
              ],
            },
            {
              key: 'Convertible Reserved Instances',
              cells: ['Podem ser trocadas por outra família, tipo, plataforma, escopo ou tenancy. Até 66%.'],
            },
            { key: 'Spot Instances', cells: ['Capacidade ociosa, interrompível com aviso de 2 minutos. Até 90%.'] },
            {
              key: 'Dedicated Hosts',
              cells: ['Um servidor físico inteiro, com visão de sockets e cores, para licenças atreladas ao servidor.'],
            },
            {
              key: 'Capacity Reservations',
              cells: ['Capacidade em uma AZ, sem prazo para uso imediato, cobrada com ou sem instância rodando.'],
            },
          ],
        },
      },
      {
        id: 'commitments',
        name: 'Savings Plans vs RIs',
        fullName: 'Savings Plans and Reserved Instances',
        link: pt.aws('savingsplans/'),
        summary:
          'Os dois trocam compromisso por tarifa menor. Savings Plans se comprometem com um gasto por hora e acompanham a carga, Reserved Instances se comprometem com uma configuração.',
        points: [
          '**Compute Savings Plans**: o mais flexível. Vale para EC2 independente de família, tamanho, AZ, Region, SO ou tenancy, e também para Fargate e Lambda. Até 66%.',
          '**EC2 Instance Savings Plans**: preso a uma família em uma Region, livre para mudar tamanho, SO e tenancy. Até 72%.',
          '**Convertible vs Standard RIs**: a Convertible pode ser trocada durante o prazo, mas não vendida. A Standard não pode ser trocada, mas pode ser vendida no Reserved Instance Marketplace.',
          '**Database Savings Plans**: compromisso de 1 ano, sem pagamento adiantado, para Aurora, RDS, DynamoDB, ElastiCache, DocumentDB, Neptune, Keyspaces, Timestream, DMS e OpenSearch Service. Até 35%.',
          '**Compartilhamento**: por padrão o desconto vale para todas as contas da organização. A conta de gerenciamento pode limitar a grupos ou desligar por conta.',
        ],
        tip: '"A carga pode migrar de EC2 para Fargate ou Lambda, ou para outra Region" -> **Compute Savings Plans**. "Maior desconto, a família da instância não vai mudar" -> **EC2 Instance Savings Plans** ou **Standard RIs**. Convertible RIs são o distrator quando aparecem Fargate ou Lambda.',
      },
      {
        id: 'spot',
        name: 'Spot Instances',
        fullName: 'Amazon EC2 Spot Instances',
        link: pt.docs('AWSEC2/latest/UserGuide/spot-best-practices.html'),
        summary:
          'Capacidade ociosa do EC2 com até 90% de desconto sobre o On-Demand. O EC2 pode tomá-la de volta a qualquer momento, então a carga precisa tolerar interrupção.',
        points: [
          '**Aviso de interrupção**: chega 2 minutos antes, como evento do EventBridge e nos metadados da instância. O comportamento pode ser terminar, parar ou hibernar.',
          '**Rebalance recommendation**: um sinal anterior de risco elevado. O **Capacity Rebalancing** em Auto Scaling groups e EC2 Fleet troca a instância antes do aviso.',
          '**Diversifique**: seja flexível em tipos de instância (pelo menos 10 por carga é a regra prática) e em todas as AZs, ou use a seleção de tipos por atributos.',
          '**Estratégia de alocação**: `price-capacity-optimized` escolhe os pools com mais capacidade sobrando pelo menor preço, o que reduz a chance de interrupção.',
          '**Mixed instances group**: um único Auto Scaling group com base On-Demand e Spot acima dela, em vários tipos. O EC2 Fleet faz o mesmo quando você gerencia o ciclo de vida. O Spot Fleet (`RequestSpotFleet`) é uma API legada.',
          '**Encaixe**: camadas web sem estado, batch, CI/CD, big data, HPC, renderização e containers. Não serve para carga com estado, fortemente acoplada ou intolerante a interrupção.',
        ],
        tip: '"Job batch, pode recomeçar, menor custo" -> **Spot** com checkpoints. "Banco de dados que não pode cair" -> nunca Spot. "Manter sempre 2 instâncias e crescer barato" -> **mixed instances group** com base On-Demand e Spot por cima.',
      },
      {
        id: 'dedicated-capacity',
        name: 'Capacidade dedicada',
        fullName: 'Dedicated Hosts, Dedicated Instances and Capacity Reservations',
        link: pt.aws('ec2/dedicated-hosts/'),
        summary:
          'Hardware exclusivo resolve exigências de compliance e licenciamento, e Capacity Reservations resolvem capacidade. Nenhum deles é a opção barata por si só.',
        points: [
          '**Dedicated Hosts**: um servidor físico inteiro, com visão de sockets e cores físicos, afinidade de host e cobrança por host. Permite trazer licenças por socket, por core ou por VM.',
          '**Dedicated Instances**: instâncias em hardware exclusivo, cobradas por instância, sem controle de posicionamento no host.',
          '**On-Demand Capacity Reservations**: capacidade em uma AZ por qualquer duração, sem compromisso para uso imediato e com cancelamento a qualquer momento. Cobradas com ou sem instância rodando.',
          '**Reservas com data futura**: pedem capacidade para uma data futura com período de compromisso, para eventos e lançamentos planejados.',
          '**Capacity Blocks**: reservam um cluster de instâncias com GPU para machine learning.',
        ],
        tip: '"Licença cobrada por socket ou por core, continuar usando na AWS" -> **Dedicated Hosts**. "Só precisa de hardware exclusivo, sem visão de licença" -> **Dedicated Instances**.',
      },
      {
        id: 'rightsizing',
        name: 'Rightsizing',
        fullName: 'AWS Compute Optimizer',
        link: pt.aws('compute-optimizer/'),
        summary:
          'Desconto em instância superdimensionada continua sendo desperdício. Ajuste o tamanho e remova recursos ociosos primeiro, depois assuma compromisso com a nova base.',
        points: [
          '**Compute Optimizer**: analisa os últimos 14 dias de métricas do CloudWatch e recomenda tamanhos e recursos ociosos para EC2, Auto Scaling groups, EBS, Lambda, ECS no Fargate, RDS, Aurora e outros.',
          '**Enhanced infrastructure metrics**: opção paga que estende a análise para 93 dias, para que picos mensais ou trimestrais entrem na conta.',
          '**Família de instância**: escolha pelo gargalo. Uso geral (M, T), otimizada para computação (C), para memória (R, X) e para armazenamento (I).',
          '**Graviton**: instâncias Arm custam até 20% menos que as x86 equivalentes e usam até 60% menos energia com o mesmo desempenho. Também disponíveis em RDS, Aurora e EKS.',
          '**Ordem do trabalho**: ajuste o tamanho e só depois compre Savings Plans ou Reserved Instances, para o compromisso não cobrir desperdício.',
        ],
        tip: '"Instâncias com média de 10% de CPU, reduzir custo com o menor esforço" -> recomendações do **Compute Optimizer** e um tamanho menor. "Mesmo desempenho, preço menor, o código roda em Arm" -> **Graviton**.',
      },
      {
        id: 'serverless-containers',
        name: 'Lambda e Fargate',
        fullName: 'AWS Lambda and AWS Fargate',
        link: pt.aws('fargate/pricing/'),
        summary:
          'Serverless elimina o custo ocioso: você paga por requisição e duração, ou por segundo de tarefa. Com carga alta e constante, instâncias bem usadas podem sair mais baratas.',
        points: [
          '**Lambda**: cobrado por requisições e duração em GB-segundos, então a memória define o custo. Nada é cobrado com a função parada.',
          '**Lambda em Arm**: a arquitetura `arm64` (Graviton2) oferece até 34% de preço-desempenho melhor que a x86.',
          '**Provisioned Concurrency**: elimina cold starts, mas você paga pela concorrência configurada enquanto ela existir, mesmo sem tráfego.',
          '**Fargate**: cobrado por segundo de vCPU, memória e armazenamento acima dos 20 GB incluídos, com mínimo de 1 minuto (5 minutos no Windows). Sem instâncias para corrigir ou encaixar.',
          '**Fargate Spot e Savings Plans**: o Fargate Spot tem até 70% de desconto para tarefas ECS que toleram interrupção. Compute Savings Plans reduzem o uso estável de Fargate em até 50%.',
          '**Trade-off**: EC2 com Auto Scaling para uso alto e constante, Lambda para cargas com picos ou orientadas a eventos, Fargate para containers sem gerenciar cluster.',
        ],
        tip: '"Roda algumas vezes por dia, poucos segundos cada" -> **Lambda**, não uma instância sempre ligada. "Containers, sem servidores para gerenciar, pode ser interrompido" -> **Fargate Spot**.',
      },
      {
        id: 'scheduling',
        name: 'Agendamento e hibernação',
        fullName: 'Instance Scheduler on AWS',
        link: pt.docs('solutions/instance-scheduler-on-aws/'),
        summary:
          'Ambientes de não produção raramente precisam rodar de madrugada ou ter disponibilidade de produção. Desligue fora do expediente e rode menor, em menos AZs.',
        points: [
          '**Instance Scheduler on AWS**: uma AWS Solution que liga e desliga instâncias EC2, Auto Scaling groups e instâncias RDS por agendas baseadas em tags, em várias contas e Regions.',
          '**EC2 parada**: não há cobrança de instância, mas volumes EBS e endereços IPv4 públicos ou Elastic IPs continuam sendo cobrados.',
          '**Hibernação**: grava a RAM no volume raiz EBS criptografado e retoma os processos com o mesmo ID de instância. Habilitada no lançamento, RAM abaixo de 150 GiB no Linux. Serve para aplicações que demoram a aquecer.',
          '**RDS parado**: sem cobrança de horas de instância, mas armazenamento e backups são cobrados, e o RDS religa a instância após 7 dias seguidos.',
          '**Disponibilidade por classe**: produção ganha Multi-AZ e folga. Dev e teste podem rodar em uma AZ, menores e só no horário comercial.',
        ],
        tip: '"Ambiente de dev usado só no horário comercial" -> **parar e ligar por agenda** com o Instance Scheduler. "Aplicação leva 20 minutos para carregar a memória antes de atender" -> **hibernação**, não um stop comum.',
      },
    ],
  },
  {
    slug: 'cost-storage',
    group: 'cost',
    icon: 'storage',
    title: 'Custos de armazenamento',
    summary:
      'Classes do S3, ciclo de vida e tiering, EBS e arquivos mais baratos, tempos de recuperação de arquivo e o jeito mais barato de trazer dados.',
    lede: 'Manter cada byte na camada mais barata que seu padrão de acesso permite, e levá-lo até lá automaticamente. Este é o **Domínio 4: Design Cost-Optimized Architectures**, 20% do conteúdo pontuado.',
    sections: [
      {
        id: 's3-classes',
        name: 'Classes do S3',
        fullName: 'Amazon S3 storage classes',
        link: pt.docs('AmazonS3/latest/userguide/storage-class-intro.html'),
        summary:
          'Classes mais baratas trocam preço de armazenamento por taxas de recuperação, duração mínima e tamanho mínimo cobrado. Essas cobranças escondidas decidem a maioria das respostas.',
        points: [
          '**Duração mínima**: 30 dias para Standard-IA e One Zone-IA, 90 dias para Glacier Instant Retrieval e Glacier Flexible Retrieval, 180 dias para Glacier Deep Archive. Apagar antes é cobrado como se tivesse ficado.',
          '**Tamanho mínimo cobrado**: 128 KB para Standard-IA, One Zone-IA e Glacier Instant Retrieval. Glacier Flexible Retrieval e Deep Archive somam 40 KB de metadados por objeto.',
          '**Taxa de recuperação**: por GB nas classes IA e Glacier. Standard e Intelligent-Tiering não têm.',
          '**One Zone-IA**: uma AZ e mais barata que a Standard-IA, para dados que dá para recriar, como réplicas ou arquivos derivados.',
          '**Express One Zone**: acesso em milissegundos de um dígito em uma AZ, com custo de requisição 50% menor que o Standard. É classe de desempenho, não de arquivo.',
        ],
        tip: '"Milhões de objetos de 20 KB, raramente lidos" -> mantenha no **Standard** ou agrupe, o mínimo de 128 KB deixa a IA mais cara. "Miniaturas que podem ser recriadas, raramente lidas" -> **One Zone-IA**.',
        table: {
          title: 'Classes do S3 e suas cobranças escondidas',
          head: ['Classe', 'Mínimos e taxas'],
          rows: [
            { key: 'Standard', cells: ['Sem duração ou tamanho mínimo, sem taxa de recuperação. 3 ou mais AZs.'] },
            {
              key: 'Intelligent-Tiering',
              cells: ['Sem duração mínima, sem taxa de recuperação, com taxa de monitoramento por objeto.'],
            },
            { key: 'Standard-IA', cells: ['30 dias, 128 KB, recuperação por GB. 3 ou mais AZs.'] },
            { key: 'One Zone-IA', cells: ['30 dias, 128 KB, recuperação por GB. 1 AZ.'] },
            {
              key: 'Glacier Instant Retrieval',
              cells: [
                '90 dias, 128 KB, recuperação por GB. Milissegundos, para dados lidos cerca de uma vez por trimestre.',
              ],
            },
            {
              key: 'Glacier Flexible Retrieval',
              cells: ['90 dias, 40 KB extras por objeto, restauração de minutos a horas.'],
            },
            {
              key: 'Glacier Deep Archive',
              cells: ['180 dias, 40 KB extras por objeto, restauração de 12 a 48 horas.'],
            },
          ],
        },
      },
      {
        id: 's3-lifecycle',
        name: 'S3 Lifecycle',
        fullName: 'Amazon S3 Lifecycle',
        link: pt.docs('AmazonS3/latest/userguide/object-lifecycle-mgmt.html'),
        summary:
          'Regras de ciclo de vida descem os objetos pela cascata de classes ou os apagam por agenda, sem código. A agenda precisa respeitar o mínimo de cada classe.',
        points: [
          '**Ações de transição**: movem objetos por idade, prefixo, tag ou tamanho, do Standard para IA, Intelligent-Tiering, Glacier e Deep Archive. O Deep Archive é caminho sem volta.',
          '**Ações de expiração**: apagam versões atuais, removem de vez versões não atuais com `NoncurrentVersionExpiration` e limpam delete markers expirados.',
          '**Objetos pequenos**: por padrão objetos abaixo de 128 KB não são transicionados, porque a requisição de transição por objeto pode custar mais do que economiza. Um filtro de tamanho muda isso.',
          '**Duração mínima**: sair de uma classe antes cobra o restante do mínimo. Uma regra não pode ir para Glacier Instant Retrieval no dia 4 e para Deep Archive no dia 20, o segundo passo precisa esperar até o dia 94.',
          '**Data da cobrança**: transições para Glacier Flexible Retrieval e Deep Archive cobram a nova tarifa a partir do dia em que a regra é atendida. No Intelligent-Tiering, só depois da movimentação física.',
        ],
        tip: '"Logs lidos por 30 dias e guardados 7 anos para auditoria, menor custo" -> transições do **Lifecycle** até o **Deep Archive** e expiração em 7 anos. Uma Lambda agendada copiando objetos é o distrator.',
      },
      {
        id: 'intelligent-tiering',
        name: 'Intelligent-Tiering',
        fullName: 'Amazon S3 Intelligent-Tiering',
        link: pt.aws('s3/storage-classes/intelligent-tiering/'),
        summary:
          'A classe para padrões de acesso desconhecidos ou que mudam. Move cada objeto entre camadas pelo próprio histórico de acesso, sem taxa de recuperação.',
        points: [
          '**Camadas automáticas**: Frequent Access, Infrequent Access após 30 dias sem acesso e Archive Instant Access após 90 dias. Qualquer acesso devolve o objeto ao Frequent Access.',
          '**Camadas de arquivo opcionais**: Archive Access a partir de 90 dias e Deep Archive Access a partir de 180 dias, configuráveis até 730 dias. Objetos nelas precisam ser restaurados antes da leitura.',
          '**Custos**: pequena taxa mensal de monitoramento e automação por objeto, sem taxa de recuperação e sem duração mínima.',
          '**Objetos pequenos**: abaixo de 128 KB não são monitorados e ficam sempre no Frequent Access.',
          '**Adoção**: defina como classe no upload ou leve objetos existentes para ela com uma regra de Lifecycle.',
        ],
        tip: '"Padrão de acesso desconhecido ou imprevisível, sem esforço operacional" -> **Intelligent-Tiering**. "Padrão conhecido, quente por 30 dias e depois frio" -> uma regra de **Lifecycle**, que evita a taxa de monitoramento por objeto.',
      },
      {
        id: 's3-visibility',
        name: 'Visibilidade no S3',
        fullName: 'S3 Storage Lens, Storage Class Analysis and Requester Pays',
        link: pt.docs('AmazonS3/latest/userguide/storage_lens.html'),
        summary:
          'Storage Lens e Storage Class Analysis mostram onde estão os bytes e o desperdício. Requester Pays passa o custo de download para quem lê os dados.',
        points: [
          '**S3 Storage Lens**: visão da organização inteira até conta, Region, classe, bucket e prefixo. Aponta buckets sem regra de lifecycle para multipart uploads incompletos com mais de 7 dias. Métricas gratuitas e uma camada avançada paga.',
          '**Storage Class Analysis**: observa um bucket, prefixo ou tag por 30 dias ou mais e indica quando mover objetos do Standard para o Standard-IA. Não recomenda nenhuma outra classe.',
          '**Requester Pays**: quem faz a requisição paga requisições e download, o dono do bucket continua pagando o armazenamento. As requisições precisam ser autenticadas e enviar `x-amz-request-payer`, acesso anônimo não é permitido.',
        ],
        tip: '"Compartilhar um dataset grande, quem consome paga o download" -> **Requester Pays**. "Descobrir com que idade os objetos esfriam para ajustar o lifecycle" -> **Storage Class Analysis**. "Visão de armazenamento e desperdício da organização toda" -> **Storage Lens**.',
      },
      {
        id: 'ebs',
        name: 'Volumes e snapshots EBS',
        fullName: 'Amazon EBS',
        link: pt.docs('ebs/latest/userguide/general-purpose.html'),
        summary:
          'Armazenamento em bloco é cobrado pelo que você provisiona, não pelo que usa. Escolha o tipo mais barato que atende IOPS e throughput e arquive snapshots antigos.',
        points: [
          '**gp2 para gp3**: o gp3 custa 20% menos por GiB, inclui 3.000 IOPS e 125 MiB/s em qualquer tamanho e escala IOPS e throughput separados do tamanho. A troca é feita no lugar com Elastic Volumes, sem parada.',
          '**Armadilha do gp2**: o IOPS cresce 3 por GiB, então equipes compram capacidade só para ganhar IOPS. O gp3 acaba com isso.',
          '**Tipos HDD**: `st1` para throughput sequencial grande e frequente (EMR, ETL, logs), `sc1` o de menor custo para dados frios sequenciais. Nenhum dos dois pode ser volume de boot.',
          '**Snapshots Archive**: até 75% menos no custo de armazenamento de snapshots mantidos por 90 dias ou mais. Guardados como snapshots completos, mínimo de 90 dias, restauração em até 72 horas.',
          '**Faxina**: volumes desanexados e snapshots velhos continuam cobrando. Compute Optimizer e Trusted Advisor apontam volumes subutilizados.',
        ],
        tip: '"Reduzir custo de EBS, mesmo desempenho, sem parada" -> **modificar gp2 para gp3**. "Guardar snapshots anuais por compliance, raramente restaurados" -> **EBS Snapshots Archive**.',
      },
      {
        id: 'file-storage',
        name: 'EFS e FSx',
        fullName: 'Amazon EFS and Amazon FSx',
        link: pt.aws('efs/storage-classes/'),
        summary:
          'Armazenamento de arquivos fica bem mais barato quando arquivos frios saem da camada principal. O EFS faz isso com políticas de lifecycle, o FSx com tipo de armazenamento e redução de dados.',
        points: [
          '**Classes do EFS**: Standard (abaixo de 1 milissegundo), Infrequent Access (até 95% mais barata) e Archive (até 50% mais barata que a IA, mínimo de 90 dias). IA e Archive cobram no mínimo 128 KiB por arquivo.',
          '**Lifecycle management do EFS**: por padrão move arquivos sem acesso há 30 dias para IA e há 90 dias para Archive. Pode devolver o arquivo ao Standard no primeiro acesso.',
          '**EFS One Zone**: dados em uma única AZ, para o que não precisa de resiliência multi-AZ. Acessar de outra AZ paga US$ 0,01 por GB de transferência entre AZs. O Archive exige file system Regional com Elastic Throughput.',
          '**FSx for Windows File Server**: HDD para diretórios pessoais e compartilhamentos, SSD para cargas sensíveis a latência. O Data Deduplication costuma economizar de 50 a 60% em compartilhamentos gerais.',
          '**FSx for Lustre**: file systems scratch para processamento curto e temporário, sem replicação, e persistentes para dados de longo prazo. A classe Intelligent-Tiering leva dados frios para camadas mais baratas.',
        ],
        tip: '"Arquivos Linux compartilhados, a maioria intocada depois de um mês" -> **lifecycle management do EFS** para IA ou Archive. "Espaço de trabalho temporário de HPC pelo menor custo" -> **FSx for Lustre scratch**, não persistente.',
      },
      {
        id: 'archive',
        name: 'Recuperação de arquivo',
        fullName: 'S3 Glacier storage classes',
        link: pt.docs('AmazonS3/latest/userguide/restoring-objects-retrieval-options.html'),
        summary:
          'Quanto mais barato o arquivo, mais lento e caro é o caminho de volta. Escolha a classe pelo prazo que a restauração precisa cumprir, não só pelo preço por GB.',
        points: [
          '**Glacier Instant Retrieval**: leitura em milissegundos, sem etapa de restauração, para arquivos lidos cerca de uma vez por trimestre.',
          '**Bulk é grátis**: recuperações Bulk não custam nada no Glacier Flexible Retrieval e no Intelligent-Tiering. Expedited é a opção premium.',
          '**Provisioned capacity**: garante recuperações Expedited no Glacier Flexible Retrieval em períodos de alta demanda.',
          '**Cópia restaurada**: a cópia temporária é cobrada na tarifa do Standard enquanto o objeto arquivado continua cobrando a sua.',
          '**Restaurações grandes**: até 1 a 2 PB por dia por conta, e S3 Batch Operations para restaurar muitos objetos com uma única requisição.',
        ],
        tip: '"Arquivo que às vezes precisa voltar em minutos" -> **Glacier Flexible Retrieval** com Expedited. "Guardado por 10 anos, 48 horas é aceitável, menor custo" -> **Glacier Deep Archive**. "Raramente lido, mas precisa abrir em milissegundos" -> **Glacier Instant Retrieval**.',
        table: {
          title: 'Tempos de restauração',
          head: ['Classe ou camada', 'Opções de recuperação'],
          rows: [
            { key: 'Glacier Instant Retrieval', cells: ['Milissegundos, sem restauração.'] },
            {
              key: 'Glacier Flexible Retrieval',
              cells: ['Expedited de 1 a 5 minutos. Standard de 3 a 5 horas. Bulk de 5 a 12 horas.'],
            },
            { key: 'Glacier Deep Archive', cells: ['Sem Expedited. Standard em até 12 horas. Bulk em até 48 horas.'] },
            { key: 'Intelligent-Tiering Archive Access', cells: ['Igual ao Glacier Flexible Retrieval.'] },
            { key: 'Intelligent-Tiering Deep Archive Access', cells: ['Igual ao Glacier Deep Archive.'] },
          ],
        },
      },
      {
        id: 'data-transfer-in',
        name: 'Trazendo dados',
        fullName: 'AWS DataSync and AWS Transfer Family',
        link: pt.aws('datasync/'),
        summary:
          'Transferência da internet para a AWS é gratuita, então o custo está na ferramenta, no link e no tempo. Escolha pelo volume, pela banda e pelo prazo.',
        points: [
          '**AWS DataSync**: transferência online gerenciada de NFS, SMB, HDFS, object storage e outras nuvens para S3, EFS e FSx, ou direto para classes Glacier. Incremental, comprimida, validada e criptografada, e uma tarefa consegue ocupar 10 Gbps.',
          '**Links lentos**: numa migração grande, rode o DataSync sobre uma conexão hosted do Direct Connect contratada só para o projeto.',
          '**Snowball Edge**: não está mais disponível para novos clientes. A AWS indica o DataSync, o [AWS Data Transfer Terminal](https://aws.amazon.com/pt/data-transfer-terminal/) para uploads físicos e o Outposts para computação na borda.',
          '**AWS Transfer Family**: SFTP, FTPS, FTP, AS2 e transferência pelo navegador gerenciados, gravando em S3 ou EFS, para parceiros manterem seus clientes sem você operar servidores.',
          '**Uploads em lote**: menos objetos e maiores reduzem cobranças por requisição e custos de transição de lifecycle.',
        ],
        tip: '"Parceiros enviam por SFTP, aposentar o servidor próprio" -> **Transfer Family**. "Migrar centenas de TB de NFS com sincronização contínua e verificação de integridade" -> **DataSync**. Questões antigas ainda podem trazer o Snowball Edge como opção offline para datasets enormes com pouca banda.',
      },
    ],
  },
  {
    slug: 'cost-network',
    group: 'cost',
    icon: 'network',
    title: 'Custos de rede',
    summary:
      'Preço de transferência de dados, NAT gateways, VPC endpoints, CloudFront e links híbridos, escolhidos para manter o tráfego no caminho mais barato.',
    lede: 'Transferência de dados é a parte da conta que a arquitetura decide: onde o tráfego cruza AZs, Regions, NAT e a internet. Este é o **Domínio 4: Design Cost-Optimized Architectures**, 20% do conteúdo pontuado.',
    sections: [
      {
        id: 'data-transfer',
        name: 'Preço de transferência',
        link: pt.docs('cur/latest/userguide/cur-data-transfers-charges.html'),
        summary:
          'Na AWS você paga principalmente pelos dados que saem e que cruzam fronteiras. Cada salto de AZ, Region ou internet no caminho pode somar uma cobrança.',
        points: [
          '**Entrada**: dados da internet para a AWS são gratuitos.',
          '**Saída para a internet**: cobrada por GB, com os primeiros 100 GB por mês gratuitos, somados entre serviços e Regions.',
          '**Entre AZs**: cobrada nos dois sentidos, por exemplo US$ 0,01 por GB na entrada e na saída via VPC peering. Camadas que conversam muito espalhadas em AZs pagam a cada chamada.',
          '**Entre Regions**: cobrada na Region de origem, o lado que recebe não paga. Replicação entre Regions sempre carrega esse custo.',
          '**S3 na mesma Region**: transferência do S3 para outros serviços da AWS na mesma Region, e do S3 para o CloudFront, é gratuita.',
          '**IPv4 público**: todo endereço IPv4 público, em uso ou ocioso, custa US$ 0,005 por hora.',
        ],
        tip: '"Reduzir custo de transferência entre a aplicação e o banco" -> mantenha componentes muito conversadores na **mesma AZ** quando a disponibilidade permitir, ou use cache. Replicação entre Regions só compensa quando DR ou latência exigem.',
        table: {
          title: 'Quanto custa mover um GB',
          head: ['Caminho', 'Cobrança'],
          rows: [
            { key: 'Internet para AWS', cells: ['Gratuita.'] },
            {
              key: 'AWS para internet',
              cells: ['Por GB, primeiros 100 GB por mês gratuitos somando todos os serviços.'],
            },
            { key: 'Mesma AZ via VPC peering', cells: ['Gratuita desde maio de 2021.'] },
            { key: 'Entre AZs', cells: ['Por GB em cada sentido.'] },
            { key: 'Entre Regions', cells: ['Por GB na Region de origem, entrada gratuita.'] },
            { key: 'S3 para CloudFront', cells: ['Gratuita.'] },
            { key: 'Passando por NAT gateway', cells: ['Taxa de processamento por GB além da transferência.'] },
          ],
        },
      },
      {
        id: 'nat',
        name: 'NAT gateways',
        fullName: 'NAT gateways and NAT instances',
        link: pt.docs('vpc/latest/userguide/vpc-nat-gateway.html'),
        summary:
          'O NAT gateway cobra por hora e por GB processado, então muito tráfego de saída, ou tráfego para serviços da AWS passando pelo NAT, fica caro.',
        points: [
          '**Cobrança**: taxa por hora mais taxa de processamento por GB, qualquer que seja o destino, por exemplo US$ 0,045 por hora e US$ 0,045 por GB em US East (Ohio), além da transferência normal.',
          '**Um por AZ vs compartilhado**: um NAT gateway zonal em cada AZ sobrevive à queda de uma AZ e evita cobrança entre AZs. Um único compartilhado economiza horas, mas é ponto único de falha e soma transferência entre AZs.',
          '**Regional NAT gateway**: um único ID de gateway que se expande para toda AZ com carga, cobrado por hora por AZ, sem precisar de subnet pública. Não suporta NAT privado.',
          '**NAT instance**: você paga só a instância, sem taxa de processamento, mas cuida de failover, patches e dimensionamento, e a banda depende do tipo da instância. A AWS recomenda NAT gateways.',
          '**Evite NAT para serviços da AWS**: gateway endpoints para S3 e DynamoDB, interface endpoints para os demais.',
        ],
        tip: '"Produção, precisa sobreviver à queda de uma AZ" -> **um NAT gateway por AZ** ou um regional NAT gateway. "VPC de dev, menor custo" -> **um NAT gateway compartilhado**. "Conta alta de NAT por causa de tráfego para o S3" -> **gateway endpoint do S3**.',
      },
      {
        id: 'vpc-endpoints',
        name: 'VPC endpoints',
        fullName: 'Gateway and interface VPC endpoints',
        link: pt.aws('privatelink/pricing/'),
        summary:
          'Endpoints tiram o tráfego para serviços da AWS do NAT gateway e da internet. Gateway endpoints são gratuitos, interface endpoints não.',
        points: [
          '**Gateway endpoints**: só S3 e DynamoDB, um destino na tabela de rotas, sem cobrança por hora nem por processamento.',
          '**Interface endpoints**: uma ENI por AZ via PrivateLink, cobrada por hora por AZ mais por GB processado, por exemplo US$ 0,01 por hora e US$ 0,01 por GB no primeiro PB.',
          '**Alcance**: um gateway endpoint atende só a própria VPC e a própria Region. Recursos de uma VPC com peering não podem usá-lo.',
          '**Ponto de equilíbrio**: o interface endpoint compensa quando o processamento de NAT que ele substitui custa mais que suas horas e sua taxa por GB.',
        ],
        tip: '"Instâncias privadas enviam TBs ao S3 pelo NAT, reduzir custo" -> **gateway endpoint do S3**. Um interface endpoint para o S3 é o distrator aqui, ele cobra por hora e por GB.',
      },
      {
        id: 'cloudfront',
        name: 'CloudFront',
        fullName: 'Amazon CloudFront',
        link: pt.aws('cloudfront/pricing/'),
        summary:
          'Cache na borda reduz a carga e a saída da origem. Menos requisições chegam ao EC2 ou ao S3, então a origem pode ser menor e transferir menos.',
        points: [
          '**S3 para CloudFront**: gratuito, então você paga a entrega do CloudFront no lugar da saída do S3 para a internet.',
          '**Taxa de acerto do cache**: TTLs maiores e menos variações na chave de cache significam menos buscas na origem e origens menores.',
          '**Price class**: define o preço máximo que você aceita pagar, servindo de menos Regions da borda, à custa de latência para usuários distantes.',
          '**Planos de preço fixo**: planos mensais sem cobrança excedente, a partir de um plano Free com 100 GB. Ataques DDoS e requisições bloqueadas pelo WAF não contam na franquia.',
          '**vs Global Accelerator**: o CloudFront faz cache de conteúdo HTTP, o Global Accelerator não faz cache.',
        ],
        tip: '"Usuários no mundo todo baixam os mesmos arquivos estáticos, reduzir custo e latência" -> **CloudFront** na frente do S3. Instâncias maiores ou replicar buckets em mais Regions são os distratores.',
      },
      {
        id: 'hybrid-connectivity',
        name: 'Direct Connect vs VPN',
        fullName: 'AWS Direct Connect and AWS Site-to-Site VPN',
        link: pt.aws('directconnect/pricing/pay-as-you-go/'),
        summary:
          'O link mais barato depende de volume e banda. A VPN usa a internet e sobe rápido. O Direct Connect cobra horas de porta, mas reduz a saída por GB e dá banda consistente.',
        points: [
          '**Site-to-Site VPN**: cobrada por hora de conexão mais a transferência de saída normal. Até 1,25 Gbps por túnel padrão e até 5 Gbps por túnel de banda larga.',
          '**Escalando a VPN**: ECMP em vários túneis num transit gateway, com roteamento dinâmico, soma a banda.',
          '**Direct Connect**: horas de porta são cobradas mesmo sem tráfego, a entrada é gratuita e a saída tem tarifa própria e menor, por exemplo US$ 0,02 por GB de US East (Ohio) para Columbus.',
          '**Velocidades de porta**: dedicadas de 1, 10, 100 e 400 Gbps, hosted de 50 Mbps a 25 Gbps via parceiros. Escolha a menor porta que atende o pico.',
        ],
        tip: '"Move dezenas de TB por mês para o on-premises, precisa de throughput consistente" -> **Direct Connect**. "Conectar uma filial em poucos dias, pouco volume" -> **Site-to-Site VPN**. "Precisa de mais de 1,25 Gbps na VPN" -> **vários túneis com ECMP** num transit gateway.',
        table: {
          title: 'Escolhendo o link',
          head: ['Link', 'Uso mais barato'],
          rows: [
            {
              key: 'Internet',
              cells: ['Pouco volume, sem exigência de conectividade privada. Só transferência de saída.'],
            },
            {
              key: 'Site-to-Site VPN',
              cells: ['Acesso privado criptografado montado rápido, volume moderado, até 1,25 Gbps por túnel.'],
            },
            { key: 'Direct Connect hosted', cells: ['De 50 Mbps a 25 Gbps via parceiro, tráfego estável.'] },
            {
              key: 'Direct Connect dedicated',
              cells: ['De 1 a 400 Gbps, volumes grandes e estáveis em que as horas de porta compensam.'],
            },
          ],
        },
      },
      {
        id: 'vpc-connectivity',
        name: 'Transit Gateway vs peering',
        fullName: 'AWS Transit Gateway and VPC peering',
        link: pt.aws('transit-gateway/pricing/'),
        summary:
          'Peering é o caminho mais barato para poucas VPCs. O Transit Gateway soma uma taxa por anexo e por GB em troca de roteamento hub-and-spoke em escala.',
        points: [
          '**VPC peering**: criar não custa nada, a transferência na mesma AZ é gratuita e entre AZs ou Regions é cobrada. Não é transitivo e não aceita CIDRs sobrepostos.',
          '**Transit Gateway**: cobrado por hora de anexo e por GB enviado a ele, por exemplo US$ 0,05 por hora de anexo de VPC e US$ 0,02 por GB em US East (Ohio). Dados vindos de um anexo de peering não pagam processamento.',
          '**Escala**: a AWS recomenda Transit Gateway ou PrivateLink para conectar centenas ou milhares de VPCs.',
          '**Link híbrido compartilhado**: um único anexo de VPN ou Direct Connect no transit gateway atende todas as VPCs anexadas.',
        ],
        tip: '"3 VPCs trocando muito tráfego, menor custo" -> **VPC peering**. "200 VPCs mais o on-premises, roteamento central" -> **Transit Gateway**.',
      },
      {
        id: 'global-accelerator',
        name: 'Global Accelerator',
        fullName: 'AWS Global Accelerator',
        link: pt.aws('global-accelerator/pricing/'),
        summary:
          'Leva o tráfego dos usuários para a rede global da AWS por 2 endereços IPv4 anycast estáticos. Compra desempenho e disponibilidade, não reduz custo de transferência.',
        points: [
          '**Taxa fixa**: US$ 0,025 por hora por accelerator, cobrada mesmo com ele desabilitado.',
          '**DT-Premium**: por GB no sentido dominante do tráfego, além da transferência de saída padrão.',
          '**Encaixe**: IPs estáticos, failover rápido entre Regions, endpoints como NLB, ALB, EC2 ou Elastic IPs. Sem cache.',
          '**Alavanca de custo**: pague por ele só quando o requisito for desempenho ou IPs estáticos. Para conteúdo HTTP cacheável, o CloudFront é que reduz o custo da origem.',
        ],
        tip: '"Jogo em UDP, IPs estáticos, failover rápido entre Regions" -> **Global Accelerator**. "Reduzir o custo de servir conteúdo estático" -> **CloudFront**, não Global Accelerator.',
      },
      {
        id: 'api-gateway',
        name: 'Alavancas do API Gateway',
        fullName: 'Amazon API Gateway',
        link: pt.docs('apigateway/latest/developerguide/api-gateway-caching.html'),
        summary: 'Throttling e cache evitam que o backend pague por tráfego que ele não precisa atender.',
        points: [
          '**Throttling**: limites por Region e conta, por stage e método e por cliente via usage plans. O excesso recebe `429 Too Many Requests`.',
          '**Usage plans**: API keys com taxa, burst e cotas por cliente. Throttles e cotas são metas de melhor esforço, não tetos rígidos.',
          '**Cache**: cache de stage em REST APIs com TTL de 300 segundos por padrão e até 3600, e só `GET` em cache por padrão. Menos chamadas chegam à Lambda ou ao banco.',
          '**Custo do cache**: cobrado por hora conforme o tamanho e fora do Free Tier, então só compensa com boa taxa de acerto.',
        ],
        tip: '"As mesmas leituras batem na Lambda e no DynamoDB toda hora" -> **cache do API Gateway**. "Limitar um parceiro a 1.000 requisições por dia" -> **cota de usage plan** com API key.',
      },
    ],
  },
  {
    slug: 'cost-management',
    group: 'cost',
    icon: 'chart',
    title: 'Gestão de custos',
    summary:
      'Cost Explorer, Budgets, Data Exports, tags, faturamento consolidado e as ferramentas que acham economia, mais as escolhas de preço de banco.',
    lede: 'Enxergar, alocar, alertar e prever o gasto, e escolher o modelo de preço de banco de dados que combina com a carga. Este é o **Domínio 4: Design Cost-Optimized Architectures**, 20% do conteúdo pontuado.',
    sections: [
      {
        id: 'cost-explorer',
        name: 'Cost Explorer',
        fullName: 'AWS Cost Explorer',
        link: pt.aws('aws-cost-management/aws-cost-explorer/'),
        summary:
          'A visão interativa de custo e uso: filtrar, agrupar, comparar períodos e prever. A resposta típica para "analisar para onde vai o dinheiro".',
        points: [
          '**Histórico e previsão**: até 13 meses de histórico e previsão para os próximos 18 meses. Os dados são atualizados pelo menos uma vez a cada 24 horas.',
          '**Análise**: filtra e agrupa por serviço, conta, Region, tipo de uso ou tag, e exporta em CSV.',
          '**Recomendações**: recomendações de compra de Reserved Instances. As de Savings Plans, baseadas no uso passado, ficam no mesmo console de Billing and Cost Management e na API do Cost Explorer.',
          '**Custo**: gratuito no console. A API custa US$ 0,01 por requisição paginada.',
        ],
        tip: '"Visualizar qual serviço causou o aumento do mês passado" -> **Cost Explorer**. "Ser avisado antes de estourar o gasto" é AWS Budgets, não Cost Explorer.',
      },
      {
        id: 'budgets',
        name: 'Budgets',
        fullName: 'AWS Budgets',
        link: pt.aws('aws-cost-management/aws-budgets/'),
        summary:
          'Limites sobre custo, uso ou métricas de compromisso, com alertas sobre valores reais ou previstos e ações automáticas opcionais.',
        points: [
          '**Tipos**: custo, uso, utilização de RI, cobertura de RI, utilização de Savings Plans e cobertura de Savings Plans.',
          '**Alertas**: sobre valores reais ou previstos, por email ou tópico SNS, e também em aplicativos de chat.',
          '**Budget actions**: aplicam uma política IAM ou uma SCP, ou param instâncias EC2 ou RDS específicas, automaticamente ou após aprovação.',
          '**Não é teto rígido**: os dados são atualizados até 3 vezes por dia, então o gasto pode passar do limite antes de o alerta chegar.',
          '**Organizations**: a partir da conta de gerenciamento, uma ação pode aplicar SCP em outra conta, mas não pode parar instâncias nela.',
        ],
        tip: '"Bloquear novos recursos automaticamente quando a previsão passar de 90%" -> **budget action** com política IAM de deny ou SCP. "Avisar quando a utilização de Savings Plans cair abaixo de 80%" -> **budget de utilização de Savings Plans**.',
      },
      {
        id: 'anomaly-detection',
        name: 'Anomaly Detection',
        fullName: 'AWS Cost Anomaly Detection',
        link: pt.aws('aws-cost-management/aws-cost-anomaly-detection/'),
        summary:
          'Machine learning que aprende o gasto normal e alerta sobre picos fora do padrão, com análise de causa raiz, sem limites fixos.',
        points: [
          '**Monitores**: todos os serviços da AWS avaliados separadamente, ou contas membro, cost allocation tags ou cost categories específicas.',
          '**Alertas**: individuais ou em relatórios agregados, por email ou tópico SNS, que pode ser encaminhado ao Slack ou ao Chime.',
          '**Causa raiz**: ordenada por impacto em dólares, por serviço, conta, Region e tipo de uso.',
          '**Tempo**: roda cerca de 3 vezes por dia sobre o custo líquido não combinado e pode levar até 24 horas para apontar uma anomalia. Um serviço novo precisa de 10 dias de histórico.',
          '**Lacuna**: a maior parte das cobranças do AWS Marketplace não é monitorada, use Budgets para elas.',
        ],
        tip: '"Detectar picos inesperados de gasto sem definir limites" -> **Cost Anomaly Detection**. Um limite fixo de budget é o distrator.',
      },
      {
        id: 'data-exports',
        name: 'Data Exports e CUR',
        fullName: 'AWS Data Exports',
        link: pt.docs('cur/latest/userguide/what-is-data-exports.html'),
        summary:
          'Os dados de custo mais detalhados, entregues como arquivos no S3 para Athena, Redshift ou Amazon Quick. O CUR 2.0 no Data Exports é a forma atual do Cost and Usage Report.',
        points: [
          '**CUR 2.0**: o export recomendado, com schema fixo, colunas aninhadas para tags, cost categories, produto e desconto, e nomes das contas.',
          '**Personalização em SQL**: escolha colunas, filtre linhas e renomeie, para o export levar só o que você precisa.',
          '**Outras tabelas**: recomendações do Cost Optimization Hub, FOCUS 1.0 e 1.2 com colunas da AWS e emissões de carbono.',
          '**CUR legado**: ainda oferecido como export legado, com schema que muda conforme o uso.',
          '**Entrega**: ZIP, GZIP ou Parquet num bucket S3. Um dashboard pronto de custo e uso pode ser implantado no Amazon Quick.',
        ],
        tip: '"Dados de custo linha a linha, os mais detalhados, consultados com SQL no Athena" -> **CUR 2.0 via Data Exports**. O Cost Explorer é o distrator, ele serve para análise interativa, não para arquivos brutos.',
      },
      {
        id: 'cost-allocation-tags',
        name: 'Cost allocation tags',
        link: pt.docs('awsaccountbilling/latest/aboutv2/cost-alloc-tags.html'),
        summary:
          'Tags só viram dimensão de custo depois de ativadas no console de Billing. São a base de showback e chargeback por time, projeto ou ambiente.',
        points: [
          '**Definidas pelo usuário**: você cria e aplica. Aparecem com o prefixo `user:`.',
          '**Geradas pela AWS**: a AWS ou vendedores do Marketplace aplicam, com o prefixo `aws:`, por exemplo `aws:createdBy`.',
          '**Ativação**: cada tipo é ativado separadamente, só pela conta de gerenciamento ou por uma conta avulsa, e pode levar até 24 horas para aparecer.',
          '**Backfill**: a conta de gerenciamento pode aplicar a ativação retroativamente por até 12 meses, uma vez a cada 24 horas.',
          '**Uso**: filtros no Cost Explorer e no Budgets, colunas no CUR, monitores no Cost Anomaly Detection.',
        ],
        tip: '"Os recursos têm tags, mas o custo por projeto não aparece no Cost Explorer" -> **ativar as cost allocation tags** no console de Billing. Marcar os recursos de novo é o distrator.',
      },
      {
        id: 'consolidated-billing',
        name: 'Faturamento consolidado',
        fullName: 'Consolidated billing in AWS Organizations',
        link: pt.docs('awsaccountbilling/latest/aboutv2/consolidated-billing.html'),
        summary:
          'Uma fatura para todas as contas da organização, paga pela conta de gerenciamento, com o uso somado para descontos.',
        points: [
          '**Uma fatura**: a conta de gerenciamento paga por todas as contas membro, sem custo extra.',
          '**Descontos por volume**: o uso é somado entre as contas, então os preços por faixa caem antes do que em contas avulsas.',
          '**Compartilhamento de RI e Savings Plans**: ligado por padrão, aplicado primeiro na conta dona e depois nas demais. Pode ser desligado por conta ou limitado a grupos definidos com Cost Categories.',
          '**Saída**: uma conta que deixa a organização perde acesso aos dados do Cost Explorer do período em que fazia parte dela.',
        ],
        tip: '"Várias contas, querem uma fatura única e desconto por volume" -> **faturamento consolidado do AWS Organizations**. "Impedir que o desconto de RI de uma unidade vá para outras contas" -> **restringir ou desligar o compartilhamento de RI e Savings Plans**.',
      },
      {
        id: 'optimization-tools',
        name: 'Recomendações e estimativas',
        fullName: 'Trusted Advisor, Cost Optimization Hub and AWS Pricing Calculator',
        link: pt.aws('premiumsupport/technology/trusted-advisor/'),
        summary: 'Ferramentas que acham desperdício no que roda hoje e estimam o que você pretende rodar depois.',
        points: [
          '**Checks de custo do Trusted Advisor**: instâncias EC2 pouco usadas, load balancers ociosos, volumes EBS subutilizados, Elastic IPs sem associação, instâncias RDS ociosas e recomendações de compromisso.',
          '**Plano de suporte**: todos os checks exigem Business Support+, Enterprise Support ou Unified Operations. O Basic só recebe limites de serviço e alguns checks de segurança e tolerância a falhas.',
          '**Cost Optimization Hub**: recomendações de rightsizing, ociosidade, Savings Plans e RIs de todas as contas e Regions num só lugar, com economia sem duplicidade e já considerando seus descontos.',
          '**AWS Pricing Calculator**: estimativas gratuitas antes de construir, compartilhadas por link ou exportadas em CSV ou PDF. Impostos não entram.',
        ],
        tip: '"Estimar o custo mensal de uma migração planejada" -> **AWS Pricing Calculator**, não Cost Explorer, que só cobre o que já roda.',
        table: {
          title: 'Qual ferramenta responde a qual pergunta',
          head: ['Pergunta', 'Ferramenta'],
          rows: [
            { key: 'Quanto vai custar este novo design?', cells: ['AWS Pricing Calculator.'] },
            { key: 'Para onde foi o dinheiro?', cells: ['Cost Explorer.'] },
            { key: 'Avisar ou agir num limite', cells: ['AWS Budgets.'] },
            { key: 'Alertar sobre um pico anormal', cells: ['Cost Anomaly Detection.'] },
            { key: 'Linhas brutas para SQL', cells: ['Data Exports com CUR 2.0.'] },
            {
              key: 'Recursos grandes demais ou ociosos',
              cells: ['Compute Optimizer, Cost Optimization Hub, Trusted Advisor.'],
            },
            { key: 'Custo por time ou projeto', cells: ['Cost allocation tags.'] },
          ],
        },
      },
      {
        id: 'database-costs',
        name: 'Preço dos bancos',
        fullName: 'Amazon DynamoDB, Aurora and RDS pricing models',
        link: pt.aws('dynamodb/pricing/'),
        summary:
          'A conta do banco segue o modelo de capacidade: por requisição, por unidade provisionada, por ACU ou por hora de instância. Escolha conforme a estabilidade da carga.',
        points: [
          '**DynamoDB on-demand**: paga por requisição, sem planejar capacidade, o modo padrão e recomendado para a maioria das cargas. Um throughput máximo opcional limita o custo.',
          '**DynamoDB provisioned**: paga por hora de RCUs e WCUs, usadas ou não, com auto scaling (meta de 70% recomendada). Reserved capacity economiza até 54% em 1 ano ou 77% em 3 anos.',
          '**Trocas no DynamoDB**: de provisioned para on-demand até 4 vezes em 24 horas corridas, de volta a qualquer momento. A table class Standard-IA serve para tabelas em que o armazenamento domina.',
          '**Aurora Serverless v2**: capacidade em ACUs. Com mínimo de 0 ACUs, pausa após 5 minutos a 1 dia ocioso, sem cobrança de instância enquanto pausado. A retomada leva cerca de 15 segundos.',
          '**RDS**: Reserved Instances economizam até 69% em uso estável, com flexibilidade de tamanho na maioria dos engines. Database Savings Plans cobrem RDS, Aurora, DynamoDB e outros com até 35%.',
          '**Backups**: retenção de backups automáticos de 0 a 35 dias (0 desliga). Snapshots manuais ficam, e continuam cobrando, até você apagá-los.',
        ],
        tip: '"Aplicação nova, tráfego imprevisível, sem planejar capacidade" -> **DynamoDB on-demand**. "Tráfego estável e conhecido, menor custo" -> **provisioned com auto scaling e reserved capacity**. "Banco de dev ocioso a maior parte do dia" -> **Aurora Serverless v2 escalando a 0 ACUs**.',
        table: {
          title: 'Modelos de capacidade',
          head: ['Modelo', 'Melhor uso'],
          rows: [
            { key: 'DynamoDB on-demand', cells: ['Tráfego desconhecido, com picos ou novo. Paga por requisição.'] },
            {
              key: 'DynamoDB provisioned',
              cells: ['Tráfego estável e previsível com auto scaling, mais reserved capacity para a base.'],
            },
            {
              key: 'Aurora Serverless v2',
              cells: ['Carga relacional variável ou intermitente, e dev ou teste que podem pausar em 0 ACUs.'],
            },
            {
              key: 'RDS ou Aurora provisionado',
              cells: ['Carga relacional estável 24/7, coberta por RIs ou Savings Plans.'],
            },
          ],
        },
      },
    ],
  },
]
