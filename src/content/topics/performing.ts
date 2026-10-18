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
