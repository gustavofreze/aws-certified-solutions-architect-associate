# AWS Certified Solutions Architect - Associate

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

* [Overview](#overview)
    - [Topics](#topics)
    - [Other certifications](#other-certifications)
* [Installation](#installation)
    - [Repository](#repository)
    - [Configuration](#configuration)
    - [Tests](#tests)
    - [Review](#review)
    - [Maintenance](#maintenance)
* [Environment setup](#environment-setup)
    - [Access URLs](#access-urls)
* [Deployment](#deployment)

## Overview

Study notes for the [AWS Certified Solutions Architect - Associate](https://aws.amazon.com/certification/certified-solutions-architect-associate/)
exam (SAA-C03), in English and Portuguese, published at
[gustavofreze.github.io/aws-certified-solutions-architect-associate](https://gustavofreze.github.io/aws-certified-solutions-architect-associate/).
The notes follow the domains of the official exam guide and link to the AWS documentation of every service they cover.

### Topics

- Foundations: the exam format, the Well-Architected Framework and the global infrastructure.
- Design secure architectures (30%): identity and access, multiple accounts, network security and data protection.
- Design resilient architectures (26%): decoupling, high availability and disaster recovery.
- Design high-performing architectures (24%): storage, compute, serverless and containers, databases, networking,
  edge and DNS, data ingestion and analytics.
- Design cost-optimized architectures (20%): compute, storage and network costs, and the cost management tools.
- Resources: official exam material, whitepapers and documentation.

### Other certifications

| Certification                    | Site                                                                     | Repository                                                                     |
|:---------------------------------|:-------------------------------------------------------------------------|:-------------------------------------------------------------------------------|
| AWS Certified Cloud Practitioner | [Site](https://gustavofreze.github.io/aws-certified-cloud-practitioner/) | [Repository](https://github.com/gustavofreze/aws-certified-cloud-practitioner) |

## Installation

### Repository

To clone the repository using the command line, run:

```bash
git clone https://github.com/gustavofreze/aws-certified-solutions-architect-associate.git
```

### Configuration

To install project dependencies locally, run:

```bash
make configure
```

To start the development server with live reload, run:

```bash
make start
```

To stop the development server, run:

```bash
make stop
```

To build the site and its search index into `dist/`, run:

```bash
make build
```

To serve the built site, search included, as it is published, run:

```bash
make preview
```

### Tests

Run the unit tests:

```bash
make tests
```

Check the script every built page ships against its budget (run after `make build`):

```bash
make budgets
```

### Review

Run the linter, the formatter check and the Astro and TypeScript checks:

```bash
make review
```

Fix linter and formatter issues:

```bash
make fix-review
```

### Maintenance

Remove dependencies and generated artifacts:

```bash
make clean
```

> You can check other available commands by running `make help`.

## Environment setup

### Access URLs

| Environment  | URL                                                                        |
|:-------------|:---------------------------------------------------------------------------|
| `Local`      | http://localhost:4321/aws-certified-solutions-architect-associate/         |
| `Production` | https://gustavofreze.github.io/aws-certified-solutions-architect-associate |

## Deployment

The `CD (Deploy site)` workflow builds the site and publishes it on GitHub Pages. It runs on demand from the Actions tab.
