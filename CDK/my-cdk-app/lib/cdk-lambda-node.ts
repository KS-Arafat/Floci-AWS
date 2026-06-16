import { Fn, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { FunctionUrlAuthType, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class LambdaAPIStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const bucket = Bucket.fromBucketName(
			this,
			"ImportedBucket",
			Fn.importValue("ShareBucketName"),
		);
		const NodeLambdaFunction = new NodejsFunction(this, "NodeLambda", {
			entry: "lib/lambda/nodeLambda.ts",
			handler: "handler",
			memorySize: 128,
			runtime: Runtime.NODEJS_LATEST,
			environment: {
				BUCKET_NAME: bucket.bucketName,
			},
		});
		bucket.grantReadWrite(NodeLambdaFunction);

		const apigateway = new LambdaRestApi(this, "lambdaRestApi", {
			handler: NodeLambdaFunction,
			proxy: false,
			restApiName: "MyRestApi",
		});

		const download = apigateway.root.addResource("download");
		const upload = apigateway.root.addResource("upload");
		download.addMethod("GET", new LambdaIntegration(NodeLambdaFunction));

		upload.addMethod("POST", new LambdaIntegration(NodeLambdaFunction));

		NodeLambdaFunction.addFunctionUrl({
			authType: FunctionUrlAuthType.NONE,
		});
	}
}
