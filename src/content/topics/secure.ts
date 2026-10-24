import { en, pt } from '../links'
import type { Topic } from '../types'

export const enUS: readonly Topic[] = [
  {
    slug: 'identity-access',
    group: 'secure',
    icon: 'key',
    title: 'Identity and access management',
    summary:
      'IAM policies and how AWS evaluates them, STS roles, federation, IAM Identity Center, Cognito and Directory Service.',
    lede: 'Who can do what, on which resource, for people, workloads and app users. Part of **Domain 1: Design Secure Architectures**, 30% of the scored content.',
    sections: [
      {
        id: 'iam-basics',
        name: 'IAM building blocks',
        fullName: 'AWS Identity and Access Management',
        link: en.aws('iam/'),
        summary:
          'IAM authenticates principals and authorizes each request with JSON policies. Prefer roles with temporary credentials over users with long-term keys.',
        points: [
          '**Users**: long-term credentials (a password and up to 2 access keys). Use them only when a role cannot work, such as some third-party tools.',
          '**Groups**: attach policies to many users at once. A user can belong to up to 10 groups, and groups cannot contain other groups.',
          '**Roles**: no long-term credentials. Assumed by users, AWS services (EC2 instance profile, Lambda execution role) or federated identities to get temporary credentials.',
          '**Policies**: identity-based policies (managed or inline) attach to principals. Resource-based policies (bucket policy, queue policy, KMS key policy) name a `Principal` and enable cross-account access.',
          '**Least privilege**: start from AWS managed policies, then narrow with customer managed policies, conditions and IAM Access Analyzer policy generation from CloudTrail activity.',
        ],
        tip: 'An application on EC2 needs S3 access: **attach an IAM role through an instance profile**. Storing access keys on the instance or in the code is always the wrong answer.',
      },
      {
        id: 'policy-evaluation',
        name: 'Policy evaluation',
        link: en.docs('IAM/latest/UserGuide/reference_policies_evaluation-logic.html'),
        summary:
          'Every request starts as an implicit deny. An explicit deny in any policy wins, and every guardrail in the path must also allow the action.',
        points: [
          '**Explicit deny**: a `Deny` in any applicable policy overrides every `Allow`.',
          '**Same account**: permissions are the union of identity-based and resource-based policies, so an allow in either one is enough.',
          '**Cross-account**: the principal needs an `Allow` in its identity policy **and** an `Allow` in the resource-based policy of the other account.',
          '**Permissions boundary**: a managed policy that sets the maximum permissions of a user or role. Effective permissions are the intersection with the identity policies, and the boundary grants nothing by itself.',
          '**Guardrails**: SCPs, RCPs and session policies only limit. An action must be allowed by every one of them that applies.',
        ],
        tip: '"Let developers create roles without escalating their own privileges": **permissions boundary** required on the roles they create. Limiting a whole account or OU is an **SCP**, not a boundary.',
        table: {
          title: 'Policy types at a glance',
          head: ['Policy type', 'What it does'],
          rows: [
            { key: 'Identity-based', cells: ['Grants permissions to a user, group or role'] },
            {
              key: 'Resource-based',
              cells: ['Grants access to the resource, including to principals of other accounts'],
            },
            { key: 'Permissions boundary', cells: ['Caps what identity policies can grant to a user or role'] },
            { key: 'SCP', cells: ['Caps the permissions of principals in member accounts'] },
            { key: 'RCP', cells: ['Caps the permissions on resources in member accounts'] },
            { key: 'Session policy', cells: ['Caps a temporary session created through STS'] },
          ],
        },
      },
      {
        id: 'roles-sts',
        name: 'Roles and STS',
        fullName: 'AWS Security Token Service',
        link: en.docs('IAM/latest/UserGuide/id_roles_manage-assume.html'),
        summary:
          'STS issues temporary credentials when a principal assumes a role. It is the mechanism behind instance profiles, cross-account access and federation.',
        points: [
          '**AssumeRole**: sessions last from 15 minutes up to the maximum session duration of the role, which you set between 1 and 12 hours. The default is 1 hour.',
          '**Role chaining**: using one role to assume another limits the session to 1 hour.',
          '**Trust policy**: the resource-based policy of the role that says who can assume it with `sts:AssumeRole`. The permissions policy says what the session can do.',
          '**Role vs resource policy**: a principal that switches to a role gives up its original permissions. Access through a resource-based policy keeps them, which helps when copying data between accounts.',
          '**External ID**: a condition in the trust policy when a third party assumes a role in your account. Its purpose is to prevent the confused deputy problem.',
          '**Federation APIs**: `AssumeRoleWithSAML` for SAML 2.0 IdPs and `AssumeRoleWithWebIdentity` for OIDC tokens.',
        ],
        tip: '"Give a partner or another account access to resources": **cross-account IAM role**, with an **external ID** for third parties. Creating IAM users for them or sharing access keys is the distractor.',
      },
      {
        id: 'root-user',
        name: 'Root user',
        link: en.docs('IAM/latest/UserGuide/id_root-user.html'),
        summary:
          'The identity created with the account has unrestricted access. Protect it with MFA and use it only for the few tasks that require it.',
        points: [
          '**MFA**: AWS enforces MFA for the root user by default. Phishing-resistant MFA, such as passkeys and security keys, is recommended.',
          '**Daily work**: use an administrative user in IAM Identity Center, never the root user. Delete root access keys you do not need.',
          '**Root-only tasks**: close a standalone account, restore IAM permissions when the only administrator locked itself out, register as a seller in the Reserved Instance Marketplace, enable MFA delete on an S3 bucket.',
          '**Centralized root access**: in AWS Organizations you can remove root credentials from member accounts and run privileged tasks from the management account, such as unlocking a bucket policy that denies everyone.',
          '**SCPs apply**: an SCP restricts the root user of a member account, but never the management account.',
        ],
        tip: '"Secure the root user": **MFA, no access keys, use only for root-only tasks**. When asked which task needs the root user, look for **closing a standalone account** or **restoring a locked-out administrator**.',
      },
      {
        id: 'identity-center',
        name: 'IAM Identity Center',
        fullName: 'AWS IAM Identity Center',
        link: en.aws('iam/identity-center/'),
        summary:
          'Workforce single sign-on to many AWS accounts and applications from one place. It is the recommended way to give people access in a multi-account organization.',
        points: [
          '**Identity source**: the Identity Center directory, Active Directory (AWS Managed Microsoft AD or AD Connector) or an external IdP over SAML 2.0.',
          '**Permission sets**: define the permissions of a job function once, then provision them in many accounts and assign them to users and groups.',
          '**Organization instance**: deployed in the management account, it is the only instance type that manages access to AWS accounts. Account instances serve isolated application deployments.',
          '**AWS access portal**: one sign-in page that lists every account and application assigned to the user, with short-term credentials for the console and CLI.',
          '**Trusted identity propagation**: AWS managed applications such as Amazon Quick pass the user identity to services like Amazon Redshift for authorization and auditing.',
        ],
        tip: '"Employees need single sign-on to many accounts with their corporate credentials": **IAM Identity Center** connected to the corporate IdP. Cognito serves the customers of your app, not your workforce.',
      },
      {
        id: 'federation',
        name: 'Federation',
        link: en.docs('IAM/latest/UserGuide/id_roles_providers.html'),
        summary:
          'Users keep their identity in an external IdP and receive temporary AWS credentials, so no IAM users or long-term keys are handed out.',
        points: [
          '**SAML 2.0**: a corporate IdP such as Active Directory Federation Services authenticates the user, and STS `AssumeRoleWithSAML` returns credentials for an IAM role.',
          '**Directory groups to roles**: the IdP assertion maps users or groups of the directory to IAM roles, so access follows group membership.',
          '**OIDC**: tokens from providers such as GitHub Actions are exchanged through `AssumeRoleWithWebIdentity`, so pipelines run without stored keys.',
          '**IAM or Identity Center**: federation directly in IAM fits a single standalone account or machine users. For many accounts, federate once into IAM Identity Center.',
          '**IAM Roles Anywhere**: workloads outside AWS get temporary credentials with an X.509 certificate from your PKI.',
        ],
        tip: '"On-premises Active Directory users must reach the AWS console without new credentials": **SAML 2.0 federation** or IAM Identity Center with AD. "A server or pipeline outside AWS needs credentials": **OIDC federation or IAM Roles Anywhere**, not access keys.',
      },
      {
        id: 'cognito',
        name: 'Amazon Cognito',
        link: en.aws('cognito/'),
        summary:
          'Customer identity for web and mobile apps. User pools answer who the user is, identity pools answer which AWS resources the user may reach.',
        points: [
          '**User pools**: a user directory and OIDC provider that issues JWTs (ID and access tokens). Supports sign-up, MFA, social sign-in and enterprise SAML or OIDC IdPs.',
          '**Identity pools**: exchange a trusted token for temporary, limited-privilege AWS credentials from STS. They can also give guests unauthenticated access.',
          '**Together**: sign in with a user pool, then trade the user pool token at an identity pool for credentials to call S3 or DynamoDB directly.',
          '**API protection**: API Gateway can validate user pool tokens before invoking the backend, and AWS WAF can protect the user pool.',
          '**Access control**: identity pools pick an IAM role per user (role-based) or map claims to session tags (attribute-based).',
        ],
        tip: '"Mobile app users upload straight to their own S3 prefix": **Cognito identity pool** issuing temporary credentials. "Sign-up and sign-in with Google for the app": **user pool**.',
        table: {
          title: 'User pools vs identity pools',
          head: ['Need', 'Use'],
          rows: [
            { key: 'Authenticate', cells: ['**User pool**: directory, sign-in and JWTs for your app or API'] },
            { key: 'Call AWS services', cells: ['**Identity pool**: temporary AWS credentials from STS'] },
            { key: 'Guest access', cells: ['**Identity pool**: unauthenticated identities with a limited role'] },
            {
              key: 'Social or SAML sign-in',
              cells: ['**User pool** brokers the sign-in', '**Identity pool** can also trust the IdP directly'],
            },
          ],
        },
      },
      {
        id: 'directory-service',
        name: 'Directory Service',
        fullName: 'AWS Directory Service',
        link: en.aws('directoryservice/'),
        summary:
          'Managed ways to use Microsoft Active Directory with AWS, from a full managed AD to a proxy that keeps the directory on premises.',
        points: [
          '**AWS Managed Microsoft AD**: a real Windows Server AD run by AWS. Supports trusts with on-premises AD, MFA, schema extensions and Amazon RDS for SQL Server.',
          '**Editions**: Standard targets up to about 30,000 directory objects, Enterprise up to about 500,000.',
          '**AD Connector**: a proxy that forwards sign-in requests to your on-premises domain controllers, with no directory synchronization. It can use your RADIUS MFA.',
          '**Simple AD**: a low-cost AD-compatible directory powered by Samba 4. No trusts, no MFA and no RDS for SQL Server.',
        ],
        tip: '"Keep users in the on-premises AD and let them sign in to WorkSpaces": **AD Connector**. "Trust with on-premises AD" or "RDS for SQL Server with Windows authentication": **AWS Managed Microsoft AD**.',
      },
    ],
  },
  {
    slug: 'multi-account',
    group: 'secure',
    icon: 'users',
    title: 'Multi-account governance',
    summary:
      'AWS Organizations, SCPs and RCPs, Control Tower landing zones, AWS RAM sharing and delegated administration at scale.',
    lede: 'Separate workloads into accounts and govern them centrally with guardrails. Part of **Domain 1: Design Secure Architectures**, 30% of the scored content.',
    sections: [
      {
        id: 'organizations',
        name: 'AWS Organizations',
        link: en.aws('organizations/'),
        summary:
          'Groups accounts into a hierarchy under one management account, with central policies, consolidated billing and service integrations.',
        points: [
          '**Management account**: creates the organization, invites and removes accounts, attaches policies and pays every charge. Keep workloads out of it, because SCPs do not restrict it.',
          '**OUs**: group accounts by workload or environment. The hierarchy can be 5 levels deep below the root, and policies are inherited downward.',
          '**Feature sets**: **all features** (recommended, required for SCPs, RCPs and declarative policies) or **consolidated billing** only.',
          '**Consolidated billing**: one bill, combined usage for volume discounts, shared Reserved Instance discounts and Savings Plans, at no extra fee.',
          '**Membership**: an account belongs to only one organization at a time.',
        ],
        tip: '"Isolate environments and apply controls per group of accounts": **separate accounts in OUs** with policies attached to each OU. IAM alone inside one account gives no central guardrail.',
      },
      {
        id: 'scp-rcp',
        name: 'SCPs and RCPs',
        fullName: 'Service control policies and resource control policies',
        link: en.docs('organizations/latest/userguide/orgs_manage_policies_authorization_policies.html'),
        summary:
          'Authorization policies set the maximum available permissions in member accounts. SCPs cap principals, RCPs cap resources, and neither grants anything.',
        points: [
          '**SCP**: limits IAM users and roles in member accounts, including the member root user. It does not affect the management account or service-linked roles.',
          '**FullAWSAccess**: attached by default. A deny list keeps it and adds `Deny` statements. Removing it without a replacement makes every action fail.',
          '**Inheritance**: an account has only what every parent above it allows, from the root down to the account.',
          '**RCP**: limits what anyone, including principals outside the organization, can do on resources of supported services such as S3, KMS, SQS, Secrets Manager, DynamoDB and STS.',
          '**Data perimeter**: an RCP keeps resources reachable only by identities of your organization, and an SCP limits services or Regions that your principals can use.',
        ],
        tip: '"Stop every account in the OU from disabling CloudTrail or using unapproved Regions, even administrators": **SCP**. "Block principals outside the organization from our S3 buckets in all accounts": **RCP**.',
        table: {
          title: 'SCP vs RCP',
          head: ['Aspect', 'SCP and RCP'],
          rows: [
            {
              key: 'Scope',
              cells: ['**SCP**: IAM users and roles in member accounts', '**RCP**: resources in member accounts'],
            },
            { key: 'Grants access', cells: ['Neither. Both are guardrails only'] },
            { key: 'Management account', cells: ['Not affected by either'] },
            {
              key: 'Attach limit',
              cells: ['**SCP**: 10 per root, OU or account', '**RCP**: 5 per root, OU or account'],
            },
            { key: 'Maximum size', cells: ['**SCP**: 10,240 characters', '**RCP**: 5,120 characters'] },
          ],
        },
      },
      {
        id: 'control-tower',
        name: 'AWS Control Tower',
        link: en.aws('controltower/'),
        summary:
          'Sets up and governs a multi-account landing zone that follows AWS best practices, orchestrating Organizations, IAM Identity Center and Service Catalog.',
        points: [
          '**Landing zone**: a well-architected multi-account environment. Earlier versions create a Security OU with the Log Archive and Audit accounts, and landing zone 4.0 lets you define your own structure.',
          '**Account Factory**: a configurable template that provisions new accounts with pre-approved settings and controls.',
          '**Preventive controls**: implemented with SCPs and RCPs, they block actions before they happen.',
          '**Detective controls**: implemented with AWS Config rules, they flag noncompliant resources.',
          '**Proactive controls**: implemented with CloudFormation hooks, they stop noncompliant resources before provisioning.',
          '**Guidance**: controls are mandatory (always on), strongly recommended or elective.',
        ],
        tip: '"Quickly set up a governed multi-account environment with guardrails and account vending": **Control Tower**. Assembling the same with Organizations by hand means more operational overhead.',
      },
      {
        id: 'ram',
        name: 'AWS RAM',
        fullName: 'AWS Resource Access Manager',
        link: en.aws('ram/'),
        summary:
          'Share resources you own with other accounts, OUs or the whole organization instead of duplicating them in every account.',
        points: [
          '**Shareable examples**: VPC subnets, transit gateways, Route 53 Resolver rules, prefix lists, License Manager configurations, Network Firewall policies, Aurora DB clusters and Private CA.',
          '**VPC sharing**: the owner shares subnets with participants in the same organization. Participants create their own resources there but cannot see or change resources of others.',
          '**Invitations**: once sharing with Organizations is enabled, accounts in the organization need no invitation. Accounts outside it must accept one.',
          '**Managed permissions**: define what consuming accounts can do with the shared resource. Their own IAM policies and SCPs still apply.',
          '**Cost**: AWS RAM itself has no charge. The shared resource is billed as usual.',
        ],
        tip: '"Many accounts must place workloads in a centrally managed network": **share subnets or a transit gateway with AWS RAM**. Recreating the resource in every account is the distractor.',
      },
      {
        id: 'delegated-admin',
        name: 'Delegated administration',
        link: en.docs('organizations/latest/userguide/orgs_integrate_delegated_admin.html'),
        summary:
          'Register a member account to administer an integrated service for the whole organization, keeping daily work out of the management account.',
        points: [
          '**Why**: SCPs do not restrict the management account, so security tooling should run from a dedicated member account.',
          '**Security services**: GuardDuty, Security Hub CSPM, Macie, Inspector, Detective, Firewall Manager, IAM Access Analyzer and AWS Config support a delegated administrator.',
          '**Trusted access**: lets a service act across all accounts, for example an organization trail in CloudTrail or StackSets with service-managed permissions.',
          '**Limits**: only the management account creates or invites accounts. A delegated administrator cannot.',
          '**Guardrails still apply**: a delegated administrator is a member account, so SCPs and RCPs affect it.',
        ],
        tip: '"A central security team must manage GuardDuty findings for all accounts without using the management account": **delegated administrator** for GuardDuty in the security account.',
      },
      {
        id: 'declarative-policies',
        name: 'Declarative policies',
        link: en.docs('organizations/latest/userguide/orgs_manage_policies.html'),
        summary:
          'Organization policies that configure services centrally instead of limiting permissions. Unlike SCPs, they also apply to the management account.',
        points: [
          '**Tag policies**: standardize tag keys, values and case. Enforcement blocks noncompliant tagging operations on chosen resource types, but untagged resources are not evaluated.',
          '**Tag compliance**: AWS Resource Groups reports noncompliant tags, and the management account sees every account.',
          '**Backup policies**: apply backup plans to resources across the accounts of the organization.',
          '**Amazon EC2 policies**: declare and enforce EC2 configurations at scale, kept in place even when the service adds new features or APIs.',
          '**AI services opt-out policies**: control data collection by AWS AI services for every account.',
        ],
        tip: '"Enforce a consistent CostCenter tag format across all accounts": **tag policy**. Remember that tag policies do not flag resources that have no tags at all.',
      },
    ],
  },
  {
    slug: 'network-security',
    group: 'secure',
    icon: 'lock',
    title: 'Network security',
    summary:
      'Subnets, security groups versus network ACLs, VPC endpoints, WAF, Shield, Network Firewall, Firewall Manager and encrypted hybrid links.',
    lede: 'Layered controls from the edge down to each instance. Part of **Domain 1: Design Secure Architectures**, 30% of the scored content.',
    sections: [
      {
        id: 'subnets',
        name: 'Public and private subnets',
        link: en.docs('vpc/latest/userguide/configure-subnets.html'),
        summary:
          'Routing defines the subnet type. Keep only load balancers and gateways public, and put application and data tiers in private subnets.',
        points: [
          '**Public subnet**: has a direct route to an internet gateway.',
          '**Private subnet**: no direct route to an internet gateway. It reaches the internet only through a NAT device.',
          '**Isolated subnet**: no route outside the VPC at all. A VPN-only subnet routes to a Site-to-Site VPN through a virtual private gateway.',
          '**Zonal NAT gateway**: lets private resources start outbound connections, never inbound. It sits in a public subnet with an Elastic IP, so create one per AZ. 5 Gbps that scales to 100 Gbps.',
          '**Regional NAT gateway**: expands across AZs automatically and needs no public subnet, but does not support private NAT.',
          '**IPv6**: an egress-only internet gateway gives outbound-only IPv6 access.',
        ],
        tip: '"Instances must download patches but must not be reachable from the internet": **private subnet with a route to a NAT gateway**. A NAT gateway takes no security group, so filter with instance security groups and NACLs.',
      },
      {
        id: 'sg-nacl',
        name: 'Security groups vs NACLs',
        link: en.docs('vpc/latest/userguide/infrastructure-security.html'),
        summary:
          'Security groups are the primary, stateful filter at the instance. Network ACLs are a stateless guard rail at the subnet that can also deny.',
        points: [
          '**Security groups**: allow rules only, all rules evaluated, return traffic allowed automatically. Rules can reference other security groups, ideal for tier-to-tier access.',
          '**Outbound default**: a security group comes with a default outbound rule that allows all traffic.',
          '**Network ACLs**: allow and deny rules numbered 1 to 32766, evaluated from the lowest number and stopped at the first match.',
          '**Stateless**: return traffic must be allowed explicitly, usually the ephemeral ports 1024-65535.',
          '**Defaults**: the default NACL allows all traffic. A new custom NACL denies everything through its final `*` rule until you add rules.',
          '**Block an IP**: only a NACL can deny a specific address range, because security groups have no deny rules.',
        ],
        tip: '"Block a malicious IP range now": **NACL deny rule** (or AWS WAF for HTTP). "Allow the app tier only from the web tier": **security group that references the web tier security group**.',
        table: {
          title: 'Security groups vs network ACLs',
          head: ['Characteristic', 'Security group and network ACL'],
          rows: [
            { key: 'Level', cells: ['**Security group**: instance', '**NACL**: subnet'] },
            { key: 'Rules', cells: ['**Security group**: allow only', '**NACL**: allow and deny'] },
            {
              key: 'Evaluation',
              cells: ['**Security group**: all rules', '**NACL**: ascending number order, first match wins'],
            },
            {
              key: 'Return traffic',
              cells: ['**Security group**: automatic (stateful)', '**NACL**: must be allowed (stateless)'],
            },
          ],
        },
      },
      {
        id: 'vpc-endpoints',
        name: 'VPC endpoints',
        link: en.docs('vpc/latest/privatelink/concepts.html'),
        summary:
          'Reach AWS services and endpoint services privately, without an internet gateway, a NAT device or public IPs.',
        points: [
          '**Gateway endpoint**: only for S3 and DynamoDB. A route table entry that targets the service prefix list, with no additional charge.',
          '**Interface endpoint**: AWS PrivateLink network interfaces with private IPs in your subnets, protected by security groups and billed.',
          '**Reachability**: only interface endpoints serve on premises over Direct Connect or VPN, and other Regions through peering or Transit Gateway.',
          '**Endpoint policy**: a resource policy on the endpoint that limits the principals and resources reachable through it. The default allows everything.',
          '**Bucket lock-down**: an S3 bucket policy with the `aws:sourceVpce` condition denies requests that do not come through your endpoint.',
          '**Gateway Load Balancer endpoint**: sends traffic to a fleet of inspection appliances.',
        ],
        tip: '"Private instances must reach S3 without NAT gateway data charges": **S3 gateway endpoint**. "On-premises servers on Direct Connect must reach S3 privately": **S3 interface endpoint**.',
        table: {
          title: 'Gateway vs interface endpoints for S3',
          head: ['Aspect', 'Gateway and interface'],
          rows: [
            {
              key: 'Addressing',
              cells: ['**Gateway**: S3 public IPs through a route', '**Interface**: private IPs of your VPC'],
            },
            { key: 'On premises', cells: ['**Gateway**: no', '**Interface**: yes, over Direct Connect or VPN'] },
            {
              key: 'Other Regions',
              cells: ['**Gateway**: no', '**Interface**: yes, through peering or Transit Gateway'],
            },
            { key: 'Cost', cells: ['**Gateway**: not billed', '**Interface**: billed'] },
          ],
        },
      },
      {
        id: 'systems-manager',
        name: 'Systems Manager',
        fullName: 'AWS Systems Manager',
        link: en.aws('systems-manager/'),
        summary:
          'Operates fleets of EC2 instances and on premises servers through the SSM Agent, with no SSH keys, bastion hosts or inbound ports.',
        points: [
          '**Session Manager**: shell access from the console or the CLI, controlled by IAM and logged to S3 or CloudWatch Logs. No inbound port is opened.',
          '**Requirements**: the SSM Agent, an instance profile with the `AmazonSSMManagedInstanceCore` policy and a path to the service, through a NAT gateway or VPC interface endpoints.',
          '**Run Command**: runs scripts across many instances at once, selected by tag.',
          '**Patch Manager**: applies patch baselines during maintenance windows.',
          '**Automation**: runbooks for common tasks, such as creating an AMI or restarting an instance.',
        ],
        tip: '"Reach instances in a private subnet without a bastion host or opening port 22": **Session Manager**. "Patch the whole fleet on a schedule": **Patch Manager**.',
      },
      {
        id: 'waf',
        name: 'AWS WAF',
        link: en.aws('waf/'),
        summary:
          'A layer 7 web application firewall that inspects HTTP(S) requests before they reach CloudFront, an ALB, API Gateway or another front door.',
        points: [
          '**Protected resources**: CloudFront distributions, Application Load Balancers, API Gateway REST APIs, AppSync GraphQL APIs, Cognito user pools, App Runner services, Verified Access instances and Amplify.',
          '**Threat vectors**: SQL injection and cross-site scripting (XSS) match statements, plus AWS Managed Rules rule groups.',
          '**Rate-based rules**: count requests per aggregation key and rate limit those that arrive too fast, a defense against HTTP floods.',
          '**Geo and IP**: geographic match and IP set match statements allow or block by country or address range.',
          '**Responses**: a matched request can be blocked with HTTP 403 or receive a custom response.',
        ],
        tip: '"Block SQL injection and XSS against the web app": **AWS WAF** on the ALB or CloudFront. Security groups and NACLs cannot inspect HTTP content, and WAF does not attach to a Network Load Balancer.',
      },
      {
        id: 'shield',
        name: 'AWS Shield',
        link: en.aws('shield/'),
        summary:
          'Managed DDoS protection. Standard is automatic for every customer at no cost, Advanced adds expert response and cost protection for critical apps.',
        points: [
          '**Shield Standard**: automatic and free, it defends against the most common network and transport layer (3 and 4) attacks such as SYN floods and UDP reflection.',
          '**Shield Advanced**: protects Elastic IPs, Elastic Load Balancing, CloudFront, Global Accelerator and Route 53, and adds layer 7 mitigation through AWS WAF.',
          '**Shield Response Team**: 24/7 access for customers on Business or Enterprise support plans.',
          '**Cost protection**: service credits for scaling charges caused by a DDoS attack.',
          '**Pricing**: $3,000 per month with a 1-year commitment, billed per payer account, including AWS WAF usage for protected resources up to a limit.',
          '**Health-based detection**: Route 53 health checks associated with protected resources detect attacks sooner.',
        ],
        tip: '"DDoS experts on call and no surprise bill after an attack": **Shield Advanced**. If the question only asks for basic DDoS protection at no cost, **Shield Standard** is already on.',
      },
      {
        id: 'network-firewall',
        name: 'AWS Network Firewall',
        link: en.aws('network-firewall/'),
        summary:
          'Managed stateful firewall and intrusion prevention for the VPC perimeter, for traffic through internet gateways, NAT gateways, VPN and Direct Connect.',
        points: [
          '**Rules**: stateless and stateful rule groups, Suricata compatible IPS rules, 5-tuple rules and domain filtering.',
          '**Deployment**: firewall endpoints in a dedicated firewall subnet in each AZ, with route tables steering traffic through them.',
          '**Use cases**: allow egress only to approved domains, deep packet inspection, north-south and east-west inspection.',
          '**TLS inspection**: decrypts and re-encrypts traffic with a certificate from ACM.',
          '**At scale**: Firewall Manager deploys firewalls across accounts, and firewall policies can be shared through AWS RAM.',
        ],
        tip: '"Filter outbound traffic of every VPC by domain name, with IPS signatures": **Network Firewall**. WAF only covers HTTP(S) at the application front door.',
      },
      {
        id: 'firewall-manager',
        name: 'Firewall Manager',
        fullName: 'AWS Firewall Manager',
        link: en.aws('firewall-manager/'),
        summary:
          'Central firewall policies for every account of an organization, applied automatically to new accounts and resources.',
        points: [
          '**Policy types**: AWS WAF, Shield Advanced, VPC security groups, network ACLs, Network Firewall and Route 53 Resolver DNS Firewall.',
          '**Automatic coverage**: new in-scope accounts and resources receive the protection as soon as they appear.',
          '**Scope**: all resources of a type, resources with specific tags, or chosen accounts.',
          '**Requirements**: works across an AWS Organizations organization. Charges come from the underlying services, such as AWS WAF and AWS Config.',
          '**Administrator**: a Firewall Manager administrator account, which can be a delegated member account.',
        ],
        tip: '"Every ALB in every account must always carry the corporate WAF rules, including future accounts": **Firewall Manager**. Configuring WAF account by account does not scale.',
      },
      {
        id: 'hybrid-encryption',
        name: 'Encrypted hybrid links',
        link: en.docs('directconnect/latest/UserGuide/encryption-in-transit.html'),
        summary:
          'Protect traffic between on premises and AWS. Site-to-Site VPN encrypts over the internet, while Direct Connect is private but not encrypted by default.',
        points: [
          '**Site-to-Site VPN**: IPsec tunnels to a virtual private gateway or a transit gateway. Each connection has 2 tunnels for high availability.',
          '**Tunnel bandwidth**: 1.25 Gbps per tunnel, or up to 5 Gbps with large bandwidth tunnels on Transit Gateway or Cloud WAN.',
          '**Direct Connect**: dedicated private connectivity, but traffic in transit is not encrypted by default.',
          '**MACsec**: layer 2 encryption between your router and the Direct Connect location, on 10, 100 and 400 Gbps dedicated connections.',
          '**VPN over Direct Connect**: an IPsec VPN across the Direct Connect link adds encryption while keeping consistent network performance.',
        ],
        tip: '"Traffic over Direct Connect must be encrypted": **MACsec** on a supported dedicated connection or an **IPsec VPN over Direct Connect**. Direct Connect alone does not meet an encryption requirement.',
      },
    ],
  },
  {
    slug: 'data-protection',
    group: 'secure',
    icon: 'shield',
    title: 'Data protection',
    summary:
      'KMS and CloudHSM, S3 encryption, TLS with ACM, secrets management, threat detection services and WORM retention locks.',
    lede: 'Encryption at rest and in transit, secrets, detection and immutable retention. Part of **Domain 1: Design Secure Architectures**, 30% of the scored content.',
    sections: [
      {
        id: 'kms',
        name: 'AWS KMS',
        fullName: 'AWS Key Management Service',
        link: en.aws('kms/'),
        summary:
          'Managed keys protected by FIPS 140-3 Security Level 3 validated HSMs that never leave the service unencrypted, integrated with most services for encryption at rest.',
        points: [
          '**Key policy**: every KMS key has exactly one, and it is the primary access control. IAM policies can allow use of a key only if the key policy enables them.',
          '**Envelope encryption**: `Encrypt` takes at most 4,096 bytes. For larger data, `GenerateDataKey` returns a data key that encrypts locally, and KMS protects the data key.',
          '**Rotation**: optional for customer managed keys, every 90 to 2,560 days (default 365), plus on-demand rotation. AWS managed keys rotate every year. Old key material stays available to decrypt.',
          '**Multi-Region keys**: related keys with the same key ID and key material in several Regions, so data encrypted in one Region decrypts in another without a cross-Region call.',
          '**Sharing**: resources encrypted under an AWS managed key cannot be shared with other accounts. Use a customer managed key whose key policy allows the other account.',
        ],
        tip: '"Share an encrypted snapshot or object with another account": **customer managed key** with the other account in the **key policy**. AWS managed keys cannot be shared.',
        table: {
          title: 'KMS key types',
          head: ['Key type', 'Control and cost'],
          rows: [
            {
              key: 'Customer managed',
              cells: ['You control the key policy, rotation and deletion', 'Monthly fee plus a fee per request'],
            },
            {
              key: 'AWS managed',
              cells: [
                'Created by a service with an `aws/` alias, visible, rotated every year',
                'No monthly fee, fee per request',
              ],
            },
            {
              key: 'AWS owned',
              cells: ['Owned by the service in its own account, not visible to you', 'No charge'],
            },
          ],
        },
      },
      {
        id: 'cloudhsm',
        name: 'AWS CloudHSM',
        link: en.aws('cloudhsm/'),
        summary:
          'Single-tenant hardware security modules in the AWS Cloud for when you must fully control the keys and the HSM users yourself.',
        points: [
          '**Single tenant**: dedicated HSMs, FIPS 140-2 or FIPS 140-3 Level 3 validated for clusters in FIPS mode.',
          '**Full control**: you manage HSM users and keys, and the end-to-end encrypted data plane is not visible to AWS.',
          '**Standard interfaces**: PKCS #11, JCE, CNG and KSP ease the migration of existing PKI and cryptographic workloads.',
          '**KMS custom key store**: a CloudHSM key store keeps KMS integration while key material stays in your cluster, for low request rate workloads.',
          '**Trade-off**: more operational responsibility than KMS, including availability and scaling of the cluster.',
        ],
        tip: '"Single-tenant HSM", "exclusive control of the keys" or "AWS must not access the keys": **CloudHSM**. Plain encryption at rest with an audit trail is **KMS**.',
      },
      {
        id: 's3-encryption',
        name: 'S3 encryption',
        link: en.docs('AmazonS3/latest/userguide/serv-side-encryption.html'),
        summary:
          'Every S3 bucket encrypts new objects by default. Choose the option by who must control the key and how many encryption layers compliance demands.',
        points: [
          '**SSE-S3**: the default for new uploads since January 5, 2023. AES-256 with keys that S3 manages, at no additional cost.',
          '**SSE-KMS**: KMS keys with key policies and CloudTrail records of key use. **S3 Bucket Keys** reduce KMS request costs by up to 99%.',
          '**DSSE-KMS**: 2 independent layers of AES-256 encryption for multilayer compliance. S3 Bucket Keys are not supported.',
          '**SSE-C**: you send the key with every request over HTTPS and S3 never stores it. Since April 2026 it is disabled by default on new buckets and must be enabled explicitly.',
          '**Client-side encryption**: data is encrypted before upload, so it reaches S3 already encrypted.',
        ],
        tip: '"Audit every use of the key and control who can decrypt": **SSE-KMS** with a customer managed key. "Two layers of encryption": **DSSE-KMS**. "The company manages its own keys outside AWS": **SSE-C or client-side encryption**.',
      },
      {
        id: 'acm-tls',
        name: 'ACM and TLS',
        fullName: 'AWS Certificate Manager',
        link: en.aws('certificate-manager/'),
        summary:
          'Public and private TLS certificates for integrated services at no additional charge, with managed renewal so certificates do not expire unnoticed.',
        points: [
          '**Integrated services**: Elastic Load Balancing, CloudFront, API Gateway, App Runner, Amplify, Elastic Beanstalk and Network Firewall TLS inspection.',
          '**CloudFront rule**: the certificate must be requested or imported in US East (N. Virginia), `us-east-1`.',
          '**Regional**: certificates cannot be copied between Regions. Request one in each Region where a load balancer uses it.',
          '**Managed renewal**: automatic for DNS-validated certificates in use. Imported certificates are not renewed by ACM, so track their expiry.',
          '**On EC2**: use the ACME protocol for publicly trusted certificates on your own servers. An ACM-managed certificate on an instance requires Nitro Enclaves.',
        ],
        tip: '"HTTPS on CloudFront with a custom domain": **ACM certificate in us-east-1**. "Avoid outages from expired certificates": **ACM certificate with DNS validation**, not an imported one.',
      },
      {
        id: 'secrets',
        name: 'Secrets and parameters',
        link: en.aws('secrets-manager/'),
        summary:
          'Keep credentials out of code. Secrets Manager rotates secrets automatically, while Parameter Store holds configuration and simple encrypted values.',
        points: [
          '**Secrets Manager**: KMS-encrypted secrets with automatic rotation, either managed rotation or a Lambda rotation function, with native database integrations.',
          '**Replication**: replica secrets in other Regions, and rotation of the primary secret propagates to them.',
          '**Parameter Store**: `String`, `StringList` and `SecureString` (KMS-encrypted) parameters in hierarchies, with no credential rotation.',
          '**Tiers**: standard is free, with 10,000 parameters of up to 4 KB. Advanced allows 100,000 parameters of up to 8 KB, parameter policies and cross-account sharing, for a charge.',
          '**Cost**: Secrets Manager bills per secret per month and per API call.',
        ],
        tip: '"A database password must rotate automatically": **Secrets Manager**. "Store AMI IDs or configuration values cheaply": **Parameter Store**.',
      },
      {
        id: 'threat-detection',
        name: 'Detection services',
        link: en.aws('products/security/'),
        summary:
          'Managed services that find threats, vulnerabilities and sensitive data, then aggregate and investigate the findings.',
        points: [
          '**GuardDuty**: threat detection from CloudTrail management events, VPC Flow Logs and DNS logs, without enabling those logs yourself. Protection plans add S3, EKS, runtime, malware, RDS and Lambda.',
          '**Inspector**: continuous scanning of EC2 instances, ECR container images and Lambda functions for software vulnerabilities and unintended network exposure.',
          '**Macie**: discovers sensitive data such as PII in S3 with machine learning and pattern matching, and flags bucket issues such as public access.',
          '**Security Hub CSPM**: checks accounts against standards such as AWS Foundational Security Best Practices and CIS, and aggregates findings from GuardDuty, Inspector and Macie. Most controls need AWS Config.',
          '**Detective**: builds a behavior graph from CloudTrail, VPC Flow Logs and GuardDuty findings to investigate the root cause.',
        ],
        tip: '"Find PII in S3": **Macie**. "Compromised credentials or crypto mining": **GuardDuty**. "CVEs in EC2 or container images": **Inspector**. "One view of compliance posture": **Security Hub**. "Root cause of a finding": **Detective**.',
        table: {
          title: 'Which service answers what',
          head: ['Service', 'Typical question'],
          rows: [
            { key: 'GuardDuty', cells: ['Is something malicious happening in my accounts?'] },
            { key: 'Inspector', cells: ['Which workloads have known vulnerabilities?'] },
            { key: 'Macie', cells: ['Where is sensitive data stored in S3?'] },
            { key: 'Security Hub CSPM', cells: ['Do my accounts follow security best practices?'] },
            { key: 'Detective', cells: ['What caused this finding and what did it touch?'] },
          ],
        },
      },
      {
        id: 'retention-locks',
        name: 'WORM retention',
        link: en.docs('AmazonS3/latest/userguide/object-lock.html'),
        summary:
          'Immutable storage for regulatory retention and ransomware protection, at the object, vault or backup level.',
        points: [
          '**S3 Object Lock**: write once, read many per object version, and it requires versioning. Use retention periods, or legal holds that have no expiry and stay until removed.',
          '**Governance mode**: users with `s3:BypassGovernanceRetention` can override the lock. Useful to test retention settings.',
          '**Compliance mode**: no user, not even the root user, can delete the version or shorten its retention until it expires.',
          '**Glacier Vault Lock**: a vault lock policy that becomes unchangeable once you complete the lock within 24 hours. The original vault service no longer accepts new customers, so new designs use Object Lock with S3 Glacier storage classes.',
          '**AWS Backup Vault Lock**: governance or compliance mode for backup vaults. In compliance mode the vault becomes immutable after a grace time of at least 72 hours.',
        ],
        tip: '"Records that nobody, including administrators, may delete for 7 years": **S3 Object Lock in compliance mode**. Governance mode still lets privileged users with the bypass permission remove data.',
      },
      {
        id: 'artifact',
        name: 'AWS Artifact',
        link: en.aws('artifact/'),
        summary: 'Self-service portal for AWS compliance reports and agreements, free of charge.',
        points: [
          '**Reports**: download SOC reports, ISO certifications and PCI DSS documents that show auditors the controls AWS operates.',
          '**Agreements**: review, accept and track agreements with AWS for one account or for every account of the organization.',
          '**Shared responsibility**: Artifact covers the compliance of AWS. You still document the compliance of your own workloads.',
          '**Marketplace vendors**: security and compliance documents of ISVs that sell on AWS Marketplace are also available.',
        ],
        tip: '"An auditor asks for the AWS SOC report or PCI attestation": **AWS Artifact**. AWS Config and AWS Audit Manager assess your own resources instead.',
      },
    ],
  },
]

export const ptBR: readonly Topic[] = [
  {
    slug: 'identity-access',
    group: 'secure',
    icon: 'key',
    title: 'Gerenciamento de identidade e acesso',
    summary:
      'Políticas do IAM e como a AWS as avalia, roles do STS, federação, IAM Identity Center, Cognito e Directory Service.',
    lede: 'Quem pode fazer o quê, em qual recurso, para pessoas, workloads e usuários de aplicações. Parte do **Domínio 1: Design Secure Architectures**, 30% do conteúdo pontuado.',
    sections: [
      {
        id: 'iam-basics',
        name: 'Blocos do IAM',
        fullName: 'AWS Identity and Access Management',
        link: pt.aws('iam/'),
        summary:
          'O IAM autentica os principals e autoriza cada requisição com políticas em JSON. Prefira roles com credenciais temporárias a usuários com chaves de longo prazo.',
        points: [
          '**Usuários**: credenciais de longo prazo (uma senha e até 2 chaves de acesso). Use só quando uma role não resolve, como em algumas ferramentas de terceiros.',
          '**Grupos**: anexam políticas a vários usuários de uma vez. Um usuário pode estar em até 10 grupos, e grupos não podem conter outros grupos.',
          '**Roles**: sem credenciais de longo prazo. São assumidas por usuários, serviços da AWS (instance profile do EC2, execution role do Lambda) ou identidades federadas para obter credenciais temporárias.',
          '**Políticas**: as baseadas em identidade (gerenciadas ou inline) se anexam a principals. As baseadas em recurso (bucket policy, política de fila, key policy do KMS) indicam um `Principal` e permitem acesso entre contas.',
          '**Menor privilégio**: comece pelas políticas gerenciadas pela AWS e depois restrinja com políticas gerenciadas pelo cliente, condições e a geração de políticas do IAM Access Analyzer a partir da atividade no CloudTrail.',
        ],
        tip: 'Aplicação no EC2 precisa acessar o S3: **anexe uma role do IAM via instance profile**. Guardar chaves de acesso na instância ou no código é sempre a resposta errada.',
      },
      {
        id: 'policy-evaluation',
        name: 'Avaliação de políticas',
        link: pt.docs('IAM/latest/UserGuide/reference_policies_evaluation-logic.html'),
        summary:
          'Toda requisição começa com uma negação implícita. Uma negação explícita em qualquer política vence, e todo guardrail no caminho também precisa permitir a ação.',
        points: [
          '**Negação explícita**: um `Deny` em qualquer política aplicável anula todos os `Allow`.',
          '**Mesma conta**: as permissões são a união das políticas baseadas em identidade e em recurso, então um allow em qualquer uma basta.',
          '**Entre contas**: o principal precisa de um `Allow` na sua política de identidade **e** de um `Allow` na política baseada em recurso da outra conta.',
          '**Permissions boundary**: uma política gerenciada que define o máximo de permissões de um usuário ou role. O efetivo é a interseção com as políticas de identidade, e o boundary sozinho não concede nada.',
          '**Guardrails**: SCPs, RCPs e session policies apenas limitam. A ação precisa ser permitida por todas as que se aplicam.',
        ],
        tip: '"Deixar desenvolvedores criarem roles sem escalar os próprios privilégios": **permissions boundary** obrigatório nas roles que eles criam. Limitar uma conta inteira ou uma OU é **SCP**, não boundary.',
        table: {
          title: 'Tipos de política em resumo',
          head: ['Tipo de política', 'O que faz'],
          rows: [
            { key: 'Baseada em identidade', cells: ['Concede permissões a um usuário, grupo ou role'] },
            {
              key: 'Baseada em recurso',
              cells: ['Concede acesso ao recurso, inclusive a principals de outras contas'],
            },
            {
              key: 'Permissions boundary',
              cells: ['Limita o que as políticas de identidade podem conceder a um usuário ou role'],
            },
            { key: 'SCP', cells: ['Limita as permissões dos principals nas contas membro'] },
            { key: 'RCP', cells: ['Limita as permissões sobre os recursos nas contas membro'] },
            { key: 'Session policy', cells: ['Limita uma sessão temporária criada pelo STS'] },
          ],
        },
      },
      {
        id: 'roles-sts',
        name: 'Roles e STS',
        fullName: 'AWS Security Token Service',
        link: pt.docs('IAM/latest/UserGuide/id_roles_manage-assume.html'),
        summary:
          'O STS emite credenciais temporárias quando um principal assume uma role. É o mecanismo por trás de instance profiles, acesso entre contas e federação.',
        points: [
          '**AssumeRole**: a sessão dura de 15 minutos até a duração máxima da role, que você configura entre 1 e 12 horas. O padrão é 1 hora.',
          '**Role chaining**: usar uma role para assumir outra limita a sessão a 1 hora.',
          '**Trust policy**: a política baseada em recurso da role que diz quem pode assumi-la com `sts:AssumeRole`. A política de permissões diz o que a sessão pode fazer.',
          '**Role vs política de recurso**: quem assume uma role abre mão das próprias permissões. O acesso via política baseada em recurso as mantém, o que ajuda a copiar dados entre contas.',
          '**External ID**: condição na trust policy quando um terceiro assume uma role na sua conta. Serve para evitar o problema do confused deputy.',
          '**APIs de federação**: `AssumeRoleWithSAML` para IdPs SAML 2.0 e `AssumeRoleWithWebIdentity` para tokens OIDC.',
        ],
        tip: '"Dar a um parceiro ou a outra conta acesso a recursos": **role do IAM entre contas**, com **external ID** para terceiros. Criar usuários do IAM para eles ou compartilhar chaves de acesso é o distrator.',
      },
      {
        id: 'root-user',
        name: 'Usuário root',
        link: pt.docs('IAM/latest/UserGuide/id_root-user.html'),
        summary:
          'A identidade criada junto com a conta tem acesso irrestrito. Proteja com MFA e use só nas poucas tarefas que exigem root.',
        points: [
          '**MFA**: a AWS exige MFA para o root por padrão. Recomenda-se MFA resistente a phishing, como passkeys e chaves de segurança.',
          '**Dia a dia**: use um usuário administrativo no IAM Identity Center, nunca o root. Apague as chaves de acesso do root que não forem necessárias.',
          '**Tarefas exclusivas do root**: encerrar uma conta avulsa, restaurar permissões do IAM quando o único administrador se trancou para fora, registrar-se como vendedor no Reserved Instance Marketplace, ativar MFA delete em um bucket S3.',
          '**Acesso root centralizado**: no AWS Organizations dá para remover as credenciais root das contas membro e executar tarefas privilegiadas a partir da conta de gerenciamento, como destravar uma bucket policy que nega todo mundo.',
          '**SCPs se aplicam**: uma SCP restringe o root de uma conta membro, mas nunca a conta de gerenciamento.',
        ],
        tip: '"Proteger o usuário root": **MFA, sem chaves de acesso, uso só em tarefas exclusivas**. Quando perguntarem qual tarefa exige root, procure **encerrar uma conta avulsa** ou **restaurar um administrador trancado para fora**.',
      },
      {
        id: 'identity-center',
        name: 'IAM Identity Center',
        fullName: 'AWS IAM Identity Center',
        link: pt.aws('iam/identity-center/'),
        summary:
          'Single sign-on da força de trabalho para muitas contas e aplicações da AWS a partir de um só lugar. É a forma recomendada de dar acesso a pessoas numa organização com várias contas.',
        points: [
          '**Fonte de identidade**: o diretório do Identity Center, o Active Directory (AWS Managed Microsoft AD ou AD Connector) ou um IdP externo via SAML 2.0.',
          '**Permission sets**: defina uma vez as permissões de uma função de trabalho, provisione em várias contas e atribua a usuários e grupos.',
          '**Instância de organização**: implantada na conta de gerenciamento, é o único tipo de instância que gerencia acesso a contas da AWS. Instâncias de conta servem a implantações isoladas de aplicações.',
          '**AWS access portal**: uma página de login que lista todas as contas e aplicações atribuídas ao usuário, com credenciais de curto prazo para console e CLI.',
          '**Trusted identity propagation**: aplicações gerenciadas pela AWS, como o Amazon Quick, repassam a identidade do usuário a serviços como o Amazon Redshift para autorização e auditoria.',
        ],
        tip: '"Funcionários precisam de single sign-on em várias contas com as credenciais corporativas": **IAM Identity Center** ligado ao IdP corporativo. O Cognito atende os clientes da sua aplicação, não a força de trabalho.',
      },
      {
        id: 'federation',
        name: 'Federação',
        link: pt.docs('IAM/latest/UserGuide/id_roles_providers.html'),
        summary:
          'Os usuários mantêm a identidade em um IdP externo e recebem credenciais temporárias da AWS, sem distribuir usuários do IAM nem chaves de longo prazo.',
        points: [
          '**SAML 2.0**: um IdP corporativo, como o Active Directory Federation Services, autentica o usuário, e o STS `AssumeRoleWithSAML` devolve credenciais de uma role do IAM.',
          '**Grupos do diretório em roles**: a asserção do IdP mapeia usuários ou grupos do diretório para roles do IAM, então o acesso segue a participação nos grupos.',
          '**OIDC**: tokens de provedores como o GitHub Actions são trocados via `AssumeRoleWithWebIdentity`, e os pipelines rodam sem chaves guardadas.',
          '**IAM ou Identity Center**: a federação direta no IAM serve para uma conta avulsa ou para usuários de máquina. Para muitas contas, federe uma vez no IAM Identity Center.',
          '**IAM Roles Anywhere**: workloads fora da AWS obtêm credenciais temporárias com um certificado X.509 da sua PKI.',
        ],
        tip: '"Usuários do Active Directory on-premises precisam acessar o console sem novas credenciais": **federação SAML 2.0** ou IAM Identity Center com AD. "Servidor ou pipeline fora da AWS precisa de credenciais": **federação OIDC ou IAM Roles Anywhere**, não chaves de acesso.',
      },
      {
        id: 'cognito',
        name: 'Amazon Cognito',
        link: pt.aws('cognito/'),
        summary:
          'Identidade de clientes para aplicações web e mobile. User pools respondem quem é o usuário, identity pools respondem quais recursos da AWS ele pode acessar.',
        points: [
          '**User pools**: diretório de usuários e provedor OIDC que emite JWTs (tokens de ID e de acesso). Suporta cadastro, MFA, login social e IdPs corporativos SAML ou OIDC.',
          '**Identity pools**: trocam um token confiável por credenciais temporárias da AWS, com privilégio limitado, emitidas pelo STS. Também podem dar acesso não autenticado a visitantes.',
          '**Juntos**: o login acontece no user pool, e o token do user pool é trocado no identity pool por credenciais para chamar o S3 ou o DynamoDB diretamente.',
          '**Proteção de APIs**: o API Gateway valida tokens do user pool antes de chamar o backend, e o AWS WAF pode proteger o user pool.',
          '**Controle de acesso**: identity pools escolhem uma role do IAM por usuário (baseado em role) ou mapeiam claims para session tags (baseado em atributos).',
        ],
        tip: '"Usuários do app mobile enviam arquivos direto para o próprio prefixo no S3": **identity pool do Cognito** emitindo credenciais temporárias. "Cadastro e login com Google no app": **user pool**.',
        table: {
          title: 'User pools vs identity pools',
          head: ['Necessidade', 'Use'],
          rows: [
            { key: 'Autenticar', cells: ['**User pool**: diretório, login e JWTs para sua aplicação ou API'] },
            {
              key: 'Chamar serviços da AWS',
              cells: ['**Identity pool**: credenciais temporárias da AWS emitidas pelo STS'],
            },
            {
              key: 'Acesso de visitante',
              cells: ['**Identity pool**: identidades não autenticadas com uma role limitada'],
            },
            {
              key: 'Login social ou SAML',
              cells: ['**User pool** intermedeia o login', '**Identity pool** também pode confiar direto no IdP'],
            },
          ],
        },
      },
      {
        id: 'directory-service',
        name: 'Directory Service',
        fullName: 'AWS Directory Service',
        link: pt.aws('directoryservice/'),
        summary:
          'Formas gerenciadas de usar o Microsoft Active Directory com a AWS, desde um AD completo gerenciado até um proxy que mantém o diretório on-premises.',
        points: [
          '**AWS Managed Microsoft AD**: um AD real do Windows Server operado pela AWS. Suporta trusts com o AD on-premises, MFA, extensões de schema e Amazon RDS for SQL Server.',
          '**Edições**: a Standard mira até cerca de 30.000 objetos no diretório, a Enterprise até cerca de 500.000.',
          '**AD Connector**: proxy que encaminha os logins para os controladores de domínio on-premises, sem sincronizar o diretório. Pode usar o seu MFA via RADIUS.',
          '**Simple AD**: diretório compatível com AD, de baixo custo, baseado em Samba 4. Sem trusts, sem MFA e sem RDS for SQL Server.',
        ],
        tip: '"Manter os usuários no AD on-premises e deixá-los entrar no WorkSpaces": **AD Connector**. "Trust com o AD on-premises" ou "RDS for SQL Server com autenticação Windows": **AWS Managed Microsoft AD**.',
      },
    ],
  },
  {
    slug: 'multi-account',
    group: 'secure',
    icon: 'users',
    title: 'Governança de várias contas',
    summary:
      'AWS Organizations, SCPs e RCPs, landing zones do Control Tower, compartilhamento com AWS RAM e administração delegada.',
    lede: 'Separe workloads em contas e governe tudo de forma central com guardrails. Parte do **Domínio 1: Design Secure Architectures**, 30% do conteúdo pontuado.',
    sections: [
      {
        id: 'organizations',
        name: 'AWS Organizations',
        link: pt.aws('organizations/'),
        summary:
          'Agrupa contas numa hierarquia sob uma conta de gerenciamento, com políticas centrais, faturamento consolidado e integração com serviços.',
        points: [
          '**Conta de gerenciamento**: cria a organização, convida e remove contas, anexa políticas e paga todas as cobranças. Não rode workloads nela, porque SCPs não a restringem.',
          '**OUs**: agrupam contas por workload ou ambiente. A hierarquia pode ter 5 níveis abaixo da raiz, e as políticas são herdadas para baixo.',
          '**Conjuntos de recursos**: **all features** (recomendado, exigido para SCPs, RCPs e políticas declarativas) ou só **consolidated billing**.',
          '**Faturamento consolidado**: uma fatura, uso somado para descontos por volume, descontos de Reserved Instances e Savings Plans compartilhados, sem custo extra.',
          '**Participação**: uma conta pertence a apenas uma organização por vez.',
        ],
        tip: '"Isolar ambientes e aplicar controles por grupo de contas": **contas separadas em OUs** com políticas anexadas a cada OU. Só IAM dentro de uma conta não dá guardrail central.',
      },
      {
        id: 'scp-rcp',
        name: 'SCPs e RCPs',
        fullName: 'Service control policies e resource control policies',
        link: pt.docs('organizations/latest/userguide/orgs_manage_policies_authorization_policies.html'),
        summary:
          'Políticas de autorização definem o máximo de permissões nas contas membro. SCPs limitam principals, RCPs limitam recursos, e nenhuma das duas concede nada.',
        points: [
          '**SCP**: limita usuários e roles do IAM nas contas membro, inclusive o root da conta membro. Não afeta a conta de gerenciamento nem service-linked roles.',
          '**FullAWSAccess**: anexada por padrão. Uma estratégia de deny list a mantém e acrescenta instruções `Deny`. Removê-la sem substituta faz todas as ações falharem.',
          '**Herança**: uma conta só tem o que todos os pais acima dela permitem, da raiz até a conta.',
          '**RCP**: limita o que qualquer um, inclusive principals de fora da organização, pode fazer em recursos de serviços suportados, como S3, KMS, SQS, Secrets Manager, DynamoDB e STS.',
          '**Perímetro de dados**: uma RCP garante que só identidades da sua organização alcancem os recursos, e uma SCP limita serviços ou Regiões que seus principals podem usar.',
        ],
        tip: '"Impedir que qualquer conta da OU desative o CloudTrail ou use Regiões não aprovadas, mesmo administradores": **SCP**. "Bloquear principals de fora da organização nos buckets S3 de todas as contas": **RCP**.',
        table: {
          title: 'SCP vs RCP',
          head: ['Aspecto', 'SCP e RCP'],
          rows: [
            {
              key: 'Escopo',
              cells: ['**SCP**: usuários e roles do IAM nas contas membro', '**RCP**: recursos nas contas membro'],
            },
            { key: 'Concede acesso', cells: ['Nenhuma das duas. Ambas são apenas guardrails'] },
            { key: 'Conta de gerenciamento', cells: ['Não é afetada por nenhuma'] },
            {
              key: 'Limite de anexos',
              cells: ['**SCP**: 10 por raiz, OU ou conta', '**RCP**: 5 por raiz, OU ou conta'],
            },
            { key: 'Tamanho máximo', cells: ['**SCP**: 10.240 caracteres', '**RCP**: 5.120 caracteres'] },
          ],
        },
      },
      {
        id: 'control-tower',
        name: 'AWS Control Tower',
        link: pt.aws('controltower/'),
        summary:
          'Monta e governa uma landing zone com várias contas seguindo as boas práticas da AWS, orquestrando Organizations, IAM Identity Center e Service Catalog.',
        points: [
          '**Landing zone**: ambiente com várias contas bem arquitetado. Versões anteriores criam uma Security OU com as contas Log Archive e Audit, e a landing zone 4.0 permite definir a sua própria estrutura.',
          '**Account Factory**: template configurável que provisiona contas novas com configurações e controles pré-aprovados.',
          '**Controles preventivos**: implementados com SCPs e RCPs, bloqueiam ações antes que aconteçam.',
          '**Controles detectivos**: implementados com regras do AWS Config, sinalizam recursos fora de conformidade.',
          '**Controles proativos**: implementados com hooks do CloudFormation, barram recursos fora de conformidade antes do provisionamento.',
          '**Orientação**: os controles são obrigatórios (sempre ativos), fortemente recomendados ou eletivos.',
        ],
        tip: '"Montar rápido um ambiente com várias contas, guardrails e criação automática de contas": **Control Tower**. Fazer o mesmo à mão com o Organizations dá mais trabalho operacional.',
      },
      {
        id: 'ram',
        name: 'AWS RAM',
        fullName: 'AWS Resource Access Manager',
        link: pt.aws('ram/'),
        summary:
          'Compartilhe recursos seus com outras contas, OUs ou a organização inteira em vez de duplicá-los em cada conta.',
        points: [
          '**Exemplos compartilháveis**: subnets de VPC, transit gateways, regras do Route 53 Resolver, prefix lists, configurações do License Manager, políticas do Network Firewall, clusters Aurora e Private CA.',
          '**VPC sharing**: o dono compartilha subnets com participantes da mesma organização. Os participantes criam os próprios recursos ali, mas não veem nem alteram os recursos dos outros.',
          '**Convites**: com o compartilhamento via Organizations ativado, contas da organização não precisam de convite. Contas de fora precisam aceitar um.',
          '**Managed permissions**: definem o que as contas consumidoras podem fazer com o recurso compartilhado. As políticas do IAM e as SCPs delas continuam valendo.',
          '**Custo**: o AWS RAM em si não cobra nada. O recurso compartilhado é cobrado normalmente.',
        ],
        tip: '"Várias contas precisam colocar workloads numa rede gerenciada de forma central": **compartilhe subnets ou um transit gateway com o AWS RAM**. Recriar o recurso em cada conta é o distrator.',
      },
      {
        id: 'delegated-admin',
        name: 'Administração delegada',
        link: pt.docs('organizations/latest/userguide/orgs_integrate_delegated_admin.html'),
        summary:
          'Registre uma conta membro para administrar um serviço integrado para a organização inteira, tirando o trabalho do dia a dia da conta de gerenciamento.',
        points: [
          '**Por quê**: SCPs não restringem a conta de gerenciamento, então as ferramentas de segurança devem rodar numa conta membro dedicada.',
          '**Serviços de segurança**: GuardDuty, Security Hub CSPM, Macie, Inspector, Detective, Firewall Manager, IAM Access Analyzer e AWS Config aceitam administrador delegado.',
          '**Trusted access**: permite que um serviço atue em todas as contas, como uma trilha de organização no CloudTrail ou StackSets com permissões gerenciadas pelo serviço.',
          '**Limites**: só a conta de gerenciamento cria ou convida contas. Um administrador delegado não pode.',
          '**Guardrails continuam valendo**: o administrador delegado é uma conta membro, então SCPs e RCPs o afetam.',
        ],
        tip: '"Um time central de segurança precisa gerenciar os findings do GuardDuty de todas as contas sem usar a conta de gerenciamento": **administrador delegado** do GuardDuty na conta de segurança.',
      },
      {
        id: 'declarative-policies',
        name: 'Políticas declarativas',
        link: pt.docs('organizations/latest/userguide/orgs_manage_policies.html'),
        summary:
          'Políticas da organização que configuram serviços de forma central em vez de limitar permissões. Ao contrário das SCPs, também valem na conta de gerenciamento.',
        points: [
          '**Tag policies**: padronizam chaves, valores e maiúsculas das tags. A aplicação obrigatória bloqueia operações de tag fora do padrão nos tipos de recurso escolhidos, mas recursos sem tag não são avaliados.',
          '**Conformidade de tags**: o AWS Resource Groups mostra as tags fora do padrão, e a conta de gerenciamento enxerga todas as contas.',
          '**Backup policies**: aplicam planos de backup aos recursos de todas as contas da organização.',
          '**Políticas do Amazon EC2**: declaram e impõem configurações do EC2 em escala, mantidas mesmo quando o serviço ganha recursos ou APIs novas.',
          '**Políticas de opt-out de serviços de IA**: controlam a coleta de dados pelos serviços de IA da AWS em todas as contas.',
        ],
        tip: '"Impor um formato consistente para a tag CostCenter em todas as contas": **tag policy**. Lembre que tag policies não apontam recursos que não têm tag nenhuma.',
      },
    ],
  },
  {
    slug: 'network-security',
    group: 'secure',
    icon: 'lock',
    title: 'Segurança de rede',
    summary:
      'Subnets, security groups versus network ACLs, VPC endpoints, WAF, Shield, Network Firewall, Firewall Manager e links híbridos criptografados.',
    lede: 'Controles em camadas, da borda até cada instância. Parte do **Domínio 1: Design Secure Architectures**, 30% do conteúdo pontuado.',
    sections: [
      {
        id: 'subnets',
        name: 'Subnets públicas e privadas',
        link: pt.docs('vpc/latest/userguide/configure-subnets.html'),
        summary:
          'O roteamento define o tipo da subnet. Deixe públicos só load balancers e gateways, e coloque as camadas de aplicação e dados em subnets privadas.',
        points: [
          '**Subnet pública**: tem rota direta para um internet gateway.',
          '**Subnet privada**: sem rota direta para um internet gateway. Só chega à internet por meio de um NAT.',
          '**Subnet isolada**: nenhuma rota para fora da VPC. Uma subnet só de VPN roteia para uma Site-to-Site VPN por um virtual private gateway.',
          '**NAT gateway zonal**: permite que recursos privados abram conexões de saída, nunca de entrada. Fica numa subnet pública com Elastic IP, então crie um por AZ. 5 Gbps escalando até 100 Gbps.',
          '**NAT gateway regional**: se expande sozinho entre AZs e dispensa subnet pública, mas não suporta NAT privado.',
          '**IPv6**: um egress-only internet gateway dá saída IPv6 sem permitir entrada.',
        ],
        tip: '"Instâncias precisam baixar patches mas não podem ser alcançadas pela internet": **subnet privada com rota para um NAT gateway**. NAT gateway não aceita security group, então filtre com os security groups das instâncias e NACLs.',
      },
      {
        id: 'sg-nacl',
        name: 'Security groups vs NACLs',
        link: pt.docs('vpc/latest/userguide/infrastructure-security.html'),
        summary:
          'Security groups são o filtro principal, stateful, na instância. Network ACLs são um guardrail stateless na subnet que também pode negar.',
        points: [
          '**Security groups**: só regras de allow, todas avaliadas, tráfego de retorno liberado automaticamente. As regras podem referenciar outros security groups, ideal para liberar uma camada para outra.',
          '**Saída padrão**: o security group vem com uma regra de saída padrão que libera todo o tráfego.',
          '**Network ACLs**: regras de allow e deny numeradas de 1 a 32766, avaliadas a partir do menor número até a primeira correspondência.',
          '**Stateless**: o tráfego de retorno precisa ser liberado explicitamente, em geral as portas efêmeras 1024-65535.',
          '**Padrões**: a NACL padrão libera todo o tráfego. Uma NACL customizada nova nega tudo pela regra final `*` até você adicionar regras.',
          '**Bloquear um IP**: só a NACL consegue negar uma faixa de endereços, porque security groups não têm regras de deny.',
        ],
        tip: '"Bloquear agora uma faixa de IP maliciosa": **regra de deny na NACL** (ou AWS WAF para HTTP). "Liberar a camada de aplicação só para a camada web": **security group que referencia o security group da camada web**.',
        table: {
          title: 'Security groups vs network ACLs',
          head: ['Característica', 'Security group e network ACL'],
          rows: [
            { key: 'Nível', cells: ['**Security group**: instância', '**NACL**: subnet'] },
            { key: 'Regras', cells: ['**Security group**: só allow', '**NACL**: allow e deny'] },
            {
              key: 'Avaliação',
              cells: [
                '**Security group**: todas as regras',
                '**NACL**: ordem crescente, a primeira correspondência vence',
              ],
            },
            {
              key: 'Tráfego de retorno',
              cells: ['**Security group**: automático (stateful)', '**NACL**: precisa ser liberado (stateless)'],
            },
          ],
        },
      },
      {
        id: 'vpc-endpoints',
        name: 'VPC endpoints',
        link: pt.docs('vpc/latest/privatelink/concepts.html'),
        summary:
          'Acesse serviços da AWS e endpoint services de forma privada, sem internet gateway, sem NAT e sem IP público.',
        points: [
          '**Gateway endpoint**: só para S3 e DynamoDB. Uma entrada na route table que aponta para a prefix list do serviço, sem cobrança adicional.',
          '**Interface endpoint**: interfaces de rede do AWS PrivateLink com IPs privados nas suas subnets, protegidas por security groups e cobradas.',
          '**Alcance**: só interface endpoints atendem o on-premises via Direct Connect ou VPN e outras Regiões via peering ou Transit Gateway.',
          '**Endpoint policy**: política de recurso no endpoint que limita os principals e recursos acessíveis por ele. A padrão libera tudo.',
          '**Trancar o bucket**: uma bucket policy do S3 com a condição `aws:sourceVpce` nega requisições que não passam pelo seu endpoint.',
          '**Gateway Load Balancer endpoint**: envia o tráfego para uma frota de appliances de inspeção.',
        ],
        tip: '"Instâncias privadas precisam acessar o S3 sem custo de dados do NAT gateway": **gateway endpoint do S3**. "Servidores on-premises no Direct Connect precisam acessar o S3 de forma privada": **interface endpoint do S3**.',
        table: {
          title: 'Gateway vs interface endpoint para o S3',
          head: ['Aspecto', 'Gateway e interface'],
          rows: [
            {
              key: 'Endereçamento',
              cells: ['**Gateway**: IPs públicos do S3 via rota', '**Interface**: IPs privados da sua VPC'],
            },
            { key: 'On-premises', cells: ['**Gateway**: não', '**Interface**: sim, via Direct Connect ou VPN'] },
            {
              key: 'Outras Regiões',
              cells: ['**Gateway**: não', '**Interface**: sim, via peering ou Transit Gateway'],
            },
            { key: 'Custo', cells: ['**Gateway**: não é cobrado', '**Interface**: é cobrado'] },
          ],
        },
      },
      {
        id: 'systems-manager',
        name: 'Systems Manager',
        fullName: 'AWS Systems Manager',
        link: pt.aws('systems-manager/'),
        summary:
          'Opera frotas de instâncias EC2 e servidores on premises pelo SSM Agent, sem chaves SSH, bastion hosts ou portas de entrada.',
        points: [
          '**Session Manager**: acesso ao shell pelo console ou pela CLI, controlado pelo IAM e registrado no S3 ou no CloudWatch Logs. Nenhuma porta de entrada é aberta.',
          '**Requisitos**: o SSM Agent, um instance profile com a política `AmazonSSMManagedInstanceCore` e um caminho até o serviço, por NAT gateway ou VPC interface endpoints.',
          '**Run Command**: executa scripts em muitas instâncias de uma vez, escolhidas por tag.',
          '**Patch Manager**: aplica patch baselines em janelas de manutenção.',
          '**Automation**: runbooks para tarefas comuns, como criar uma AMI ou reiniciar uma instância.',
        ],
        tip: '"Acessar instâncias em sub-rede privada sem bastion host e sem abrir a porta 22": **Session Manager**. "Aplicar patches na frota toda com agenda": **Patch Manager**.',
      },
      {
        id: 'waf',
        name: 'AWS WAF',
        link: pt.aws('waf/'),
        summary:
          'Firewall de aplicação web na camada 7 que inspeciona requisições HTTP(S) antes que cheguem ao CloudFront, a um ALB, ao API Gateway ou a outra porta de entrada.',
        points: [
          '**Recursos protegidos**: distribuições do CloudFront, Application Load Balancers, REST APIs do API Gateway, APIs GraphQL do AppSync, user pools do Cognito, serviços do App Runner, instâncias do Verified Access e Amplify.',
          '**Vetores de ameaça**: instruções de correspondência para SQL injection e cross-site scripting (XSS), além dos rule groups do AWS Managed Rules.',
          '**Rate-based rules**: contam requisições por chave de agregação e limitam as que chegam rápido demais, uma defesa contra HTTP floods.',
          '**Geo e IP**: as instruções de geographic match e IP set match liberam ou bloqueiam por país ou faixa de endereços.',
          '**Respostas**: uma requisição bloqueada recebe HTTP 403 ou uma resposta customizada.',
        ],
        tip: '"Bloquear SQL injection e XSS contra a aplicação web": **AWS WAF** no ALB ou no CloudFront. Security groups e NACLs não inspecionam o conteúdo HTTP, e o WAF não se associa a um Network Load Balancer.',
      },
      {
        id: 'shield',
        name: 'AWS Shield',
        link: pt.aws('shield/'),
        summary:
          'Proteção gerenciada contra DDoS. O Standard é automático e sem custo para todo cliente, o Advanced acrescenta resposta especializada e proteção de custos para aplicações críticas.',
        points: [
          '**Shield Standard**: automático e gratuito, defende contra os ataques mais comuns nas camadas de rede e transporte (3 e 4), como SYN floods e reflexão UDP.',
          '**Shield Advanced**: protege Elastic IPs, Elastic Load Balancing, CloudFront, Global Accelerator e Route 53, e acrescenta mitigação na camada 7 via AWS WAF.',
          '**Shield Response Team**: acesso 24/7 para clientes com plano de suporte Business ou Enterprise.',
          '**Proteção de custos**: créditos para cobranças de escalonamento causadas por um ataque DDoS.',
          '**Preço**: US$ 3.000 por mês com compromisso de 1 ano, cobrado por conta pagadora, incluindo uso do AWS WAF nos recursos protegidos até um limite.',
          '**Detecção por saúde**: health checks do Route 53 associados aos recursos protegidos detectam ataques mais cedo.',
        ],
        tip: '"Especialistas em DDoS de plantão e nada de conta surpresa depois de um ataque": **Shield Advanced**. Se a pergunta só pede proteção básica contra DDoS sem custo, o **Shield Standard** já está ativo.',
      },
      {
        id: 'network-firewall',
        name: 'AWS Network Firewall',
        link: pt.aws('network-firewall/'),
        summary:
          'Firewall stateful gerenciado com prevenção de intrusão para o perímetro da VPC, no tráfego por internet gateways, NAT gateways, VPN e Direct Connect.',
        points: [
          '**Regras**: rule groups stateless e stateful, regras IPS compatíveis com Suricata, regras de 5-tupla e filtragem por domínio.',
          '**Implantação**: endpoints do firewall numa subnet dedicada em cada AZ, com route tables desviando o tráfego por eles.',
          '**Casos de uso**: permitir saída só para domínios aprovados, inspeção profunda de pacotes, inspeção norte-sul e leste-oeste.',
          '**Inspeção TLS**: descriptografa e criptografa de novo o tráfego com um certificado do ACM.',
          '**Em escala**: o Firewall Manager implanta firewalls entre contas, e as políticas de firewall podem ser compartilhadas pelo AWS RAM.',
        ],
        tip: '"Filtrar a saída de todas as VPCs por nome de domínio, com assinaturas de IPS": **Network Firewall**. O WAF cobre só HTTP(S) na porta de entrada da aplicação.',
      },
      {
        id: 'firewall-manager',
        name: 'Firewall Manager',
        fullName: 'AWS Firewall Manager',
        link: pt.aws('firewall-manager/'),
        summary:
          'Políticas de firewall centrais para todas as contas de uma organização, aplicadas automaticamente a contas e recursos novos.',
        points: [
          '**Tipos de política**: AWS WAF, Shield Advanced, security groups da VPC, network ACLs, Network Firewall e Route 53 Resolver DNS Firewall.',
          '**Cobertura automática**: contas e recursos novos dentro do escopo recebem a proteção assim que aparecem.',
          '**Escopo**: todos os recursos de um tipo, recursos com tags específicas ou contas escolhidas.',
          '**Requisitos**: atua sobre uma organização do AWS Organizations. As cobranças vêm dos serviços por baixo, como AWS WAF e AWS Config.',
          '**Administrador**: uma conta administradora do Firewall Manager, que pode ser uma conta membro delegada.',
        ],
        tip: '"Todo ALB de toda conta precisa ter sempre as regras de WAF corporativas, inclusive em contas futuras": **Firewall Manager**. Configurar o WAF conta por conta não escala.',
      },
      {
        id: 'hybrid-encryption',
        name: 'Links híbridos criptografados',
        link: pt.docs('directconnect/latest/UserGuide/encryption-in-transit.html'),
        summary:
          'Proteja o tráfego entre o on-premises e a AWS. A Site-to-Site VPN criptografa pela internet, já o Direct Connect é privado, mas não é criptografado por padrão.',
        points: [
          '**Site-to-Site VPN**: túneis IPsec até um virtual private gateway ou um transit gateway. Cada conexão tem 2 túneis para alta disponibilidade.',
          '**Banda por túnel**: 1,25 Gbps por túnel, ou até 5 Gbps com large bandwidth tunnels no Transit Gateway ou no Cloud WAN.',
          '**Direct Connect**: conectividade privada dedicada, mas o tráfego em trânsito não é criptografado por padrão.',
          '**MACsec**: criptografia na camada 2 entre o seu roteador e a localização do Direct Connect, em conexões dedicadas de 10, 100 e 400 Gbps.',
          '**VPN sobre Direct Connect**: uma VPN IPsec pelo link do Direct Connect acrescenta criptografia mantendo o desempenho de rede consistente.',
        ],
        tip: '"O tráfego pelo Direct Connect precisa ser criptografado": **MACsec** numa conexão dedicada suportada ou **VPN IPsec sobre o Direct Connect**. Só o Direct Connect não atende a um requisito de criptografia.',
      },
    ],
  },
  {
    slug: 'data-protection',
    group: 'secure',
    icon: 'shield',
    title: 'Proteção de dados',
    summary:
      'KMS e CloudHSM, criptografia no S3, TLS com ACM, gestão de segredos, serviços de detecção de ameaças e retenção WORM.',
    lede: 'Criptografia em repouso e em trânsito, segredos, detecção e retenção imutável. Parte do **Domínio 1: Design Secure Architectures**, 30% do conteúdo pontuado.',
    sections: [
      {
        id: 'kms',
        name: 'AWS KMS',
        fullName: 'AWS Key Management Service',
        link: pt.aws('kms/'),
        summary:
          'Chaves gerenciadas e protegidas por HSMs validados FIPS 140-3 Security Level 3, que nunca saem do serviço sem criptografia, integradas à maioria dos serviços para criptografia em repouso.',
        points: [
          '**Key policy**: toda chave do KMS tem exatamente uma, e ela é o controle de acesso principal. Políticas do IAM só liberam o uso da chave se a key policy as habilitar.',
          '**Envelope encryption**: o `Encrypt` aceita no máximo 4.096 bytes. Para dados maiores, o `GenerateDataKey` devolve uma data key que criptografa localmente, e o KMS protege a data key.',
          '**Rotação**: opcional nas chaves gerenciadas pelo cliente, a cada 90 a 2.560 dias (padrão 365), além da rotação sob demanda. Chaves gerenciadas pela AWS giram todo ano. O material antigo continua disponível para descriptografar.',
          '**Chaves multi-Região**: chaves relacionadas com o mesmo key ID e material em várias Regiões, então o que foi criptografado numa Região é descriptografado em outra sem chamada entre Regiões.',
          '**Compartilhamento**: recursos criptografados com uma chave gerenciada pela AWS não podem ser compartilhados com outras contas. Use uma chave gerenciada pelo cliente cuja key policy libere a outra conta.',
        ],
        tip: '"Compartilhar um snapshot ou objeto criptografado com outra conta": **chave gerenciada pelo cliente** com a outra conta na **key policy**. Chaves gerenciadas pela AWS não podem ser compartilhadas.',
        table: {
          title: 'Tipos de chave do KMS',
          head: ['Tipo de chave', 'Controle e custo'],
          rows: [
            {
              key: 'Gerenciada pelo cliente',
              cells: ['Você controla key policy, rotação e exclusão', 'Taxa mensal mais taxa por requisição'],
            },
            {
              key: 'Gerenciada pela AWS',
              cells: [
                'Criada por um serviço com alias `aws/`, visível, girada todo ano',
                'Sem taxa mensal, taxa por requisição',
              ],
            },
            {
              key: 'Da AWS (AWS owned)',
              cells: ['Pertence ao serviço, na conta dele, invisível para você', 'Sem cobrança'],
            },
          ],
        },
      },
      {
        id: 'cloudhsm',
        name: 'AWS CloudHSM',
        link: pt.aws('cloudhsm/'),
        summary:
          'Módulos de segurança de hardware single-tenant na AWS para quando você precisa controlar sozinho as chaves e os usuários do HSM.',
        points: [
          '**Single-tenant**: HSMs dedicados, validados FIPS 140-2 ou FIPS 140-3 Level 3 para clusters em modo FIPS.',
          '**Controle total**: você gerencia os usuários do HSM e as chaves, e o plano de dados criptografado de ponta a ponta não é visível para a AWS.',
          '**Interfaces padrão**: PKCS #11, JCE, CNG e KSP facilitam migrar PKI e workloads criptográficos existentes.',
          '**Custom key store do KMS**: um CloudHSM key store mantém a integração com o KMS enquanto o material da chave fica no seu cluster, para workloads com poucas requisições por segundo.',
          '**Trade-off**: mais responsabilidade operacional que o KMS, incluindo disponibilidade e escala do cluster.',
        ],
        tip: '"HSM single-tenant", "controle exclusivo das chaves" ou "a AWS não pode acessar as chaves": **CloudHSM**. Criptografia em repouso comum com trilha de auditoria é **KMS**.',
      },
      {
        id: 's3-encryption',
        name: 'Criptografia no S3',
        link: pt.docs('AmazonS3/latest/userguide/serv-side-encryption.html'),
        summary:
          'Todo bucket S3 criptografa objetos novos por padrão. Escolha a opção conforme quem precisa controlar a chave e quantas camadas de criptografia a conformidade exige.',
        points: [
          '**SSE-S3**: padrão para novos uploads desde 5 de janeiro de 2023. AES-256 com chaves gerenciadas pelo S3, sem custo adicional.',
          '**SSE-KMS**: chaves do KMS com key policies e registro no CloudTrail de cada uso da chave. **S3 Bucket Keys** reduzem o custo de requisições ao KMS em até 99%.',
          '**DSSE-KMS**: 2 camadas independentes de criptografia AES-256 para exigências de criptografia em várias camadas. Não suporta S3 Bucket Keys.',
          '**SSE-C**: você envia a chave em toda requisição via HTTPS e o S3 nunca a armazena. Desde abril de 2026 vem desativada por padrão em buckets novos e precisa ser habilitada explicitamente.',
          '**Criptografia no cliente**: os dados são criptografados antes do upload e chegam ao S3 já cifrados.',
        ],
        tip: '"Auditar cada uso da chave e controlar quem descriptografa": **SSE-KMS** com chave gerenciada pelo cliente. "Duas camadas de criptografia": **DSSE-KMS**. "A empresa gerencia as próprias chaves fora da AWS": **SSE-C ou criptografia no cliente**.',
      },
      {
        id: 'acm-tls',
        name: 'ACM e TLS',
        fullName: 'AWS Certificate Manager',
        link: pt.aws('certificate-manager/'),
        summary:
          'Certificados TLS públicos e privados para serviços integrados sem custo adicional, com renovação gerenciada para que nada expire sem ninguém perceber.',
        points: [
          '**Serviços integrados**: Elastic Load Balancing, CloudFront, API Gateway, App Runner, Amplify, Elastic Beanstalk e a inspeção TLS do Network Firewall.',
          '**Regra do CloudFront**: o certificado precisa ser solicitado ou importado em US East (N. Virginia), `us-east-1`.',
          '**Regional**: certificados não podem ser copiados entre Regiões. Solicite um em cada Região onde houver um load balancer usando.',
          '**Renovação gerenciada**: automática para certificados validados por DNS e em uso. Certificados importados não são renovados pelo ACM, então acompanhe a expiração.',
          '**No EC2**: use o protocolo ACME para certificados publicamente confiáveis nos seus servidores. Um certificado gerenciado pelo ACM numa instância exige Nitro Enclaves.',
        ],
        tip: '"HTTPS no CloudFront com domínio próprio": **certificado do ACM em us-east-1**. "Evitar indisponibilidade por certificado vencido": **certificado do ACM validado por DNS**, não um importado.',
      },
      {
        id: 'secrets',
        name: 'Segredos e parâmetros',
        link: pt.aws('secrets-manager/'),
        summary:
          'Tire as credenciais do código. O Secrets Manager gira segredos automaticamente, e o Parameter Store guarda configurações e valores criptografados simples.',
        points: [
          '**Secrets Manager**: segredos criptografados com KMS e rotação automática, por managed rotation ou por uma função Lambda de rotação, com integrações nativas com bancos de dados.',
          '**Replicação**: segredos réplica em outras Regiões, e a rotação do segredo primário se propaga para eles.',
          '**Parameter Store**: parâmetros `String`, `StringList` e `SecureString` (criptografado com KMS) em hierarquias, sem rotação de credenciais.',
          '**Camadas**: a standard é gratuita, com 10.000 parâmetros de até 4 KB. A advanced permite 100.000 parâmetros de até 8 KB, parameter policies e compartilhamento entre contas, com cobrança.',
          '**Custo**: o Secrets Manager cobra por segredo por mês e por chamada de API.',
        ],
        tip: '"A senha do banco precisa girar automaticamente": **Secrets Manager**. "Guardar IDs de AMI ou valores de configuração gastando pouco": **Parameter Store**.',
      },
      {
        id: 'threat-detection',
        name: 'Serviços de detecção',
        link: pt.aws('products/security/'),
        summary:
          'Serviços gerenciados que encontram ameaças, vulnerabilidades e dados sensíveis, e depois agregam e investigam os findings.',
        points: [
          '**GuardDuty**: detecção de ameaças a partir de eventos de gerenciamento do CloudTrail, VPC Flow Logs e logs de DNS, sem você precisar ativar esses logs. Planos de proteção acrescentam S3, EKS, runtime, malware, RDS e Lambda.',
          '**Inspector**: varredura contínua de instâncias EC2, imagens de contêiner no ECR e funções Lambda em busca de vulnerabilidades de software e exposição de rede não intencional.',
          '**Macie**: descobre dados sensíveis, como PII, no S3 com machine learning e correspondência de padrões, e aponta problemas de bucket como acesso público.',
          '**Security Hub CSPM**: verifica as contas contra padrões como AWS Foundational Security Best Practices e CIS, e agrega findings do GuardDuty, do Inspector e do Macie. A maioria dos controles exige o AWS Config.',
          '**Detective**: monta um behavior graph com CloudTrail, VPC Flow Logs e findings do GuardDuty para investigar a causa raiz.',
        ],
        tip: '"Encontrar PII no S3": **Macie**. "Credenciais comprometidas ou mineração de cripto": **GuardDuty**. "CVEs no EC2 ou em imagens de contêiner": **Inspector**. "Visão única da postura de conformidade": **Security Hub**. "Causa raiz de um finding": **Detective**.',
        table: {
          title: 'Qual serviço responde o quê',
          head: ['Serviço', 'Pergunta típica'],
          rows: [
            { key: 'GuardDuty', cells: ['Está acontecendo algo malicioso nas minhas contas?'] },
            { key: 'Inspector', cells: ['Quais workloads têm vulnerabilidades conhecidas?'] },
            { key: 'Macie', cells: ['Onde estão os dados sensíveis no S3?'] },
            { key: 'Security Hub CSPM', cells: ['Minhas contas seguem as boas práticas de segurança?'] },
            { key: 'Detective', cells: ['O que causou este finding e o que ele atingiu?'] },
          ],
        },
      },
      {
        id: 'retention-locks',
        name: 'Retenção WORM',
        link: pt.docs('AmazonS3/latest/userguide/object-lock.html'),
        summary:
          'Armazenamento imutável para retenção regulatória e proteção contra ransomware, no nível de objeto, de vault ou de backup.',
        points: [
          '**S3 Object Lock**: write once, read many por versão de objeto, e exige versionamento. Use períodos de retenção ou legal holds, que não expiram e valem até serem removidos.',
          '**Modo governance**: usuários com `s3:BypassGovernanceRetention` podem contornar o bloqueio. Bom para testar configurações de retenção.',
          '**Modo compliance**: nenhum usuário, nem o root, pode apagar a versão ou encurtar a retenção até que ela expire.',
          '**Glacier Vault Lock**: uma vault lock policy que fica imutável quando você conclui o bloqueio dentro de 24 horas. O serviço original de vaults não aceita mais clientes novos, então projetos novos usam Object Lock com as classes de armazenamento S3 Glacier.',
          '**AWS Backup Vault Lock**: modo governance ou compliance para backup vaults. No modo compliance o vault fica imutável depois de um período de carência de no mínimo 72 horas.',
        ],
        tip: '"Registros que ninguém, nem administradores, pode apagar por 7 anos": **S3 Object Lock em modo compliance**. O modo governance ainda deixa usuários privilegiados com a permissão de bypass removerem dados.',
      },
      {
        id: 'artifact',
        name: 'AWS Artifact',
        link: pt.aws('artifact/'),
        summary: 'Portal self-service com os relatórios de conformidade e os acordos da AWS, sem custo.',
        points: [
          '**Relatórios**: baixe relatórios SOC, certificações ISO e documentos PCI DSS que mostram aos auditores os controles que a AWS opera.',
          '**Acordos**: revise, aceite e acompanhe acordos com a AWS para uma conta ou para todas as contas da organização.',
          '**Responsabilidade compartilhada**: o Artifact cobre a conformidade da AWS. A conformidade dos seus workloads continua sendo documentada por você.',
          '**Fornecedores do Marketplace**: documentos de segurança e conformidade de ISVs que vendem no AWS Marketplace também estão disponíveis.',
        ],
        tip: '"Um auditor pede o relatório SOC ou o atestado PCI da AWS": **AWS Artifact**. O AWS Config e o AWS Audit Manager avaliam os seus próprios recursos.',
      },
    ],
  },
]
