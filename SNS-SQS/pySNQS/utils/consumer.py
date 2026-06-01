import boto3
from mypy_boto3_sqs import SQSClient
import json
import time

sqs: SQSClient = boto3.client(
    "sqs",
    region_name="us-east-1",
    aws_access_key_id="test",
    aws_secret_access_key="test",
)

SQS_QUEUE_URL = "http://localhost:4566/000000000000/my-sqs"


def consume_message():

    while True:

        response = sqs.receive_message(
            QueueUrl=SQS_QUEUE_URL, MaxNumberOfMessages=3, WaitTimeSeconds=2
        )

        msgs = response.get("Messages", [])
        for msg in msgs:
            body = json.loads((msg["Body"]))
            sns_msg = json.loads(body["Message"])
            print("Processed Message: ", sns_msg)
            sqs.delete_message(
                QueueUrl=SQS_QUEUE_URL, ReceiptHandle=msg["ReceiptHandle"]
            )
        time.sleep(2)


try:
    consume_message()
except KeyboardInterrupt:
    print("\nExiting...")
