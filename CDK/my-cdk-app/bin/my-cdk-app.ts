#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { LambdaAPIStack } from "../lib/cdk-lambda-node";
import { DataStack } from "../lib/cdk-s3-node";
const app = new cdk.App();
const s3Stack = new DataStack(app, "S3Stack", {
	env: {
		region: "us-east-1",
		account: "000000000000",
	},
});
new LambdaAPIStack(app, "LambdaAPIStack", {
	env: {
		region: "us-east-1",
		account: "000000000000",
	},
});
