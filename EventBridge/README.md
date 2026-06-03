# EventBridge

## Why use EventBridge vs SNS

- EventBridge is an event bus and router for applications and AWS services; SNS is a pub/sub topic service.
- Use EventBridge when you need rule-based routing, content-based filtering, cross-account or SaaS event ingestion, or schema discovery.
- Use SNS for simple fan-out messaging to multiple subscribers (HTTP/S, Lambda, SQS, email, SMS) when message filtering and complex routing are not required.

**Key differences:**

- Routing & filtering: EventBridge supports detailed content-based rules and transformations; SNS has basic message attribute filtering.
- Event sources: EventBridge natively integrates many AWS services and third-party SaaS partners; SNS is primarily a messaging endpoint.
- Schema registry: EventBridge can discover and store event schemas for development tooling; SNS does not.
- Cross-account & cross-region routing: EventBridge has built-in support for sending events across accounts and regions with fine-grained rules.

## EventBridge Commands

Create a new event bus `aws events create-event-bus --name my-bus`.
List event buses `aws events list-event-buses`.

### Rules/Filters

```bash
aws events put-rule \
--name my-rule \
--event-bus-name my-bus \
--event-pattern '{
"source": [order.app],
"detail-type": ["OrderCreated","OrderDeleted"]
}' \
--state ENABLED
```

`--event-pattern` add rules to it, and it will filter out any events that doesn't match them.
**source: "order.app"** and **detail-type": "OrderCreated","OrderDeleted"** should exist in the event json.

Source can be

- aws.ec2
- aws.s3
- aws.lambda
- aws.ecs

```bash
aws events describe-rule \     
--name my-rule \
--event-bus-name my-bus
```

Describe Rules

```bash
aws events [enable-rule/disable-rule/delete-rule] \  
--name my-rule \
--event-bus-name my-bus
```

Enable/Disable/Delete Rule

#### Now we have to create service to get event, we use SQS

### We'll test eventbridge with SQS

Create SQS and Event Listener with Python in `./Event-SQS`.

```bash
aws sqs create-queue --queue-name my-event-sqs
aws sqs get-queue-url --queue-name my-event-sqs

aws sqs get-queue-attributes \                 
--queue-url "http://localhost:4566/000000000000/my-event-sqs" \
--attribute-names QueueArn
```

Now add SQS as target of EventBridge

```bash
aws events put-targets \
--event-bus-name my-bus  --rule my-rule \
--targets '[
{
 "Id": "OrderQueue",
 "Arn": "arn:aws:sqs:us-east-1:000000000000:my-event-sqs"
}
]'
```

#### Now run `./Event-SQS/main.py` on separate terminal

### Eject Event

```bash
aws events put-events --entries '[           
{
    "EventBusName": "my-bus",
    "Source": "order.app",
    "DetailType": "OrderCreated",
    "Detail": "{\"orderId\":\"123\",\"amount\":500}"
  }
]'
```

#### **NB: Body must contain these fields as given also case sensitive**
