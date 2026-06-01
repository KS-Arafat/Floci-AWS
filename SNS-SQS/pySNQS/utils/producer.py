import boto3
import time
from mypy_boto3_sns import SNSClient
import json
import random

sns: SNSClient = boto3.client(
    "sns",
    region_name="us-east-1",
    aws_access_key_id="test",
    aws_secret_access_key="test",
)

SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:000000000000:my-sns"


def publish_message(count: int = 5):
    for i in range(count):
        msg = {
            "event": "User Created",
            "userId": random.randint(1000, 9999),
            "email": f"user{i}@test.com",
        }
        response = sns.publish(TopicArn=SNS_TOPIC_ARN, Message=json.dumps(msg))
        # print(f"SNS Response {i}: ")
        # print(json.dumps(response, indent=2))


while True:
    try:
        count = input("Enter Number of publish messages: ")
        if count.isdigit():
            publish_message(int(count))
        else:
            print("Please enter a valid number.")
    except KeyboardInterrupt:
        print("\nExiting...")
        break
    time.sleep(2)
