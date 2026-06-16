# my-cdk-app

A small AWS CDK TypeScript project that deploys:

- an S3 bucket for file storage (`DataStack`)
- a Lambda-backed REST API with `/download` and `/upload` endpoints (`LambdaAPIStack`)
- a Lambda Function URL with unauthenticated access

The Lambda function reads and writes objects to the S3 bucket using the AWS SDK v3.

## Architecture

- `bin/my-cdk-app.ts` bootstraps two stacks in `us-east-1`.
- `lib/cdk-s3-node.ts` creates an S3 bucket and exports its name as `ShareBucketName`.
- `lib/cdk-lambda-node.ts` imports the bucket name and creates a `NodejsFunction`.
- `lib/lambda/nodeLambda.ts` handles HTTP GET and POST requests:
  - `GET` returns a simple health response
  - `POST` expects a JSON body with `file` (base64), `filename`, and optional `contentType`

## Prerequisites

- Node.js 18+ (or compatible runtime)
- pnpm
- AWS CLI configured with credentials for your target AWS account
- AWS CDK installed globally or via project scripts

## Setup

```bash
cd CDK/my-cdk-app
pnpm install
```

## Tests

```bash
pnpm run test
```

The included Jest tests validate Lambda behavior for:

- GET requests
- POST uploads with file content
- missing filename / contentType defaults
- malformed JSON handling
- S3 upload failures

## CDK commands

Use the CDK Toolkit from the project root:

```bash
npx cdk synth
npx cdk diff
npx cdk deploy
```

## Deployment configuration

`bin/my-cdk-app.ts` currently sets `region: us-east-1` and `account: 000000000000` for both stacks. Update these values to your AWS account and region before deploying.

If you want to deploy to a different region or account, change the `env` block in `bin/my-cdk-app.ts`.

## Usage

After deploying, the Lambda-backed REST API exposes two resources:

- `GET /download`
- `POST /upload`

The Lambda Function URL is also created with no auth, allowing direct function invocation.

### Example POST payload

```json
{
  "file": "<base64-encoded-content>",
  "filename": "example.txt",
  "contentType": "text/plain"
}
```

### Example response

```json
{
  "msg": "Uploaded"
}
```

## Notes

- The S3 bucket is configured with `RemovalPolicy.DESTROY` and `autoDeleteObjects: true`, so the bucket and contents will be removed when the stack is destroyed.
- The Lambda function uses `Runtime.NODEJS_LATEST` and `NodejsFunction` from `aws-lambda-nodejs`.
- The app currently imports the bucket by export name rather than creating a direct CDK construct reference.
