import { en, pt } from '../links'
import type { Topic } from '../types'

export const enUS: readonly Topic[] = [
  {
    slug: 'storage',
    group: 'performing',
    icon: 'storage',
    title: 'Storage performance',
    summary:
      'Block, file and object storage on AWS, with the limits and settings that decide which S3, EBS, EFS or FSx option fits.',
    lede: 'Choosing storage services and configurations that meet performance demands and scale with growth. This is task 3.1 of **Design High-Performing Architectures**, the domain worth 24% of the scored content.',
    sections: [
      {
        id: 'storage-types',
        name: 'Block, file, object',
        link: en.aws('compare/the-difference-between-block-file-object-storage/'),
        summary:
          'The first decision is the storage type. It defines how data is addressed, who can share it and how far it scales.',
        points: [
          '**Block** (Amazon EBS, instance store): fixed-size blocks attached to an instance, with low latency and high IOPS. Fits boot volumes, databases and transactional workloads.',
          '**File** (Amazon EFS, Amazon FSx): a hierarchical file system shared by many clients at once over NFS or SMB.',
          '**Object** (Amazon S3): objects with metadata in a flat namespace, accessed through HTTPS APIs, with near-unlimited scale.',
          '**Hybrid** (AWS Storage Gateway): on-premises applications reach cloud storage through file, volume or tape interfaces.',
        ],
        tip: '"Shared file system for many Linux instances" -> **EFS**, not EBS. "Lowest latency disk for one database instance" -> **EBS** (or instance store if the data is temporary). "Millions of images or a data lake" -> **S3**.',
      },
      {
        id: 's3-performance',
        name: 'S3 performance',
        fullName: 'Amazon S3 performance',
        link: en.docs('AmazonS3/latest/userguide/optimizing-performance.html'),
        summary:
          'Amazon S3 scales automatically, but request rates are counted per prefix and large objects move faster when split into parallel requests.',
        points: [
          '**Prefixes**: at least 3,500 `PUT`/`COPY`/`POST`/`DELETE` and 5,500 `GET`/`HEAD` requests per second per partitioned prefix, with no limit on the number of prefixes. 10 prefixes can reach 55,000 reads per second. While S3 scales up, it can answer `503 Slow Down`.',
          '**Multipart upload**: recommended from 100 MB and required above 5 GB, the limit of a single `PUT`. Parts of 5 MiB to 5 GiB, up to 10,000 parts, uploaded in parallel and retried one by one. Objects reach 48.8 TiB.',
          '**Transfer Acceleration**: uploads enter the nearest CloudFront edge location and travel to the bucket over an optimized network path. Uses the `bucket.s3-accelerate.amazonaws.com` endpoint, needs a DNS-compliant bucket name without periods and can add transfer charges.',
          '**Byte-range fetches**: `GET` requests with the `Range` header read parts of one object over concurrent connections, which raises aggregate throughput and makes retries cheaper.',
          '**Locality and caching**: read the bucket from EC2 in the same Region, and put CloudFront or ElastiCache in front of S3 for repeated reads that need lower latency.',
        ],
        tip: '"Large uploads from offices on other continents are slow" -> **Transfer Acceleration** plus **multipart upload**. "503 errors on a hot prefix" -> spread keys across **more prefixes**. "Read only a part of a huge file" -> **byte-range fetch**.',
      },
      {
        id: 's3-storage-classes',
        name: 'S3 storage classes',
        link: en.docs('AmazonS3/latest/userguide/storage-class-intro.html'),
        summary:
          'Every recommended class is designed for 99.999999999% (11 nines) durability. They differ in availability, number of AZs, minimum storage duration and retrieval time.',
        points: [
          '**Minimum duration**: 30 days for Standard-IA and One Zone-IA, 90 days for Glacier Instant Retrieval and Glacier Flexible Retrieval, 180 days for Glacier Deep Archive. Deleting earlier still bills the remaining days.',
          '**Minimum billable size**: 128 KB for Standard-IA, One Zone-IA and Glacier Instant Retrieval. Intelligent-Tiering does not monitor objects under 128 KB.',
          '**Single AZ**: One Zone-IA and Express One Zone are not resilient to the loss of the Availability Zone. Keep only data you can re-create there.',
          '**Archive retrieval**: Glacier Flexible Retrieval restores in 1 to 5 minutes (Expedited), 3 to 5 hours (Standard) or 5 to 12 hours (Bulk, free). Deep Archive restores within 12 hours (Standard) or 48 hours (Bulk).',
          '**Lifecycle rules**: transition objects to cheaper classes as they age, expire them, and abort incomplete multipart uploads.',
        ],
        tip: '"Unknown or changing access pattern" -> **Intelligent-Tiering**. "Read once a quarter but needs milliseconds" -> **Glacier Instant Retrieval**. "Compliance archive, 48 hours to retrieve is fine, lowest cost" -> **Glacier Deep Archive**.',
        table: {
          title: 'S3 storage classes',
          head: ['Class', 'Profile'],
          rows: [
            {
              key: 'Standard',
              cells: ['Frequent access in milliseconds. 99.99% availability, 3 or more AZs, no minimum duration.'],
            },
            {
              key: 'Intelligent-Tiering',
              cells: [
                'Unknown or changing patterns. Moves objects to Infrequent Access after 30 days and Archive Instant Access after 90 days without access. Monitoring fee, no retrieval fee.',
              ],
            },
            {
              key: 'Express One Zone',
              cells: [
                'Single-digit millisecond access in one AZ you choose, in directory buckets. Up to 10x faster than Standard with request costs 50% lower.',
              ],
            },
            {
              key: 'Standard-IA',
              cells: ['Accessed about once a month, in milliseconds. 99.9% availability, per-GB retrieval fee.'],
            },
            { key: 'One Zone-IA', cells: ['Infrequent, re-creatable data in 1 AZ. 99.5% availability.'] },
            {
              key: 'Glacier Instant Retrieval',
              cells: ['Archive read about once a quarter, still in milliseconds.'],
            },
            {
              key: 'Glacier Flexible Retrieval',
              cells: ['Archive read once or twice a year, restored in minutes to 12 hours. Fits backup and DR.'],
            },
            {
              key: 'Glacier Deep Archive',
              cells: ['Lowest cost in AWS, read less than once a year, restored in 12 to 48 hours.'],
            },
          ],
        },
      },
      {
        id: 'ebs-volume-types',
        name: 'EBS volume types',
        fullName: 'Amazon EBS',
        link: en.docs('ebs/latest/userguide/ebs-volume-types.html'),
        summary:
          'SSD volumes are tuned for IOPS on small random I/O. HDD volumes are tuned for throughput on large sequential I/O.',
        points: [
          '**gp3**: 3,000 IOPS and 125 MiB/s included at any size. IOPS (up to 500 per GiB) and throughput are provisioned independently of size, up to 80,000 IOPS and 2,000 MiB/s, at a price per GiB 20% lower than gp2.',
          '**gp2**: 3 IOPS per GiB, from 100 to 16,000. Volumes under 1 TiB burst to 3,000 IOPS with I/O credits. Performance only grows with size.',
          '**io2 Block Express**: up to 256,000 IOPS, 4,000 MiB/s and 64 TiB, with 99.999% durability and average latency under 500 microseconds. For critical databases that need sustained IOPS.',
          '**HDD** (st1, sc1): 125 GiB to 16 TiB and never a boot volume. st1 for big data, data warehouses and logs, sc1 for the cheapest storage of rarely read data.',
          '**Elastic Volumes**: change the type, IOPS and throughput of a volume in use without interrupting the instance, such as gp2 to gp3.',
          '**Instance side**: use EBS-optimized instances to reach provisioned IOPS. Volumes above 64,000 IOPS need Nitro-based instances.',
        ],
        tip: '"More IOPS without paying for more GiB" -> **gp3** (gp2 ties IOPS to size). "More than 80,000 IOPS or sub-millisecond latency" -> **io2 Block Express**. "Cheapest EBS for sequential logs" -> **st1**, or **sc1** if rarely read.',
        table: {
          title: 'EBS volume types',
          head: ['Type', 'Limits and fit'],
          rows: [
            {
              key: 'gp3',
              cells: [
                '1 GiB to 64 TiB, 3,000 to 80,000 IOPS, 125 to 2,000 MiB/s. Default for boot volumes and most workloads.',
              ],
            },
            { key: 'gp2', cells: ['1 GiB to 16 TiB, up to 16,000 IOPS (3 per GiB), up to 250 MiB/s. Burst credits.'] },
            {
              key: 'io2 Block Express',
              cells: ['4 GiB to 64 TiB, up to 256,000 IOPS and 4,000 MiB/s, 99.999% durability. Multi-Attach.'],
            },
            { key: 'io1', cells: ['4 GiB to 16 TiB, up to 64,000 IOPS and 1,000 MiB/s. Multi-Attach.'] },
            { key: 'st1', cells: ['125 GiB to 16 TiB, up to 500 MiB/s. Big data, warehouses, logs. Not bootable.'] },
            { key: 'sc1', cells: ['125 GiB to 16 TiB, up to 250 MiB/s. Lowest cost cold data. Not bootable.'] },
          ],
        },
      },
      {
        id: 'multi-attach-instance-store',
        name: 'Multi-Attach and instance store',
        link: en.docs('ebs/latest/userguide/ebs-volumes-multi.html'),
        summary:
          'Two block options outside the usual one durable volume per instance: a shared Provisioned IOPS volume, and fast local disks that live and die with the instance.',
        points: [
          '**Multi-Attach**: one io1 or io2 volume attached to up to 16 Nitro-based instances in the same Availability Zone, all with read and write access. No extra charge.',
          '**Cluster-aware writes**: XFS and ext4 are not built for simultaneous writers. Use a clustered file system or an application that orders writes. Multi-Attach volumes cannot be boot volumes.',
          '**Instance store**: disks physically attached to the host, included in the instance price. Ideal for buffers, caches, scratch data and data replicated across a fleet.',
          '**Ephemeral data**: it survives a reboot but is lost on stop, hibernation, termination or disk failure. It can only be added at launch and never detached.',
        ],
        tip: '"Clustered application in one AZ needs a shared block device" -> **EBS Multi-Attach** with io2. "Highest disk I/O for temporary data, loss is acceptable" -> **instance store**. Data that must survive a stop belongs on **EBS**.',
      },
      {
        id: 'efs',
        name: 'EFS',
        fullName: 'Amazon Elastic File System',
        link: en.docs('efs/latest/ug/performance.html'),
        summary:
          'Serverless NFS file system that grows to petabytes on its own and is shared by EC2, ECS, EKS, Fargate and Lambda. Windows instances are not supported.',
        points: [
          '**Protocol**: NFSv4.0 and NFSv4.1 with POSIX permissions. For SMB shares on Windows, use FSx for Windows File Server.',
          '**File system type**: Regional stores data across 3 or more AZs (recommended). One Zone keeps it in 1 AZ, cheaper but exposed to the loss of that AZ.',
          '**Performance mode**: General Purpose (default, lowest latency, recommended). Max I/O is a previous generation with higher latency, unavailable with Elastic throughput or One Zone.',
          '**Throughput mode**: Elastic (default) scales automatically for spiky or unpredictable loads. Provisioned fixes throughput for known needs. Bursting scales with the data stored in Standard.',
          '**Storage classes**: Standard (SSD, sub-millisecond reads), Infrequent Access and Archive (tens of milliseconds, 90-day minimum for Archive). Lifecycle management moves files between them.',
          '**Replication**: keeps a copy in another Region with RPO and RTO measured in minutes.',
        ],
        tip: '"Hundreds of Linux instances across AZs share the same files" -> **EFS Regional**. "File system throttled in Bursting mode" -> switch to **Elastic** or **Provisioned** throughput. "Windows file shares" is never EFS.',
      },
      {
        id: 'fsx',
        name: 'FSx',
        fullName: 'Amazon FSx',
        link: en.aws('fsx/when-to-choose-fsx/'),
        summary:
          'Fully managed file systems built on popular commercial and open source technologies. Pick the one that matches the protocol or the file system already in use.',
        points: [
          '**FSx for Windows File Server**: native Windows file system over SMB, with Microsoft Active Directory authentication and Windows ACLs. Single-AZ or Multi-AZ with a standby file server, SSD or HDD storage.',
          '**FSx for Lustre**: POSIX parallel file system for HPC, machine learning, video processing and financial modeling. Links to an S3 bucket, presents its objects as files and writes results back. Scratch (not replicated) or persistent deployments, Linux clients.',
          '**FSx for NetApp ONTAP**: multiprotocol NFS, SMB, iSCSI and NVMe access from Linux, Windows and macOS. Snapshots, clones, SnapMirror replication, compression, deduplication and automatic tiering of cold data.',
          '**FSx for OpenZFS**: NFS access for moving ZFS or Linux file servers, with latencies of hundreds of microseconds, snapshots, clones and compression. Multi-AZ or Single-AZ deployments.',
        ],
        tip: '"Windows shares joined to Active Directory" -> **FSx for Windows File Server**. "HPC job over a dataset stored in S3" -> **FSx for Lustre**. "Move a NetApp NAS without changing tools" -> **FSx for NetApp ONTAP**. "Lift a ZFS server" -> **FSx for OpenZFS**.',
      },
      {
        id: 'storage-gateway',
        name: 'Storage Gateway',
        fullName: 'AWS Storage Gateway',
        link: en.aws('storagegateway/'),
        summary:
          'A software or hardware appliance on premises that gives local applications standard storage interfaces backed by AWS, with local caching for low latency.',
        points: [
          '**S3 File Gateway**: NFS (v3, v4.1) and SMB file shares whose files are stored as objects in S3, cached locally. The data is then available to S3 lifecycle, replication and analytics.',
          '**Volume Gateway**: iSCSI block volumes. Cached volumes keep data in S3 and only frequent data on site. Stored volumes keep the full dataset on site and back it up as asynchronous point-in-time snapshots.',
          '**Tape Gateway**: a virtual tape library for existing backup software, archiving tapes to S3 Glacier Flexible Retrieval or S3 Glacier Deep Archive.',
          '**FSx File Gateway**: no longer available to new customers. New designs reach FSx for Windows File Server directly over Direct Connect or Site-to-Site VPN.',
          '**Deployment**: VM on VMware ESXi, Microsoft Hyper-V or Linux KVM, a hardware appliance, or an EC2 instance.',
        ],
        tip: '"Replace physical tapes without changing the backup software" -> **Tape Gateway**. "On-premises app writes files over NFS or SMB that must land in S3" -> **S3 File Gateway**. "Whole dataset on site with low latency, backups in AWS" -> **Volume Gateway stored volumes**.',
      },
    ],
  },
  {
    slug: 'compute',
    group: 'performing',
    icon: 'cpu',
    title: 'Compute performance',
    summary:
      'EC2 instance families, placement groups, networking and Auto Scaling metrics, plus Batch, EMR, edge compute and Elastic Beanstalk.',
    lede: 'Designing high-performing and elastic compute is task 3.2 of **Design High-Performing Architectures**, 24% of the scored content: the right instance, the right placement and scaling on the right metric.',
    sections: [
      {
        id: 'instance-types',
        name: 'Instance types',
        fullName: 'Amazon EC2 instance types',
        link: en.aws('ec2/instance-types/'),
        summary:
          'The instance type fixes the CPU, memory, storage and network of the host. Pick the category first, then the size.',
        points: [
          '**Naming**: in `c7gn.xlarge`, `c` is the series, `7` the generation, `gn` the options (Graviton, network and EBS optimized) and `xlarge` the size. Other options: `a` AMD, `i` Intel, `d` instance store volumes, `z` high CPU frequency.',
          '**Burstable** (T series): a CPU baseline plus credits to burst. Good for low average CPU with spikes, such as small web servers and development environments.',
          '**Flex** (such as M7i-flex and C7i-flex): 40% baseline CPU that can reach 100% for 95% of the time over 24 hours. The most cost-effective choice for general workloads that do not need full CPU all the time.',
          '**Rightsizing**: AWS Compute Optimizer analyzes 14 days of CloudWatch metrics and recommends instance types for EC2 instances and Auto Scaling groups.',
          '**Fixed performance** families (M, C, R and others) sustain full CPU at any time, the right choice for video encoding, high volume websites and HPC.',
        ],
        tip: '"In-memory database or real-time analytics" -> **memory optimized** (R, X). "Batch processing, transcoding, game servers" -> **compute optimized** (C). "High random I/O on large local datasets" -> **storage optimized** (I, D).',
        table: {
          title: 'Instance categories',
          head: ['Category', 'Series and use cases'],
          rows: [
            {
              key: 'General purpose',
              cells: [
                'M, T, Mac. Balanced compute, memory and network: web servers, code repositories, small databases.',
              ],
            },
            {
              key: 'Compute optimized',
              cells: ['C. Fast processors: batch processing, media transcoding, dedicated game servers.'],
            },
            {
              key: 'Memory optimized',
              cells: ['R, X, U, z. Large datasets in memory: in-memory databases, data analytics, enterprise apps.'],
            },
            {
              key: 'Storage optimized',
              cells: ['I, D, H. Low latency random I/O and high sequential throughput on local storage.'],
            },
            {
              key: 'Accelerated computing',
              cells: ['P, G, Inf, Trn, F. GPUs, AWS Inferentia, AWS Trainium and FPGAs for ML and graphics.'],
            },
            { key: 'HPC optimized', cells: ['Hpc. Large-scale simulations, deep learning and rendering.'] },
          ],
        },
      },
      {
        id: 'placement-groups',
        name: 'Placement groups',
        link: en.docs('AWSEC2/latest/UserGuide/placement-strategies.html'),
        summary:
          'Placement groups decide how instances sit on the underlying hardware, trading network performance against isolation from correlated failures.',
        points: [
          '**Cluster**: instances packed in one high-bisection bandwidth segment of a single AZ. Up to 10 Gbps per flow inside the group (5 Gbps outside). Launch all instances in one request with one instance type to avoid capacity errors.',
          '**Partition**: up to 7 partitions per AZ, each on its own racks with separate network and power. The number of instances is limited only by account limits, and topology-aware apps such as HDFS, HBase and Cassandra can see the partition.',
          '**Spread**: each instance on distinct racks, at most 7 running instances per AZ per group. The group can span AZs. For a few critical instances.',
          '**Capacity**: an On-Demand Capacity Reservation can target a cluster placement group. Capacity Reservations do not reserve capacity in partition or spread groups.',
        ],
        tip: '"HPC nodes exchange data constantly" -> **cluster** (with EFA or enhanced networking). "Cassandra or HDFS rack awareness" -> **partition**. "A handful of critical instances must not fail together" -> **spread**.',
        table: {
          title: 'Placement strategies',
          head: ['Strategy', 'Layout and limits'],
          rows: [
            {
              key: 'Cluster',
              cells: [
                'One AZ, one high-bandwidth network segment. Lowest latency, highest throughput. Can span peered VPCs.',
              ],
            },
            {
              key: 'Partition',
              cells: [
                'Groups of racks, up to 7 partitions per AZ, can span AZs. Large distributed and replicated workloads.',
              ],
            },
            {
              key: 'Spread',
              cells: ['One instance per rack, up to 7 running instances per AZ, can span AZs. Small critical sets.'],
            },
          ],
        },
      },
      {
        id: 'enhanced-networking',
        name: 'Enhanced networking',
        fullName: 'ENA and Elastic Fabric Adapter',
        link: en.docs('AWSEC2/latest/UserGuide/enhanced-networking.html'),
        summary:
          'Network performance depends on the instance type and on the network device. Both options below have no additional charge.',
        points: [
          '**ENA** (Elastic Network Adapter): enhanced networking with SR-IOV for higher bandwidth, higher packets per second and consistently lower latency. All Nitro-based instances use it, with up to 100 Gbps.',
          '**EFA** (Elastic Fabric Adapter): adds OS-bypass through Libfabric and the SRD protocol for MPI (HPC) and NCCL (machine learning) traffic, with lower and more consistent latency than TCP.',
          '**EFA limits**: EFA traffic cannot cross AZs or VPCs and is not routable. Only supported instance types, and not on AWS Outposts.',
          '**Instance choice**: the `n` option means network and EBS optimized. Between two instances, the slower one caps the throughput.',
        ],
        tip: '"Tightly coupled HPC or distributed ML training with MPI or NCCL" -> **EFA** inside a **cluster placement group**. "More PPS and lower latency for a regular application tier" -> **ENA** enhanced networking, not EFA.',
      },
      {
        id: 'auto-scaling',
        name: 'Scaling metrics',
        fullName: 'Amazon EC2 Auto Scaling',
        link: en.docs('autoscaling/ec2/userguide/as-scale-based-on-demand.html'),
        summary:
          'Auto Scaling moves the desired capacity between the minimum and the maximum. The policy and the metric decide how fast and how precisely it follows load.',
        points: [
          '**Target tracking** (recommended): keeps a metric at a target, like a thermostat. Predefined metrics are `ASGAverageCPUUtilization`, `ASGAverageNetworkIn`, `ASGAverageNetworkOut` and `ALBRequestCountPerTarget`.',
          '**Right metric**: it must change in inverse proportion to capacity. Raw `RequestCount`, latency and the SQS `ApproximateNumberOfMessagesVisible` do not work. For queues, use **backlog per instance**.',
          '**Step and simple scaling**: CloudWatch alarm thresholds with adjustments sized by the breach, or a single adjustment followed by a cooldown.',
          '**Predictive and scheduled**: predictive scaling uses up to 14 days of history (24 hours minimum) to forecast 48 hours and launch capacity before daily or weekly peaks. Scheduled actions change capacity at set times, once or on a cron.',
          '**Reaction time**: enable EC2 detailed monitoring (1-minute metrics instead of 5) and set an instance warmup so new instances do not distort the average.',
          '**AWS Auto Scaling**: one place to build scaling plans for EC2 Auto Scaling groups, Spot Fleets, ECS tasks, DynamoDB tables and indexes, and Aurora Replicas.',
        ],
        tip: '"Workers consuming an SQS queue fall behind" -> target tracking on **backlog per instance**. "Load jumps every weekday at 9 AM and instances boot slowly" -> **predictive** or **scheduled** scaling. "Keep CPU around 50%" -> **target tracking**.',
      },
      {
        id: 'hibernation',
        name: 'Hibernation',
        fullName: 'EC2 instance hibernation',
        link: en.docs('AWSEC2/latest/UserGuide/Hibernate.html'),
        summary:
          'Hibernation writes RAM to the EBS root volume and resumes the same processes on start, skipping a long boot or cache warm-up.',
        points: [
          '**Prerequisites**: enabled at launch only, on an encrypted EBS root volume large enough for the RAM, with a supported AMI and family. RAM under 150 GiB on Linux and up to 16 GiB on Windows.',
          '**After resume**: same instance ID, private IPs and Elastic IPs. A new public IPv4 address is assigned and instance store data is lost.',
          '**Limits**: no changes while hibernated, at most 60 days hibernated, and no hibernation for instances in an Auto Scaling group or used by ECS.',
          '**Billing**: no instance usage charge while stopped. You pay for the EBS volumes, including the saved RAM, and associated Elastic IPs.',
        ],
        tip: '"Application takes too long to rebuild its in-memory state after a restart" -> **hibernate** instead of stop. If the instance belongs to an **Auto Scaling group**, hibernation is not an option.',
      },
      {
        id: 'batch-emr',
        name: 'Batch and EMR',
        fullName: 'AWS Batch and Amazon EMR',
        link: en.aws('batch/'),
        summary:
          'Managed engines for workloads made of jobs, not servers: AWS Batch for containerized batch jobs, Amazon EMR for big data frameworks.',
        points: [
          '**AWS Batch**: queues containerized jobs and provisions the compute they need on ECS, EKS, Fargate and On-Demand or Spot instances, scaling with the queue. No additional charge beyond the resources used.',
          '**Batch fit**: ML training, simulations, genomics, rendering, transcoding and financial analytics, including jobs longer than the 15 minutes Lambda allows.',
          '**Amazon EMR**: managed Apache Spark, Hive, Trino, Flink and other frameworks, on EC2 clusters, on EKS or as EMR Serverless.',
          '**EMR nodes**: primary (coordinates), core (runs tasks and stores HDFS) and optional task nodes (run tasks only). Task nodes hold no HDFS data, which makes them the natural place for Spot Instances.',
          '**Transient clusters**: keep input and output in S3 and let the cluster terminate after its last step.',
        ],
        tip: '"Thousands of containerized jobs, no scheduler to run" -> **AWS Batch**. "Petabyte-scale Spark or Hive processing" -> **Amazon EMR** (EMR Serverless to skip cluster management). A job over 15 minutes rules out **Lambda**.',
      },
      {
        id: 'edge-compute',
        name: 'Compute near users',
        fullName: 'Outposts, Local Zones and Wavelength',
        link: en.aws('outposts/'),
        summary:
          'When milliseconds or data location matter, AWS infrastructure runs outside the Region while the parent Region keeps the same APIs and tools.',
        points: [
          '**AWS Outposts**: AWS-managed 42U racks (up to 96) or 1U and 2U servers in your own facility. For single-digit millisecond latency to on-premises systems, local data processing and migrations with local dependencies.',
          '**Local Zones**: AWS compute, storage, database and networking in large metro areas, extending a Region. For real-time gaming, live streaming, AR/VR and virtual workstations close to users.',
          '**Wavelength**: AWS compute and storage at the edge of telecom carrier networks, reached through a carrier gateway. For low latency to mobile devices on 5G.',
          '**VPC extension**: a VPC spans Availability Zones, Local Zones and Wavelength Zones through subnets created in each zone.',
          '**Data residency**: all three keep data inside a chosen country, state or site to meet regulatory requirements.',
        ],
        tip: '"Low latency to systems that must stay in our data center" -> **Outposts**. "Low latency for users in a city far from any Region" -> **Local Zones**. "Mobile app on a 5G carrier network" -> **Wavelength**.',
      },
      {
        id: 'elastic-beanstalk',
        name: 'Elastic Beanstalk',
        fullName: 'AWS Elastic Beanstalk',
        link: en.aws('elasticbeanstalk/'),
        summary:
          'Upload the code and Elastic Beanstalk provisions the environment, load balancing, health monitoring and scaling. No additional charge beyond the resources.',
        points: [
          '**Platforms**: Go, Java, .NET, Node.js, PHP, Python, Ruby and Docker containers.',
          '**Modes**: Standard runs directly on EC2 and supports Windows. Cluster runs on Amazon EKS for faster deployments and autoscaling.',
          '**Worker environment**: a managed SQS queue plus a daemon that POSTs each message to the application. Offloads long tasks from the web tier and runs periodic jobs from `cron.yaml`.',
          '**Control**: the resources are created in your account, so you keep access to the instances and their configuration.',
        ],
        tip: '"Developers want to deploy a web app fast without managing infrastructure" -> **Elastic Beanstalk**. "Long background tasks slow the web tier" -> a **worker environment** with SQS.',
      },
    ],
  },
  {
    slug: 'serverless-containers',
    group: 'performing',
    icon: 'box',
    title: 'Serverless and containers',
    summary:
      'Lambda memory, limits and concurrency, ECS versus EKS, Fargate versus EC2, ECR and hybrid containers, and when each one fits.',
    lede: 'Serverless technologies and container orchestration belong to task 3.2 of **Design High-Performing Architectures**, 24% of the scored content: who manages the servers, how fast it scales and what it costs.',
    sections: [
      {
        id: 'lambda',
        name: 'Lambda',
        fullName: 'AWS Lambda',
        link: en.docs('lambda/latest/dg/gettingstarted-limits.html'),
        summary:
          'Runs code in response to events with no servers to manage. Designed for short-lived tasks that keep no state between invocations.',
        points: [
          '**Memory and CPU**: 128 MB to 10,240 MB in 1 MB steps. CPU is allocated in proportion to memory, and 1,769 MB equals 1 vCPU. More memory is the main lever for CPU-bound or network-bound functions.',
          '**Timeout**: up to 900 seconds (15 minutes) per invocation.',
          '**Payloads**: 6 MB for synchronous request and response, 1 MB for asynchronous events. Environment variables total 4 KB.',
          '**Packaging**: .zip up to 50 MB zipped and 250 MB unzipped with layers, or a container image up to 10 GB. `/tmp` from 512 MB to 10,240 MB.',
          '**Layers**: up to 5 per function, extracted to `/opt`, to share libraries across functions. Only for .zip functions, not container images.',
          '**Tuning**: AWS Lambda Power Tuning and AWS Compute Optimizer help pick the memory setting.',
        ],
        tip: '"CPU-bound function is slow" -> **raise memory** (CPU follows). "Processing takes 40 minutes" -> not Lambda, use **ECS on Fargate** or **AWS Batch**. "Same library in many functions" -> **layers**.',
      },
      {
        id: 'lambda-concurrency',
        name: 'Concurrency',
        fullName: 'Lambda concurrency',
        link: en.docs('lambda/latest/dg/lambda-concurrency.html'),
        summary:
          'Concurrency is average requests per second times average duration. Functions in a Region share 1,000 concurrent executions by default, a quota that can be raised.',
        points: [
          '**Reserved concurrency**: a slice of the pool that is both the guaranteed minimum and the maximum for the function. Protects critical functions or caps one that would overload a downstream resource. No charge.',
          '**Provisioned concurrency**: pre-initialized execution environments that answer without cold starts. Extra charge, and it can follow a schedule or utilization through Application Auto Scaling.',
          '**Limits**: each function scales by up to 1,000 execution environments every 10 seconds. Lambda keeps 100 units unreserved, so 900 of the default 1,000 can be reserved. Requests per second are capped at 10 times the concurrency.',
          '**SnapStart**: snapshots the initialized environment when a version is published and resumes from it, with startup as low as sub-second. Java 11+, Python 3.12+ and .NET 8+. Free on Java, caching and restore charges on the others.',
          '**SnapStart limits**: published versions only, and no combination with provisioned concurrency, EFS or `/tmp` above 512 MB.',
        ],
        tip: '"Cold starts unacceptable on a latency-sensitive API" -> **provisioned concurrency** (or **SnapStart** for Java, Python, .NET). "A function overwhelms the database" -> **reserved concurrency** as a cap.',
      },
      {
        id: 'event-sources',
        name: 'Event sources',
        link: en.docs('lambda/latest/dg/invocation-eventsourcemapping.html'),
        summary:
          'Services either push events to Lambda through triggers, or Lambda polls them through an event source mapping that reads batches.',
        points: [
          '**Triggers (push)**: S3, SNS, API Gateway and others invoke the function as soon as the event happens. The trigger is configured and stored on the source service.',
          '**Event source mappings (poll)**: Lambda pollers read SQS, Kinesis, DynamoDB, Amazon MSK, self-managed Kafka, Amazon MQ and DocumentDB and invoke the function with batches of records.',
          '**Batching**: a batch closes at the batch size, at the batching window (0 to 300 seconds) or at 6 MB of payload. Larger batches spread the invoke overhead and raise throughput.',
          '**At least once**: mappings can process a record more than once, so make the handler idempotent. On error, stream batches are retried and the shard pauses to keep order.',
          '**Provisioned mode**: dedicated pollers with a minimum and maximum for SQS, Amazon MSK and Kafka mappings, when latency must stay consistent. Extra charge.',
        ],
        tip: '"Process SQS messages with Lambda in batches" -> **event source mapping**. "Run code when an object arrives in S3" -> **S3 event notification** trigger. "Duplicates broke the results" -> make the handler **idempotent**.',
      },
      {
        id: 'ecs-eks',
        name: 'ECS vs EKS',
        fullName: 'Amazon ECS and Amazon EKS',
        link: en.aws('containers/'),
        summary:
          'Both orchestrate containers on EC2, Fargate or on premises. The choice comes down to whether you want Kubernetes.',
        points: [
          '**Amazon ECS**: AWS-native orchestrator with no control plane to run. A task definition is the blueprint, a task runs it, and a service keeps the desired number of tasks running.',
          '**Amazon EKS**: managed, certified Kubernetes-conformant control plane. Reuses Kubernetes manifests, tools and skills, and keeps workloads portable.',
          '**EKS Auto Mode**: AWS also manages the nodes, including provisioning, instance selection, scaling and OS patching.',
          '**Scaling**: ECS Service Auto Scaling changes the number of tasks, and Cluster Auto Scaling changes the EC2 instances registered to the cluster.',
          '**Cost**: ECS orchestration has no additional charge. EKS adds a per-cluster charge on top of the compute.',
        ],
        tip: '"Team already runs Kubernetes and wants a managed control plane" -> **EKS**. "Simplest AWS-native container orchestration with least overhead" -> **ECS**, usually on Fargate.',
        table: {
          title: 'ECS or EKS',
          head: ['Criterion', 'ECS and EKS'],
          rows: [
            { key: 'API', cells: ['**ECS**: AWS-native concepts. **EKS**: standard Kubernetes.'] },
            {
              key: 'Control plane',
              cells: [
                '**ECS**: nothing to run or upgrade. **EKS**: managed by AWS, but you follow Kubernetes version upgrades.',
              ],
            },
            {
              key: 'Capacity',
              cells: ['**Both**: EC2, Fargate and on-premises options (ECS Anywhere, EKS Anywhere, EKS Hybrid Nodes).'],
            },
            {
              key: 'Best for',
              cells: ['**ECS**: least operational effort on AWS. **EKS**: Kubernetes skills, tooling or portability.'],
            },
          ],
        },
      },
      {
        id: 'fargate',
        name: 'Fargate vs EC2',
        fullName: 'AWS Fargate',
        link: en.aws('fargate/'),
        summary:
          'The capacity under ECS or EKS. Fargate runs each task with no servers to manage, while the EC2 launch type runs tasks on instances you manage.',
        points: [
          '**Fargate**: you set CPU and memory per task, and each task has its own isolation boundary with no shared kernel, CPU, memory or network interface. Billed per second for vCPU, memory and storage, with a 1-minute minimum on Linux.',
          '**Task sizes**: from 0.25 vCPU with 512 MiB up to 32 vCPU with 244 GB on Linux. 20 GB of ephemeral storage is included.',
          '**Networking**: always `awsvpc` mode with one network interface per task, so load balancer target groups use the `ip` target type.',
          '**Fargate Spot**: up to 70% off for interruption-tolerant ECS tasks, with a 2-minute warning. Linux only.',
          '**EC2 launch type**: you manage instances, AMIs and cluster capacity, and in return get GPUs, privileged containers and any instance type, none of which Fargate supports.',
        ],
        tip: '"Run containers without managing or patching servers" -> **Fargate**. "Containers need GPUs or privileged mode" -> **EC2 launch type**. "Cheap, interruptible container jobs" -> **Fargate Spot**.',
        table: {
          title: 'Fargate or EC2 capacity',
          head: ['Aspect', 'Fargate and EC2'],
          rows: [
            { key: 'Servers', cells: ['**Fargate**: none to manage. **EC2**: you choose, patch and scale instances.'] },
            {
              key: 'Billing',
              cells: ['**Fargate**: per task vCPU, memory and storage. **EC2**: per instance, used or not.'],
            },
            {
              key: 'Isolation',
              cells: ['**Fargate**: one boundary per task. **EC2**: tasks share the instance.'],
            },
            {
              key: 'Features',
              cells: ['**Fargate**: no GPU, no privileged mode. **EC2**: GPUs, privileged mode, any instance type.'],
            },
          ],
        },
      },
      {
        id: 'ecr',
        name: 'ECR and migration',
        fullName: 'Amazon ECR',
        link: en.aws('ecr/'),
        summary:
          'Amazon ECR stores the images that ECS, EKS and Lambda pull. Moving an application into containers starts with building an image and pushing it to ECR.',
        points: [
          '**Registry**: private repositories with IAM resource-based permissions, plus ECR Public. Docker images, OCI images and OCI artifacts.',
          '**Image scanning**: scan on push to find software vulnerabilities in each new image.',
          '**Lifecycle policies**: rules that clean up unused images, testable before they apply.',
          '**Replication and cache**: cross-Region and cross-account replication, and pull through cache rules that keep upstream images in your private registry.',
          '**Containerizing**: package the app and its dependencies in an image, push it to ECR, describe it in a task definition or pod spec, and run it on Fargate or EC2. The same image runs the same way in every environment.',
          '**Private pulls**: tasks in private subnets pull from ECR through an interface VPC endpoint instead of a NAT gateway.',
        ],
        tip: '"Store and scan images, copy them to a DR Region" -> **ECR** with replication. "Fargate tasks in private subnets cannot pull images" -> add an **ECR interface endpoint** or a NAT gateway.',
      },
      {
        id: 'hybrid-containers',
        name: 'Containers on premises',
        fullName: 'ECS Anywhere and EKS Anywhere',
        link: en.docs('AmazonECS/latest/developerguide/ecs-anywhere.html'),
        summary:
          'The same orchestrators can manage servers in your own data center, for data that must stay local or for a gradual migration.',
        points: [
          '**ECS Anywhere**: registers on-premises servers or VMs as external instances of an ECS cluster (`EXTERNAL` launch type) through the SSM Agent. Charged per registered instance per hour.',
          '**ECS Anywhere limits**: no load balancing, no service discovery, no `awsvpc` mode and no EFS volumes. Best for workloads that generate outbound traffic or process data.',
          '**EKS Anywhere**: creates and operates Kubernetes clusters on your own infrastructure (VMware vSphere, bare metal, Nutanix, AWS Snow), even air-gapped. Open source and free, with optional Enterprise Subscriptions.',
          '**EKS Distro**: the Kubernetes distribution used by Amazon EKS and the base of EKS Anywhere.',
          '**EKS Hybrid Nodes**: on-premises and edge servers joined as nodes of an Amazon EKS cluster.',
        ],
        tip: '"Run containers on premises, managed from the ECS console" -> **ECS Anywhere**. "Kubernetes in a disconnected data center" -> **EKS Anywhere**. "On-premises service needs inbound traffic through a load balancer" -> ECS Anywhere is a poor fit.',
      },
      {
        id: 'choosing',
        name: 'Choosing the model',
        fullName: 'Containers or serverless',
        link: en.docs('decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html'),
        summary:
          'Most designs mix both. The deciding factors are run time, control over the runtime, traffic shape and the operational effort the team can carry.',
        points: [
          '**Lambda**: event-driven or unpredictable traffic, tasks under 15 minutes, pay per request and duration, no OS or runtime to manage.',
          '**Fargate**: long-running services or jobs in containers with no servers to manage, any language or binary inside the image.',
          '**ECS or EKS on EC2**: GPUs, specific instance types, privileged access or full control of the hosts.',
          '**Decoupling**: put SQS, SNS or EventBridge between components so each tier scales independently on its own metric.',
          '**AWS Serverless Application Repository**: publish and deploy reusable serverless applications defined with AWS SAM templates, shared publicly or with specific accounts. No charge beyond the deployed resources.',
        ],
        tip: '"Unpredictable traffic, no servers, pay only when it runs" -> **Lambda**. "Containerized service running 24/7 without host management" -> **ECS on Fargate**. "Reuse a published serverless app across accounts" -> **Serverless Application Repository**.',
      },
    ],
  },
]

export const ptBR: readonly Topic[] = [
  {
    slug: 'storage',
    group: 'performing',
    icon: 'storage',
    title: 'Desempenho de armazenamento',
    summary:
      'Armazenamento em bloco, arquivo e objeto na AWS, com os limites e ajustes que definem a opção certa de S3, EBS, EFS ou FSx.',
    lede: 'Escolher serviços e configurações de armazenamento que atendam ao desempenho exigido e acompanhem o crescimento. É a tarefa 3.1 de **Design High-Performing Architectures**, o domínio que vale 24% do conteúdo pontuado.',
    sections: [
      {
        id: 'storage-types',
        name: 'Bloco, arquivo, objeto',
        link: pt.aws('compare/the-difference-between-block-file-object-storage/'),
        summary:
          'A primeira decisão é o tipo de armazenamento. Ele define como o dado é endereçado, quem pode compartilhá-lo e até onde ele escala.',
        points: [
          '**Bloco** (Amazon EBS, instance store): blocos de tamanho fixo ligados a uma instância, com baixa latência e muitos IOPS. Serve para volumes de boot, bancos de dados e cargas transacionais.',
          '**Arquivo** (Amazon EFS, Amazon FSx): sistema de arquivos hierárquico compartilhado por vários clientes ao mesmo tempo via NFS ou SMB.',
          '**Objeto** (Amazon S3): objetos com metadados em um namespace plano, acessados por APIs HTTPS, com escala praticamente ilimitada.',
          '**Híbrido** (AWS Storage Gateway): aplicações locais acessam o armazenamento na nuvem por interfaces de arquivo, volume ou fita.',
        ],
        tip: '"Sistema de arquivos compartilhado por muitas instâncias Linux" -> **EFS**, não EBS. "Disco de menor latência para uma instância de banco" -> **EBS** (ou instance store se o dado for temporário). "Milhões de imagens ou um data lake" -> **S3**.',
      },
      {
        id: 's3-performance',
        name: 'Desempenho do S3',
        fullName: 'Amazon S3 performance',
        link: pt.docs('AmazonS3/latest/userguide/optimizing-performance.html'),
        summary:
          'O Amazon S3 escala sozinho, mas a taxa de requisições é contada por prefixo e objetos grandes trafegam mais rápido divididos em requisições paralelas.',
        points: [
          '**Prefixos**: no mínimo 3.500 `PUT`/`COPY`/`POST`/`DELETE` e 5.500 `GET`/`HEAD` por segundo por prefixo particionado, sem limite de prefixos. 10 prefixos chegam a 55.000 leituras por segundo. Enquanto o S3 escala, ele pode responder `503 Slow Down`.',
          '**Multipart upload**: recomendado a partir de 100 MB e obrigatório acima de 5 GB, o limite de um único `PUT`. Partes de 5 MiB a 5 GiB, até 10.000 partes, enviadas em paralelo e reenviadas uma a uma. Objetos chegam a 48,8 TiB.',
          '**Transfer Acceleration**: o upload entra pelo edge location do CloudFront mais próximo e segue até o bucket por um caminho de rede otimizado. Usa o endpoint `bucket.s3-accelerate.amazonaws.com`, exige nome de bucket compatível com DNS e sem pontos, e pode gerar cobrança de transferência.',
          '**Byte-range fetches**: requisições `GET` com o cabeçalho `Range` leem partes de um mesmo objeto em conexões simultâneas, o que aumenta o throughput agregado e barateia as novas tentativas.',
          '**Proximidade e cache**: leia o bucket a partir do EC2 na mesma Região e coloque CloudFront ou ElastiCache na frente do S3 para leituras repetidas que precisam de menos latência.',
        ],
        tip: '"Uploads grandes de escritórios em outros continentes estão lentos" -> **Transfer Acceleration** mais **multipart upload**. "Erros 503 em um prefixo muito acessado" -> espalhe as chaves em **mais prefixos**. "Ler só um pedaço de um arquivo enorme" -> **byte-range fetch**.',
      },
      {
        id: 's3-storage-classes',
        name: 'Classes do S3',
        fullName: 'Amazon S3 storage classes',
        link: pt.docs('AmazonS3/latest/userguide/storage-class-intro.html'),
        summary:
          'Toda classe recomendada é projetada para 99,999999999% (11 noves) de durabilidade. Elas mudam em disponibilidade, número de AZs, duração mínima e tempo de recuperação.',
        points: [
          '**Duração mínima**: 30 dias em Standard-IA e One Zone-IA, 90 dias em Glacier Instant Retrieval e Glacier Flexible Retrieval, 180 dias em Glacier Deep Archive. Apagar antes ainda cobra os dias restantes.',
          '**Tamanho mínimo cobrado**: 128 KB em Standard-IA, One Zone-IA e Glacier Instant Retrieval. O Intelligent-Tiering não monitora objetos com menos de 128 KB.',
          '**Uma única AZ**: One Zone-IA e Express One Zone não resistem à perda da zona de disponibilidade. Guarde ali só o que dá para recriar.',
          '**Recuperação de arquivo**: o Glacier Flexible Retrieval restaura em 1 a 5 minutos (Expedited), 3 a 5 horas (Standard) ou 5 a 12 horas (Bulk, gratuito). O Deep Archive restaura em até 12 horas (Standard) ou 48 horas (Bulk).',
          '**Regras de lifecycle**: movem objetos para classes mais baratas conforme envelhecem, expiram objetos e abortam multipart uploads incompletos.',
        ],
        tip: '"Padrão de acesso desconhecido ou variável" -> **Intelligent-Tiering**. "Lido uma vez por trimestre, mas precisa de milissegundos" -> **Glacier Instant Retrieval**. "Arquivo de compliance, 48 horas para recuperar é aceitável, menor custo" -> **Glacier Deep Archive**.',
        table: {
          title: 'Classes de armazenamento do S3',
          head: ['Classe', 'Perfil'],
          rows: [
            {
              key: 'Standard',
              cells: [
                'Acesso frequente em milissegundos. 99,99% de disponibilidade, 3 ou mais AZs, sem duração mínima.',
              ],
            },
            {
              key: 'Intelligent-Tiering',
              cells: [
                'Padrão desconhecido ou variável. Move objetos para Infrequent Access após 30 dias e Archive Instant Access após 90 dias sem acesso. Taxa de monitoramento, sem taxa de recuperação.',
              ],
            },
            {
              key: 'Express One Zone',
              cells: [
                'Acesso em milissegundos de um dígito em uma AZ escolhida, em directory buckets. Até 10x mais rápido que o Standard, com requisições 50% mais baratas.',
              ],
            },
            {
              key: 'Standard-IA',
              cells: [
                'Acesso cerca de uma vez por mês, em milissegundos. 99,9% de disponibilidade, taxa de recuperação por GB.',
              ],
            },
            { key: 'One Zone-IA', cells: ['Dado pouco acessado e recriável em 1 AZ. 99,5% de disponibilidade.'] },
            {
              key: 'Glacier Instant Retrieval',
              cells: ['Arquivo lido cerca de uma vez por trimestre, ainda em milissegundos.'],
            },
            {
              key: 'Glacier Flexible Retrieval',
              cells: [
                'Arquivo lido uma ou duas vezes por ano, restaurado de minutos a 12 horas. Bom para backup e DR.',
              ],
            },
            {
              key: 'Glacier Deep Archive',
              cells: ['Menor custo da AWS, lido menos de uma vez por ano, restaurado em 12 a 48 horas.'],
            },
          ],
        },
      },
      {
        id: 'ebs-volume-types',
        name: 'Tipos de volume EBS',
        fullName: 'Amazon EBS',
        link: pt.docs('ebs/latest/userguide/ebs-volume-types.html'),
        summary:
          'Volumes SSD são ajustados para IOPS em I/O pequeno e aleatório. Volumes HDD são ajustados para throughput em I/O grande e sequencial.',
        points: [
          '**gp3**: 3.000 IOPS e 125 MiB/s incluídos em qualquer tamanho. IOPS (até 500 por GiB) e throughput são provisionados sem depender do tamanho, até 80.000 IOPS e 2.000 MiB/s, com preço por GiB 20% menor que o gp2.',
          '**gp2**: 3 IOPS por GiB, de 100 a 16.000. Volumes abaixo de 1 TiB fazem burst até 3.000 IOPS com créditos de I/O. O desempenho só cresce com o tamanho.',
          '**io2 Block Express**: até 256.000 IOPS, 4.000 MiB/s e 64 TiB, com 99,999% de durabilidade e latência média abaixo de 500 microssegundos. Para bancos críticos que precisam de IOPS sustentado.',
          '**HDD** (st1, sc1): de 125 GiB a 16 TiB e nunca volume de boot. st1 para big data, data warehouses e logs, sc1 para o armazenamento mais barato de dados raramente lidos.',
          '**Elastic Volumes**: muda tipo, IOPS e throughput de um volume em uso sem interromper a instância, por exemplo de gp2 para gp3.',
          '**Lado da instância**: use instâncias EBS-optimized para alcançar os IOPS provisionados. Volumes acima de 64.000 IOPS exigem instâncias baseadas em Nitro.',
        ],
        tip: '"Mais IOPS sem pagar por mais GiB" -> **gp3** (no gp2 o IOPS depende do tamanho). "Mais de 80.000 IOPS ou latência abaixo de 1 milissegundo" -> **io2 Block Express**. "EBS mais barato para logs sequenciais" -> **st1**, ou **sc1** se quase não for lido.',
        table: {
          title: 'Tipos de volume EBS',
          head: ['Tipo', 'Limites e uso'],
          rows: [
            {
              key: 'gp3',
              cells: [
                '1 GiB a 64 TiB, 3.000 a 80.000 IOPS, 125 a 2.000 MiB/s. Padrão para boot e a maioria das cargas.',
              ],
            },
            { key: 'gp2', cells: ['1 GiB a 16 TiB, até 16.000 IOPS (3 por GiB), até 250 MiB/s. Créditos de burst.'] },
            {
              key: 'io2 Block Express',
              cells: ['4 GiB a 64 TiB, até 256.000 IOPS e 4.000 MiB/s, 99,999% de durabilidade. Multi-Attach.'],
            },
            { key: 'io1', cells: ['4 GiB a 16 TiB, até 64.000 IOPS e 1.000 MiB/s. Multi-Attach.'] },
            { key: 'st1', cells: ['125 GiB a 16 TiB, até 500 MiB/s. Big data, warehouses, logs. Não serve de boot.'] },
            { key: 'sc1', cells: ['125 GiB a 16 TiB, até 250 MiB/s. Dado frio de menor custo. Não serve de boot.'] },
          ],
        },
      },
      {
        id: 'multi-attach-instance-store',
        name: 'Multi-Attach e instance store',
        link: pt.docs('ebs/latest/userguide/ebs-volumes-multi.html'),
        summary:
          'Duas opções de bloco fora da regra de um volume durável por instância: um volume Provisioned IOPS compartilhado e discos locais rápidos que vivem e morrem com a instância.',
        points: [
          '**Multi-Attach**: um volume io1 ou io2 ligado a até 16 instâncias baseadas em Nitro na mesma zona de disponibilidade, todas com leitura e escrita. Sem custo adicional.',
          '**Escrita coordenada**: XFS e ext4 não foram feitos para vários escritores simultâneos. Use um sistema de arquivos em cluster ou uma aplicação que ordene as escritas. Volumes Multi-Attach não podem ser volume de boot.',
          '**Instance store**: discos fisicamente ligados ao host, incluídos no preço da instância. Ideal para buffers, caches, dados de rascunho e dados replicados entre várias instâncias.',
          '**Dado efêmero**: sobrevive a um reboot, mas se perde em stop, hibernação, término ou falha do disco. Só pode ser adicionado no launch e nunca desanexado.',
        ],
        tip: '"Aplicação em cluster em uma AZ precisa de um dispositivo de bloco compartilhado" -> **EBS Multi-Attach** com io2. "Maior I/O de disco para dado temporário, perda aceitável" -> **instance store**. Dado que precisa sobreviver a um stop fica no **EBS**.',
      },
      {
        id: 'efs',
        name: 'EFS',
        fullName: 'Amazon Elastic File System',
        link: pt.docs('efs/latest/ug/performance.html'),
        summary:
          'Sistema de arquivos NFS serverless que cresce sozinho até petabytes e é compartilhado por EC2, ECS, EKS, Fargate e Lambda. Instâncias Windows não são suportadas.',
        points: [
          '**Protocolo**: NFSv4.0 e NFSv4.1 com permissões POSIX. Para compartilhamentos SMB no Windows, use o FSx for Windows File Server.',
          '**Tipo de sistema de arquivos**: Regional guarda os dados em 3 ou mais AZs (recomendado). One Zone guarda em 1 AZ, mais barato mas exposto à perda dessa AZ.',
          '**Modo de desempenho**: General Purpose (padrão, menor latência, recomendado). Max I/O é de geração anterior, com mais latência, e não existe com throughput Elastic nem em One Zone.',
          '**Modo de throughput**: Elastic (padrão) escala sozinho para cargas com picos ou imprevisíveis. Provisioned fixa o throughput para necessidades conhecidas. Bursting acompanha o volume de dados na classe Standard.',
          '**Classes de armazenamento**: Standard (SSD, leitura abaixo de 1 milissegundo), Infrequent Access e Archive (dezenas de milissegundos, mínimo de 90 dias no Archive). O lifecycle management move os arquivos entre elas.',
          '**Replicação**: mantém uma cópia em outra Região com RPO e RTO medidos em minutos.',
        ],
        tip: '"Centenas de instâncias Linux em várias AZs compartilham os mesmos arquivos" -> **EFS Regional**. "Sistema de arquivos limitado no modo Bursting" -> mude para throughput **Elastic** ou **Provisioned**. "Compartilhamento de arquivos Windows" nunca é EFS.',
      },
      {
        id: 'fsx',
        name: 'FSx',
        fullName: 'Amazon FSx',
        link: pt.aws('fsx/when-to-choose-fsx/'),
        summary:
          'Sistemas de arquivos totalmente gerenciados, baseados em tecnologias comerciais e open source conhecidas. Escolha o que combina com o protocolo ou o sistema de arquivos já em uso.',
        points: [
          '**FSx for Windows File Server**: sistema de arquivos Windows nativo via SMB, com autenticação no Microsoft Active Directory e ACLs do Windows. Single-AZ ou Multi-AZ com servidor standby, armazenamento SSD ou HDD.',
          '**FSx for Lustre**: sistema de arquivos paralelo POSIX para HPC, machine learning, processamento de vídeo e modelagem financeira. Liga-se a um bucket S3, apresenta os objetos como arquivos e grava os resultados de volta. Implantação scratch (sem replicação) ou persistent, clientes Linux.',
          '**FSx for NetApp ONTAP**: acesso multiprotocolo NFS, SMB, iSCSI e NVMe a partir de Linux, Windows e macOS. Snapshots, clones, replicação SnapMirror, compressão, deduplicação e tiering automático de dados frios.',
          '**FSx for OpenZFS**: acesso NFS para migrar servidores ZFS ou Linux, com latência de centenas de microssegundos, snapshots, clones e compressão. Implantações Multi-AZ ou Single-AZ.',
        ],
        tip: '"Compartilhamentos Windows integrados ao Active Directory" -> **FSx for Windows File Server**. "Job de HPC sobre um dataset guardado no S3" -> **FSx for Lustre**. "Migrar um NAS NetApp sem trocar ferramentas" -> **FSx for NetApp ONTAP**. "Levar um servidor ZFS" -> **FSx for OpenZFS**.',
      },
      {
        id: 'storage-gateway',
        name: 'Storage Gateway',
        fullName: 'AWS Storage Gateway',
        link: pt.aws('storagegateway/'),
        summary:
          'Um appliance de software ou hardware no ambiente local que oferece às aplicações interfaces de armazenamento padrão apoiadas na AWS, com cache local para baixa latência.',
        points: [
          '**S3 File Gateway**: compartilhamentos NFS (v3, v4.1) e SMB cujos arquivos viram objetos no S3, com cache local. Os dados ficam disponíveis para lifecycle, replicação e análise no S3.',
          '**Volume Gateway**: volumes de bloco iSCSI. Volumes cached guardam os dados no S3 e só o que é frequente no local. Volumes stored guardam o dataset inteiro no local e fazem backup por snapshots assíncronos.',
          '**Tape Gateway**: biblioteca de fitas virtual para o software de backup existente, arquivando as fitas no S3 Glacier Flexible Retrieval ou no S3 Glacier Deep Archive.',
          '**FSx File Gateway**: não está mais disponível para novos clientes. Projetos novos acessam o FSx for Windows File Server direto por Direct Connect ou Site-to-Site VPN.',
          '**Implantação**: VM em VMware ESXi, Microsoft Hyper-V ou Linux KVM, appliance de hardware ou instância EC2.',
        ],
        tip: '"Substituir fitas físicas sem trocar o software de backup" -> **Tape Gateway**. "Aplicação local grava arquivos via NFS ou SMB que precisam ir para o S3" -> **S3 File Gateway**. "Dataset inteiro no local com baixa latência e backup na AWS" -> **Volume Gateway stored volumes**.',
      },
    ],
  },
  {
    slug: 'compute',
    group: 'performing',
    icon: 'cpu',
    title: 'Desempenho de computação',
    summary:
      'Famílias de instâncias EC2, placement groups, rede e métricas de Auto Scaling, além de Batch, EMR, computação na borda e Beanstalk.',
    lede: 'Projetar computação de alto desempenho e elástica é a tarefa 3.2 de **Design High-Performing Architectures**, 24% do conteúdo pontuado: a instância certa, no lugar certo, escalando pela métrica certa.',
    sections: [
      {
        id: 'instance-types',
        name: 'Tipos de instância',
        fullName: 'Amazon EC2 instance types',
        link: pt.aws('ec2/instance-types/'),
        summary:
          'O tipo de instância define CPU, memória, armazenamento e rede do host. Escolha primeiro a categoria, depois o tamanho.',
        points: [
          '**Nomenclatura**: em `c7gn.xlarge`, `c` é a série, `7` a geração, `gn` as opções (Graviton, otimizada para rede e EBS) e `xlarge` o tamanho. Outras opções: `a` AMD, `i` Intel, `d` volumes de instance store, `z` alta frequência de CPU.',
          '**Burstable** (série T): uma linha de base de CPU mais créditos para burst. Boa para CPU média baixa com picos, como pequenos servidores web e ambientes de desenvolvimento.',
          '**Flex** (como M7i-flex e C7i-flex): 40% de CPU de base, podendo chegar a 100% durante 95% do tempo em 24 horas. A opção de melhor custo para cargas gerais que não precisam de CPU cheia o tempo todo.',
          '**Rightsizing**: o AWS Compute Optimizer analisa 14 dias de métricas do CloudWatch e recomenda tipos de instância para instâncias EC2 e grupos de Auto Scaling.',
          '**Desempenho fixo**: famílias como M, C e R sustentam CPU cheia a qualquer momento, a escolha para codificação de vídeo, sites de alto volume e HPC.',
        ],
        tip: '"Banco em memória ou análise em tempo real" -> **memory optimized** (R, X). "Processamento em lote, transcodificação, servidores de jogos" -> **compute optimized** (C). "Muito I/O aleatório em grandes datasets locais" -> **storage optimized** (I, D).',
        table: {
          title: 'Categorias de instância',
          head: ['Categoria', 'Séries e usos'],
          rows: [
            {
              key: 'General purpose',
              cells: [
                'M, T, Mac. Equilíbrio de CPU, memória e rede: servidores web, repositórios de código, bancos pequenos.',
              ],
            },
            {
              key: 'Compute optimized',
              cells: [
                'C. Processadores rápidos: processamento em lote, transcodificação de mídia, servidores de jogos.',
              ],
            },
            {
              key: 'Memory optimized',
              cells: [
                'R, X, U, z. Grandes volumes em memória: bancos em memória, análise de dados, aplicações corporativas.',
              ],
            },
            {
              key: 'Storage optimized',
              cells: ['I, D, H. I/O aleatório de baixa latência e alto throughput sequencial em armazenamento local.'],
            },
            {
              key: 'Accelerated computing',
              cells: ['P, G, Inf, Trn, F. GPUs, AWS Inferentia, AWS Trainium e FPGAs para ML e gráficos.'],
            },
            { key: 'HPC optimized', cells: ['Hpc. Simulações em larga escala, deep learning e renderização.'] },
          ],
        },
      },
      {
        id: 'placement-groups',
        name: 'Placement groups',
        link: pt.docs('AWSEC2/latest/UserGuide/placement-strategies.html'),
        summary:
          'Placement groups definem como as instâncias ficam no hardware, trocando desempenho de rede por isolamento contra falhas correlacionadas.',
        points: [
          '**Cluster**: instâncias agrupadas em um segmento de alta largura de banda de uma única AZ. Até 10 Gbps por fluxo dentro do grupo (5 Gbps fora). Lance tudo em uma só requisição e com um só tipo de instância para evitar erro de capacidade.',
          '**Partition**: até 7 partições por AZ, cada uma em racks próprios com rede e energia separadas. O número de instâncias só é limitado pelos limites da conta, e aplicações que conhecem a topologia, como HDFS, HBase e Cassandra, enxergam a partição.',
          '**Spread**: cada instância em racks distintos, no máximo 7 instâncias em execução por AZ por grupo. O grupo pode abranger várias AZs. Para poucas instâncias críticas.',
          '**Capacidade**: uma On-Demand Capacity Reservation pode apontar para um cluster placement group. Capacity Reservations não reservam capacidade em grupos partition ou spread.',
        ],
        tip: '"Nós de HPC trocam dados o tempo todo" -> **cluster** (com EFA ou enhanced networking). "Cassandra ou HDFS cientes de rack" -> **partition**. "Poucas instâncias críticas não podem falhar juntas" -> **spread**.',
        table: {
          title: 'Estratégias de placement',
          head: ['Estratégia', 'Disposição e limites'],
          rows: [
            {
              key: 'Cluster',
              cells: [
                'Uma AZ, um segmento de rede de alta largura de banda. Menor latência e maior throughput. Pode abranger VPCs pareadas.',
              ],
            },
            {
              key: 'Partition',
              cells: [
                'Grupos de racks, até 7 partições por AZ, pode abranger AZs. Cargas grandes, distribuídas e replicadas.',
              ],
            },
            {
              key: 'Spread',
              cells: [
                'Uma instância por rack, até 7 em execução por AZ, pode abranger AZs. Pequenos conjuntos críticos.',
              ],
            },
          ],
        },
      },
      {
        id: 'enhanced-networking',
        name: 'Enhanced networking',
        fullName: 'ENA and Elastic Fabric Adapter',
        link: pt.docs('AWSEC2/latest/UserGuide/enhanced-networking.html'),
        summary:
          'O desempenho de rede depende do tipo de instância e do dispositivo de rede. As duas opções abaixo não têm custo adicional.',
        points: [
          '**ENA** (Elastic Network Adapter): enhanced networking com SR-IOV para mais largura de banda, mais pacotes por segundo e latência menor e consistente. Toda instância baseada em Nitro usa, com até 100 Gbps.',
          '**EFA** (Elastic Fabric Adapter): adiciona OS-bypass via Libfabric e o protocolo SRD para tráfego MPI (HPC) e NCCL (machine learning), com latência menor e mais estável que TCP.',
          '**Limites do EFA**: o tráfego EFA não cruza AZs nem VPCs e não é roteável. Só em tipos de instância suportados e não funciona no AWS Outposts.',
          '**Escolha da instância**: a opção `n` indica otimizada para rede e EBS. Entre duas instâncias, a mais lenta limita o throughput.',
        ],
        tip: '"HPC fortemente acoplado ou treino distribuído de ML com MPI ou NCCL" -> **EFA** em um **cluster placement group**. "Mais PPS e menos latência para uma camada de aplicação comum" -> enhanced networking com **ENA**, não EFA.',
      },
      {
        id: 'auto-scaling',
        name: 'Métricas de escala',
        fullName: 'Amazon EC2 Auto Scaling',
        link: pt.docs('autoscaling/ec2/userguide/as-scale-based-on-demand.html'),
        summary:
          'O Auto Scaling move a capacidade desejada entre o mínimo e o máximo. A política e a métrica definem a rapidez e a precisão com que ele acompanha a carga.',
        points: [
          '**Target tracking** (recomendado): mantém uma métrica em um alvo, como um termostato. As métricas predefinidas são `ASGAverageCPUUtilization`, `ASGAverageNetworkIn`, `ASGAverageNetworkOut` e `ALBRequestCountPerTarget`.',
          '**Métrica certa**: ela precisa variar na proporção inversa da capacidade. `RequestCount` bruto, latência e o `ApproximateNumberOfMessagesVisible` do SQS não funcionam. Para filas, use **backlog por instância**.',
          '**Step e simple scaling**: limites de alarme do CloudWatch com ajustes proporcionais ao tamanho da violação, ou um único ajuste seguido de cooldown.',
          '**Preditiva e agendada**: a escala preditiva usa até 14 dias de histórico (mínimo de 24 horas) para prever 48 horas e lançar capacidade antes de picos diários ou semanais. Ações agendadas mudam a capacidade em horários definidos, uma vez ou por cron.',
          '**Tempo de reação**: ative o monitoramento detalhado do EC2 (métricas de 1 minuto em vez de 5) e defina um warmup para que instâncias novas não distorçam a média.',
          '**AWS Auto Scaling**: um só lugar para montar scaling plans de grupos do EC2 Auto Scaling, Spot Fleets, tarefas ECS, tabelas e índices do DynamoDB e Aurora Replicas.',
        ],
        tip: '"Workers que consomem uma fila SQS ficam para trás" -> target tracking sobre **backlog por instância**. "A carga sobe todo dia útil às 9h e as instâncias demoram a subir" -> escala **preditiva** ou **agendada**. "Manter a CPU perto de 50%" -> **target tracking**.',
      },
      {
        id: 'hibernation',
        name: 'Hibernação',
        fullName: 'EC2 instance hibernation',
        link: pt.docs('AWSEC2/latest/UserGuide/Hibernate.html'),
        summary:
          'A hibernação grava a RAM no volume raiz EBS e retoma os mesmos processos no start, evitando um boot longo ou o aquecimento de cache.',
        points: [
          '**Pré-requisitos**: habilitada só no launch, com volume raiz EBS criptografado e grande o bastante para a RAM, AMI e família suportadas. RAM abaixo de 150 GiB no Linux e até 16 GiB no Windows.',
          '**Ao retomar**: mesmo ID de instância, IPs privados e Elastic IPs. Um novo IPv4 público é atribuído e os dados do instance store se perdem.',
          '**Limites**: nada pode ser alterado durante a hibernação, no máximo 60 dias hibernada, e instâncias em grupo de Auto Scaling ou usadas pelo ECS não hibernam.',
          '**Cobrança**: sem cobrança de uso da instância enquanto parada. Você paga os volumes EBS, incluindo a RAM salva, e os Elastic IPs associados.',
        ],
        tip: '"A aplicação demora demais para reconstruir o estado em memória após reiniciar" -> **hibernar** em vez de parar. Se a instância está em um **grupo de Auto Scaling**, hibernação não é opção.',
      },
      {
        id: 'batch-emr',
        name: 'Batch e EMR',
        fullName: 'AWS Batch and Amazon EMR',
        link: pt.aws('batch/'),
        summary:
          'Motores gerenciados para cargas feitas de jobs, não de servidores: AWS Batch para jobs em contêiner, Amazon EMR para frameworks de big data.',
        points: [
          '**AWS Batch**: enfileira jobs em contêiner e provisiona a computação necessária em ECS, EKS, Fargate e instâncias On-Demand ou Spot, escalando com a fila. Sem custo adicional além dos recursos usados.',
          '**Onde o Batch cabe**: treino de ML, simulações, genômica, renderização, transcodificação e análise financeira, inclusive jobs mais longos que os 15 minutos do Lambda.',
          '**Amazon EMR**: Apache Spark, Hive, Trino, Flink e outros frameworks gerenciados, em clusters EC2, no EKS ou como EMR Serverless.',
          '**Nós do EMR**: primary (coordena), core (executa tarefas e guarda o HDFS) e task, opcional (só executa tarefas). Nós task não guardam dados do HDFS, o que os torna o lugar natural para Spot Instances.',
          '**Clusters transitórios**: mantenha entrada e saída no S3 e deixe o cluster terminar após o último step.',
        ],
        tip: '"Milhares de jobs em contêiner, sem scheduler para operar" -> **AWS Batch**. "Processamento Spark ou Hive em escala de petabytes" -> **Amazon EMR** (EMR Serverless para não gerenciar cluster). Job com mais de 15 minutos descarta o **Lambda**.',
      },
      {
        id: 'edge-compute',
        name: 'Computação perto do usuário',
        fullName: 'Outposts, Local Zones and Wavelength',
        link: pt.aws('outposts/'),
        summary:
          'Quando milissegundos ou a localização do dado importam, a infraestrutura AWS roda fora da Região, com a Região pai mantendo as mesmas APIs e ferramentas.',
        points: [
          '**AWS Outposts**: racks de 42U (até 96) ou servidores de 1U e 2U gerenciados pela AWS na sua instalação. Para latência de um dígito de milissegundo até sistemas locais, processamento local e migrações com dependências locais.',
          '**Local Zones**: computação, armazenamento, banco e rede da AWS em grandes regiões metropolitanas, estendendo uma Região. Para jogos em tempo real, transmissão ao vivo, AR/VR e estações de trabalho virtuais perto do usuário.',
          '**Wavelength**: computação e armazenamento da AWS na borda das redes de operadoras de telecomunicações, acessados por um carrier gateway. Para baixa latência a dispositivos móveis em 5G.',
          '**Extensão da VPC**: uma VPC abrange Availability Zones, Local Zones e Wavelength Zones por meio de subnets criadas em cada zona.',
          '**Residência de dados**: os três mantêm o dado dentro de um país, estado ou local escolhido para cumprir exigências regulatórias.',
        ],
        tip: '"Baixa latência até sistemas que precisam ficar no nosso data center" -> **Outposts**. "Baixa latência para usuários em uma cidade longe de qualquer Região" -> **Local Zones**. "App móvel em rede 5G de operadora" -> **Wavelength**.',
      },
      {
        id: 'elastic-beanstalk',
        name: 'Elastic Beanstalk',
        fullName: 'AWS Elastic Beanstalk',
        link: pt.aws('elasticbeanstalk/'),
        summary:
          'Você envia o código e o Elastic Beanstalk provisiona o ambiente, o balanceamento de carga, o monitoramento de saúde e a escala. Sem custo além dos recursos.',
        points: [
          '**Plataformas**: Go, Java, .NET, Node.js, PHP, Python, Ruby e contêineres Docker.',
          '**Modos**: Standard roda direto no EC2 e suporta Windows. Cluster roda no Amazon EKS, com deploys e escala mais rápidos.',
          '**Worker environment**: uma fila SQS gerenciada mais um daemon que faz POST de cada mensagem para a aplicação. Tira tarefas longas da camada web e executa jobs periódicos do `cron.yaml`.',
          '**Controle**: os recursos são criados na sua conta, então você mantém acesso às instâncias e à configuração.',
        ],
        tip: '"Desenvolvedores querem publicar um app web rápido sem gerenciar infraestrutura" -> **Elastic Beanstalk**. "Tarefas longas em segundo plano deixam a camada web lenta" -> um **worker environment** com SQS.',
      },
    ],
  },
  {
    slug: 'serverless-containers',
    group: 'performing',
    icon: 'box',
    title: 'Serverless e contêineres',
    summary:
      'Memória, limites e concorrência do Lambda, ECS ou EKS, Fargate ou EC2, ECR e contêineres híbridos, e quando usar cada um.',
    lede: 'Tecnologias serverless e orquestração de contêineres fazem parte da tarefa 3.2 de **Design High-Performing Architectures**, 24% do conteúdo pontuado: quem gerencia os servidores, quão rápido escala e quanto custa.',
    sections: [
      {
        id: 'lambda',
        name: 'Lambda',
        fullName: 'AWS Lambda',
        link: pt.docs('lambda/latest/dg/gettingstarted-limits.html'),
        summary:
          'Executa código em resposta a eventos, sem servidores para gerenciar. Feito para tarefas curtas que não guardam estado entre invocações.',
        points: [
          '**Memória e CPU**: de 128 MB a 10.240 MB, em passos de 1 MB. A CPU é alocada na proporção da memória, e 1.769 MB equivalem a 1 vCPU. Mais memória é a principal alavanca para funções limitadas por CPU ou rede.',
          '**Timeout**: até 900 segundos (15 minutos) por invocação.',
          '**Payloads**: 6 MB para requisição e resposta síncronas, 1 MB para eventos assíncronos. Variáveis de ambiente somam até 4 KB.',
          '**Empacotamento**: .zip de até 50 MB compactado e 250 MB descompactado com layers, ou imagem de contêiner de até 10 GB. `/tmp` de 512 MB a 10.240 MB.',
          '**Layers**: até 5 por função, extraídas em `/opt`, para compartilhar bibliotecas entre funções. Só para funções .zip, não para imagens de contêiner.',
          '**Ajuste**: o AWS Lambda Power Tuning e o AWS Compute Optimizer ajudam a escolher a memória.',
        ],
        tip: '"Função limitada por CPU está lenta" -> **aumente a memória** (a CPU acompanha). "O processamento leva 40 minutos" -> não é Lambda, use **ECS no Fargate** ou **AWS Batch**. "A mesma biblioteca em muitas funções" -> **layers**.',
      },
      {
        id: 'lambda-concurrency',
        name: 'Concorrência',
        fullName: 'Lambda concurrency',
        link: pt.docs('lambda/latest/dg/lambda-concurrency.html'),
        summary:
          'Concorrência é a média de requisições por segundo vezes a duração média. As funções de uma Região dividem 1.000 execuções simultâneas por padrão, uma cota que pode ser aumentada.',
        points: [
          '**Reserved concurrency**: uma fatia do pool que é ao mesmo tempo o mínimo garantido e o máximo da função. Protege funções críticas ou limita uma que sobrecarregaria um recurso a jusante. Sem custo.',
          '**Provisioned concurrency**: ambientes de execução pré-inicializados que respondem sem cold start. Tem custo adicional e pode seguir agenda ou utilização via Application Auto Scaling.',
          '**Limites**: cada função escala até 1.000 ambientes de execução a cada 10 segundos. O Lambda mantém 100 unidades sem reserva, então só 900 das 1.000 padrão podem ser reservadas. As requisições por segundo ficam limitadas a 10 vezes a concorrência.',
          '**SnapStart**: tira um snapshot do ambiente inicializado ao publicar uma versão e retoma a partir dele, com inicialização que pode ficar abaixo de 1 segundo. Java 11+, Python 3.12+ e .NET 8+. Gratuito no Java, com cobrança de cache e restauração nos demais.',
          '**Limites do SnapStart**: só em versões publicadas e sem combinar com provisioned concurrency, EFS ou `/tmp` acima de 512 MB.',
        ],
        tip: '"Cold start inaceitável em uma API sensível a latência" -> **provisioned concurrency** (ou **SnapStart** para Java, Python, .NET). "Uma função derruba o banco de dados" -> **reserved concurrency** como teto.',
      },
      {
        id: 'event-sources',
        name: 'Fontes de eventos',
        link: pt.docs('lambda/latest/dg/invocation-eventsourcemapping.html'),
        summary:
          'Os serviços ou empurram eventos para o Lambda por triggers, ou o Lambda os consulta por um event source mapping que lê em lotes.',
        points: [
          '**Triggers (push)**: S3, SNS, API Gateway e outros invocam a função assim que o evento acontece. O trigger é configurado e guardado no serviço de origem.',
          '**Event source mappings (poll)**: pollers do Lambda leem SQS, Kinesis, DynamoDB, Amazon MSK, Kafka autogerenciado, Amazon MQ e DocumentDB e invocam a função com lotes de registros.',
          '**Lotes**: um lote fecha ao atingir o batch size, a batching window (0 a 300 segundos) ou 6 MB de payload. Lotes maiores diluem o custo de cada invocação e aumentam o throughput.',
          '**Pelo menos uma vez**: mappings podem processar um registro mais de uma vez, então o handler precisa ser idempotente. Em erro, lotes de stream são reprocessados e o shard pausa para manter a ordem.',
          '**Provisioned mode**: pollers dedicados com mínimo e máximo para mappings de SQS, Amazon MSK e Kafka, quando a latência precisa ser constante. Tem custo adicional.',
        ],
        tip: '"Processar mensagens SQS com Lambda em lotes" -> **event source mapping**. "Rodar código quando um objeto chega ao S3" -> trigger de **S3 event notification**. "Duplicatas estragaram o resultado" -> torne o handler **idempotente**.',
      },
      {
        id: 'ecs-eks',
        name: 'ECS ou EKS',
        fullName: 'Amazon ECS and Amazon EKS',
        link: pt.aws('containers/'),
        summary:
          'Os dois orquestram contêineres em EC2, Fargate ou no ambiente local. A escolha depende de você querer ou não Kubernetes.',
        points: [
          '**Amazon ECS**: orquestrador nativo da AWS, sem control plane para operar. A task definition é a planta, a task a executa e o service mantém o número desejado de tasks rodando.',
          '**Amazon EKS**: control plane Kubernetes gerenciado e certificado como conformante. Reaproveita manifests, ferramentas e conhecimento de Kubernetes e mantém as cargas portáveis.',
          '**EKS Auto Mode**: a AWS também gerencia os nós, incluindo provisionamento, escolha de instância, escala e patches do sistema operacional.',
          '**Escala**: o Service Auto Scaling do ECS muda o número de tasks, e o Cluster Auto Scaling muda as instâncias EC2 registradas no cluster.',
          '**Custo**: a orquestração do ECS não tem cobrança adicional. O EKS cobra por cluster, além da computação.',
        ],
        tip: '"Time já usa Kubernetes e quer um control plane gerenciado" -> **EKS**. "Orquestração de contêineres nativa da AWS com o menor esforço" -> **ECS**, em geral no Fargate.',
        table: {
          title: 'ECS ou EKS',
          head: ['Critério', 'ECS e EKS'],
          rows: [
            { key: 'API', cells: ['**ECS**: conceitos nativos da AWS. **EKS**: Kubernetes padrão.'] },
            {
              key: 'Control plane',
              cells: [
                '**ECS**: nada para operar ou atualizar. **EKS**: gerenciado pela AWS, mas você acompanha as versões do Kubernetes.',
              ],
            },
            {
              key: 'Capacidade',
              cells: ['**Ambos**: EC2, Fargate e opções locais (ECS Anywhere, EKS Anywhere, EKS Hybrid Nodes).'],
            },
            {
              key: 'Melhor para',
              cells: [
                '**ECS**: menor esforço operacional na AWS. **EKS**: conhecimento, ferramentas ou portabilidade de Kubernetes.',
              ],
            },
          ],
        },
      },
      {
        id: 'fargate',
        name: 'Fargate ou EC2',
        fullName: 'AWS Fargate',
        link: pt.aws('fargate/'),
        summary:
          'A capacidade por baixo do ECS ou do EKS. O Fargate roda cada task sem servidores para gerenciar, e o launch type EC2 roda tasks em instâncias que você gerencia.',
        points: [
          '**Fargate**: você define CPU e memória por task, e cada task tem seu próprio limite de isolamento, sem compartilhar kernel, CPU, memória ou interface de rede. Cobrança por segundo de vCPU, memória e armazenamento, com mínimo de 1 minuto no Linux.',
          '**Tamanhos de task**: de 0,25 vCPU com 512 MiB até 32 vCPU com 244 GB no Linux. 20 GB de armazenamento efêmero estão incluídos.',
          '**Rede**: sempre no modo `awsvpc`, com uma interface de rede por task, então os target groups do load balancer usam o target type `ip`.',
          '**Fargate Spot**: até 70% de desconto para tasks ECS que toleram interrupção, com aviso de 2 minutos. Só Linux.',
          '**Launch type EC2**: você gerencia instâncias, AMIs e capacidade do cluster e, em troca, tem GPUs, contêineres privilegiados e qualquer tipo de instância, nada disso suportado no Fargate.',
        ],
        tip: '"Rodar contêineres sem gerenciar nem aplicar patches em servidores" -> **Fargate**. "Contêineres precisam de GPU ou modo privilegiado" -> **launch type EC2**. "Jobs em contêiner baratos e interrompíveis" -> **Fargate Spot**.',
        table: {
          title: 'Capacidade Fargate ou EC2',
          head: ['Aspecto', 'Fargate e EC2'],
          rows: [
            {
              key: 'Servidores',
              cells: ['**Fargate**: nenhum para gerenciar. **EC2**: você escolhe, corrige e escala as instâncias.'],
            },
            {
              key: 'Cobrança',
              cells: ['**Fargate**: vCPU, memória e armazenamento por task. **EC2**: por instância, usada ou não.'],
            },
            {
              key: 'Isolamento',
              cells: ['**Fargate**: um limite de isolamento por task. **EC2**: as tasks dividem a instância.'],
            },
            {
              key: 'Recursos',
              cells: [
                '**Fargate**: sem GPU, sem modo privilegiado. **EC2**: GPUs, modo privilegiado, qualquer tipo de instância.',
              ],
            },
          ],
        },
      },
      {
        id: 'ecr',
        name: 'ECR e migração',
        fullName: 'Amazon ECR',
        link: pt.aws('ecr/'),
        summary:
          'O Amazon ECR guarda as imagens que ECS, EKS e Lambda baixam. Levar uma aplicação para contêineres começa por gerar uma imagem e enviá-la ao ECR.',
        points: [
          '**Registry**: repositórios privados com permissões baseadas em recurso no IAM, mais o ECR Public. Imagens Docker, imagens OCI e artefatos OCI.',
          '**Image scanning**: scan on push para encontrar vulnerabilidades de software em cada imagem nova.',
          '**Lifecycle policies**: regras que limpam imagens sem uso, testáveis antes de valerem.',
          '**Replicação e cache**: replicação entre Regiões e entre contas, e regras de pull through cache que mantêm imagens de registries externos no seu registry privado.',
          '**Conteinerização**: empacote a aplicação e suas dependências em uma imagem, envie ao ECR, descreva-a em uma task definition ou pod spec e rode no Fargate ou no EC2. A mesma imagem roda igual em todo ambiente.',
          '**Pull privado**: tasks em subnets privadas baixam imagens do ECR por um interface VPC endpoint, sem NAT gateway.',
        ],
        tip: '"Guardar e escanear imagens e copiá-las para uma Região de DR" -> **ECR** com replicação. "Tasks Fargate em subnets privadas não conseguem baixar imagens" -> adicione um **interface endpoint do ECR** ou um NAT gateway.',
      },
      {
        id: 'hybrid-containers',
        name: 'Contêineres locais',
        fullName: 'ECS Anywhere and EKS Anywhere',
        link: pt.docs('AmazonECS/latest/developerguide/ecs-anywhere.html'),
        summary:
          'Os mesmos orquestradores podem gerenciar servidores no seu data center, para dados que precisam ficar no local ou para uma migração gradual.',
        points: [
          '**ECS Anywhere**: registra servidores ou VMs locais como instâncias externas de um cluster ECS (launch type `EXTERNAL`) por meio do SSM Agent. Cobrança por instância registrada por hora.',
          '**Limites do ECS Anywhere**: sem balanceamento de carga, sem service discovery, sem modo `awsvpc` e sem volumes EFS. Melhor para cargas que geram tráfego de saída ou processam dados.',
          '**EKS Anywhere**: cria e opera clusters Kubernetes na sua infraestrutura (VMware vSphere, bare metal, Nutanix, AWS Snow), inclusive sem conexão com a internet. Open source e gratuito, com Enterprise Subscriptions opcionais.',
          '**EKS Distro**: a distribuição Kubernetes usada pelo Amazon EKS e a base do EKS Anywhere.',
          '**EKS Hybrid Nodes**: servidores locais e de borda que entram como nós de um cluster Amazon EKS.',
        ],
        tip: '"Rodar contêineres no local, gerenciados pelo console do ECS" -> **ECS Anywhere**. "Kubernetes em um data center desconectado" -> **EKS Anywhere**. "Serviço local precisa receber tráfego por load balancer" -> ECS Anywhere não serve bem.',
      },
      {
        id: 'choosing',
        name: 'Escolhendo o modelo',
        fullName: 'Containers or serverless',
        link: pt.docs('decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html'),
        summary:
          'A maioria dos projetos mistura os dois. O que decide é o tempo de execução, o controle sobre o runtime, o formato do tráfego e o esforço operacional que o time aguenta.',
        points: [
          '**Lambda**: tráfego orientado a eventos ou imprevisível, tarefas abaixo de 15 minutos, pagamento por requisição e duração, sem sistema operacional ou runtime para gerenciar.',
          '**Fargate**: serviços ou jobs longos em contêiner sem servidores para gerenciar, com qualquer linguagem ou binário dentro da imagem.',
          '**ECS ou EKS no EC2**: GPUs, tipos de instância específicos, acesso privilegiado ou controle total dos hosts.',
          '**Desacoplamento**: coloque SQS, SNS ou EventBridge entre os componentes para que cada camada escale sozinha pela própria métrica.',
          '**AWS Serverless Application Repository**: publica e implanta aplicações serverless reutilizáveis, definidas em templates AWS SAM, compartilhadas publicamente ou com contas específicas. Sem custo além dos recursos implantados.',
        ],
        tip: '"Tráfego imprevisível, sem servidores, pagar só quando roda" -> **Lambda**. "Serviço em contêiner rodando 24/7 sem gerenciar hosts" -> **ECS no Fargate**. "Reaproveitar um app serverless publicado entre contas" -> **Serverless Application Repository**.',
      },
    ],
  },
]
