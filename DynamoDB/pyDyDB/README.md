# DynamoDB in Floci

## Export Path

`export AWS_ENDPOINT_URL=http://localhost:4566`

## Create A Table

```bash
aws dynamodb create-table \                      
--table-name AppTable \
--attribute-definitions \
AttributeName=PK,AttributeType=S \
AttributeName=SK,AttributeType=S \
--key-schema \
AttributeName=PK,KeyType=HASH \
AttributeName=SK,KeyType=RANGE \
--billing-mode PAY_PER_REQUEST
```

### What it means

```bash
--attribute-definitions
  AttributeName=PK,AttributeType=S
  AttributeName=SK,AttributeType=S
```

These are the attributes (columns) that will be used as keys, and their data types.

**Breakdown:**
PK → Partition Key
SK → Sort Key
AttributeType = S > String type

**DynamoDB data types:**
S → String
N → Number
B → Binary

So here:

PK is a string
SK is a string

```bash
--key-schema
  AttributeName=PK,KeyType=HASH
  AttributeName=SK,KeyType=RANGE
```

This defines how the primary key works.

🧩 HASH = Partition Key (PK)
AttributeName=PK,KeyType=HASH

This is the main key used to distribute and locate data.

**What it does:**

Decides which physical partition data goes to
Required for every query
Must be provided in every item

Example:

PK = USER#1

RANGE = Sort Key (SK)
`AttributeName=SK,KeyType=RANGE`

This is used to sort and group items under the same partition key. Allows multiple items under same PK
Enables range queries (>, <, begins_with, etc.)

Example:

```sql
PK = USER#1
SK = ORDER#1001
SK = ORDER#1002
```
