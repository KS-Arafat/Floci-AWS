def lambda_handler(event, context):
    name = event.get("name", "No Name")
    return {"statusCode": 200, "body": f"Hello, {name}!", "context": str(context)}
