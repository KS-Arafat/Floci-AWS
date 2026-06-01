# SNS - SQS

`export AWS_ENDPOINT_URL=http://localhost:4566`

## ***SNS***: Simple Notification Service

SNS is a fully managed pub/sub messaging service for pushing notifications to multiple subscribers (HTTP/S endpoints, email, SMS, Lambda, SQS, etc.). Publishers send messages to an SNS topic, and SNS fan-outs those messages to all subscribed endpoints.

## ***SQS***: Simple Queue Service

SQS is a fully managed message queuing service that decouples producers and consumers. Producers send messages to a queue, and consumers poll the queue to process messages at their own pace (supports standard and FIFO queues).

## Connecting SNS and SQS

- Create an SQS queue and an SNS topic.
- Subscribe the SQS queue to the SNS topic (in the SNS console or via AWS CLI/SDK). This creates a subscription and sets the queue as an endpoint.
- Configure the SQS queue policy to allow the SNS topic to send messages to the queue (usually an IAM policy statement granting sns:Publish from the topic ARN).
- Publish messages to the SNS topic; SNS will deliver copies to the subscribed SQS queue(s). Consumers then poll the SQS queue to retrieve and process messages.

This setup gives fan-out delivery with durable queuing, allowing multiple subscribers and reliable processing.

## Floci Demo

```bash
aws sns create-topic --name my-sns
aws sqs create-queue --queue-name my-sqs
```

First one returns **TopicArn** and second one returns **QueueUrl**

```bash
aws sqs get-queue-attributes \
  --queue-url {QueueUrl} \
  --attribute-names QueueArn
```

This will give **QueueArn**.

```bash
aws sns subscribe \
  --topic-arn {TopicArn} \
  --protocol sqs \
  --notification-endpoint {QueueArn}
```

Now SNS SQS are Connected.

## Test

### Python

Now run `producer.py` and `consumer.py` in `utils` separately. Enter messages to publish in `producer.py` and see them being consumed in `consumer.py`. You can run multiple instances of `consumer.py` to see how messages are distributed among consumers.

### TypeScript

Run `pnpm run publish` and `pnpm run consume` in different shells. Enter messages to publish in `publisher` and see them being consumed in `consumer`. You can run multiple instances of `consumer` to see how messages are distributed among consumers.
