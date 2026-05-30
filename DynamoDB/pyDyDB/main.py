import boto3
from mypy_boto3_dynamodb.service_resource import Table
from boto3.dynamodb.conditions import Key
import time
import random
import uuid
from datetime import datetime
from decimal import Decimal
import json

table: Table = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id="test",
    aws_secret_access_key="test",
).Table("AppTable")


def random_data(limit=10):
    items = []
    for i in range(limit):
        items.append(
            {
                "PK": f"USER#{i}",
                "SK": f"ORDER#{uuid.uuid4()}",
                "status": random.choice(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
                "amount": Decimal(str(round(random.uniform(10, 1000), 2))),
                "createdAt": datetime.now().isoformat(),
            }
        )
    return items


def sanitize(obj):
    if isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize(v) for v in obj]
    elif isinstance(obj, Decimal):
        return float(obj)  # or str(obj)
    return obj


LIMIT = 1000
Items = random_data(LIMIT)

print(f"Limit: {LIMIT}")
print("Inserting Into Table ...")
start = time.perf_counter()
for i in range(LIMIT - 1):
    table.put_item(
        Item=Items[i],
        ConditionExpression="attribute_not_exists(PK) AND attribute_not_exists(SK)",
    )
end = time.perf_counter()
print(f"Total Time for Insertion: {(end - start):.6f} seconds")

print("Sample Response: ")
response = table.put_item(
    Item=Items[LIMIT - 1],
    ConditionExpression="attribute_not_exists(PK) AND attribute_not_exists(SK)",
)
print(json.dumps(response, indent=2))

print("Sleeping for 5s .....")
time.sleep(5)

print("Querying from Table ...")
start = time.perf_counter()
for _ in range(LIMIT):
    table.query(KeyConditionExpression=Key("PK").eq(f"USER#{random.randint(0,LIMIT)}"))

stop = time.perf_counter()

print(f"Total Time for Querying: {(stop - start):.6f} seconds")

print(f"Sample Response:")
response = table.query(KeyConditionExpression=Key("PK").eq(f"USER#{LIMIT-1}"))
print(json.dumps(sanitize(response), indent=2))

print("Deleting from Table ...")
start = time.perf_counter()
for i in range(LIMIT):
    table.delete_item(
        Key={"PK": f"USER#{i}", "SK": Items[i]["SK"]},
        ConditionExpression="attribute_exists(PK) AND attribute_exists(SK)",
    )
end = time.perf_counter()
print(f"Total Time for Deletion: {(end - start):.6f} seconds")
