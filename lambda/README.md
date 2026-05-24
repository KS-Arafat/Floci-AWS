# Lambda on floci

See Available Images for lambda

`https://gallery.ecr.aws/lambda/`

## Python

Generate function.zip

```bash
zip function.zip handler.py
```

Create Lambda function:

```bash
aws --profile floci lambda create-function \
    --function-name python-lambda \
    --runtime python3.13.x \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler handler.lambda_handler \
    --zip-file fileb://function.zip
```

Update Lambda Function:

```bash
aws --profile floci lambda update-function-code \
    --function-name python-lambda \
    --zip-file fileb://function.zip 
```

Invoke Lambda Function

```bash
aws --profile floci lambda invoke \
--function-name python-lambda \
--payload file://payload.json \ 
--cli-binary-format raw-in-base64-out \
response.json
```

See all the Lambda Function:

```bash
aws --profile floci lambda list-functions --output table --query "Functions[].FunctionName"
```

## JavaScript

Generate function.zip

```bash
zip function.zip index.js
```

Create Lambda function:

```bash
aws --profile floci lambda create-function \
    --function-name node-lambda \
    --runtime nodejs22.x \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler index.handler \
    --zip-file fileb://function.zip
```

Update Lambda Function:

```bash
aws --profile floci lambda update-function-code \
    --function-name node-lambda\
    --zip-file fileb://function.zip 
```

Invoke Lambda Function

```bash
aws --profile floci lambda invoke \
--function-name node-lambda \
--payload file://payload.json \ 
--cli-binary-format raw-in-base64-out \
response.json
```
