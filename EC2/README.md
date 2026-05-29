# EC2 on Floci

## First export default AWS url

`export AWS_ENDPOINT_URL=http://localhost:4566`

## Generate SSH key pairs

```bash
ssh-keygen -t rsa -b 4096 -f ./key-pair/my-key -N ""
chmod 400 key-pair/my-key 
```

## Import an SSH key pair for injection at launch

```bash
aws ec2 import-key-pair \
--key-name my-key \
--public-key-material fileb://./key-pair/my-key.pub
```

## Launch a real Docker container instance with UserData

The `Execute-at-Start.sh` starts at **Pending** state. In this file we only start a nginx which we can access via port forwarding with SSH

```bash
aws ec2 run-instances \
--image-id ami-amazonlinux2023 \
--instance-type t2.micro \
--key-name my-key 
--user-data fileb://Execute-at-Start.sh
```

## Launch with an IAM instance profile (credentials served via IMDS)

```bash
aws ec2 run-instances \
--image-id ami-amazonlinux2023 \
--instance-type t2.micro \
--iam-instance-profile Arn=arn:aws:iam::000000000000:instance-profile/my-app-role 
```

## Describe running instances

```bash
aws --profile floci ec2 describe-instances \
--query 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress,State.Name]' \
--output table 
```

We can also add it to `watch` to see real time change

## SSH into EC2

`ssh -i ./key-pair/my-key root@localhost -p 2200`

To see Nginx, we can port forward by add `-L 8080:localhost:80` at the end of the command and open `http:\\localhost:8080`.

## Stop and start an instance

```bash
aws ec2 stop-instances --instance-ids i-XXXXX 
aws ec2 start-instances --instance-ids i-XXXXX 
```

## Terminate an instance after 1hour it will purge from the list

```bash
aws ec2 terminate-instances --instance-ids i-XXXXX 
```

## Create a VPC and subnet

```bash
aws ec2 create-vpc --cidr-block 10.0.0.0/16 
aws ec2 create-subnet --vpc-id vpc-XXXXX --cidr-block 10.0.1.0/24 
```

## Create and configure a security group

```bash
aws ec2 create-security-group \
--group-name my-sg \
--description "My security group" \
--vpc-id vpc-XXXXX 

aws ec2 authorize-security-group-ingress \
--group-id sg-XXXXX \
--protocol tcp \
--port 22 \
--cidr 0.0.0.0/0
```

## Allocate and associate an Elastic IP

```bash
aws ec2 allocate-address --domain vpc 
aws ec2 associate-address \
--allocation-id eipalloc-XXXXX \
--instance-id i-XXXXX 
```
