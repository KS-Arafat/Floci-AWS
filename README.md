# aws-floci

[![Docker Compose](https://img.shields.io/badge/docker%20compose-%2332495E.svg?logo=docker&logoColor=white)](docker-compose.yml)
[![Docker](https://img.shields.io/badge/docker-%232496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![floci](https://img.shields.io/badge/floci-local-orange?logo=docker)](https://floci.io/)
[![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-%23000000.svg?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![uv](https://img.shields.io/badge/uv-latest-lightgrey)](https://github.com/astral-sh/uv)
[![Python](https://img.shields.io/badge/python-3.x-blue?logo=python)](https://www.python.org/)

[![AWS Local](https://img.shields.io/badge/AWS-local-orange?logo=amazonaws&logoColor=white)](./.)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-%234B8BBE.svg?logo=amazon-dynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![S3](https://img.shields.io/badge/S3-%234B8BBE.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/s3/)
[![SNS](https://img.shields.io/badge/SNS-%234B8BBE.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/sns)
[![SQS](https://img.shields.io/badge/SQS-%234B8BBE.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/sqs)
[![Lambda](https://img.shields.io/badge/Lambda-%234B8BBE.svg?logo=aws%20lambda&logoColor=white)](https://aws.amazon.com/lambda)
[![EC2](https://img.shields.io/badge/EC2-%234B8BBE.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/ec2)
[![ECS](https://img.shields.io/badge/ECS-%234B8BBE.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/ecs)
[![EKS](https://img.shields.io/badge/EKS-%234B8BBE.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/eks)
[![RDS](https://img.shields.io/badge/RDS-%234B8BBE.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/rds)
[![ElastiCache](https://img.shields.io/badge/ElastiCache-%234B8BBE.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/elasticache)
[![Terraform](https://img.shields.io/badge/Terraform-%235B4BBE.svg?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Infrastructure as Code](https://img.shields.io/badge/Infrastructure%20as%20Code-%235B4BBE.svg?logo=terraform&logoColor=white)](https://www.terraform.io/)

This repository contains small example projects and helper scripts that demonstrate how to work with various AWS services locally using the floci Local AWS stack image. It is organized by service and contains both Node (TypeScript/JavaScript) and Python examples where applicable.

Quick links

- [docker-compose.yml](docker-compose.yml) — runs the floci local AWS stack image used by examples.
- [mise.toml](mise.toml) — tool/runtime hints for the repository.

Repository layout

- **DynamoDB/** — Examples showing how to interact with DynamoDB.
  - [DynamoDB/nodeDyDB/index.ts](DynamoDB/nodeDyDB/index.ts#L1) (TypeScript)
  - [DynamoDB/pyDyDB/main.py](DynamoDB/pyDyDB/main.py#L1) (Python)

- **EC2/** — Scripts and key-pair artifacts for EC2-related experiments.
  - [EC2/Execute-at-Start.sh](EC2/Execute-at-Start.sh#L1)
  - [EC2/key-pair/my-key.pub](EC2/key-pair/my-key.pub#L1)

- **lambda/** — Lambda handler examples and test payloads.
  - [lambda/handler.py](lambda/handler.py#L1) (Python)
  - [lambda/index.js](lambda/index.js#L1) (Node)
  - [lambda/payload.json](lambda/payload.json#L1) — example invocation payload

- **S3/** — S3 example projects for Node and Python.
  - [S3/nodeS3/index.ts](S3/nodeS3/index.ts#L1) (TypeScript)
  - [S3/pyS3/main.py](S3/pyS3/main.py#L1) (Python)

- **SNS-SQS/** — Publisher/consumer examples for SNS+SQS.
  - [SNS-SQS/tsSNQS/index.ts](SNS-SQS/tsSNQS/index.ts#L1) (TypeScript)
  - [SNS-SQS/pySNQS/main.py](SNS-SQS/pySNQS/main.py#L1) (Python)

- **ECS/**, **EKS/**, **ElasticCache/**, **RDS/**, **Terraform/** — placeholders and workspace folders for related experiments and infra code.

How to use

1. Start the local AWS stack (floci) via Docker Compose:

    ```bash
    docker compose up -d
    ```

    This uses the repository `docker-compose.yml` which exposes the floci endpoints on the host (default: `http://localhost:4566`).

2. Point AWS SDKs / CLIs to the local endpoint. For many examples the environment variable `AWS_ENDPOINT_URL` is used, for example:

    ```bash
    export AWS_ENDPOINT_URL=http://localhost:4566
    ```

3. Run the specific example you want:

- Node (TypeScript) projects use pnpm/Node. Example (from a package folder):

```bash
cd SNS-SQS/tsSNQS
pnpm install
pnpm start
```

- Python projects use the venv/pyproject configuration. Example:

```bash
cd SNS-SQS/pySNQS
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt  # or use pyproject tooling
python main.py
```

Notes and conventions

- Examples are intentionally minimal and focused on demonstrating API calls and local testing against floci/localstack.
- Where both Node and Python variants exist, names follow `node*` and `py*` folder prefixes.
- If you add new examples, include a short README in that folder describing how to run it.

Useful files

- [docker-compose.yml](docker-compose.yml)
- [mise.toml](mise.toml)

Next steps

- Start floci with `docker compose up -d` and run any example folder to try local AWS interactions.

Contributing

- Open an issue or submit a PR with additional examples, fixes, or documentation improvements.

License

- This repository does not include a license file; add one if you plan to share publicly.
