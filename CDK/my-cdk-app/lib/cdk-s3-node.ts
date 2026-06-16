import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as rds from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export class DataStack extends Stack {
	public readonly bucket: s3.Bucket;
	public readonly db: rds.DatabaseInstance;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);
		// const vpc = new ec2.Vpc(this, "DB_VPC");
		this.bucket = new s3.Bucket(this, "FileStorage", {
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
		});

		new cdk.CfnOutput(this, "BucketNameOutput", {
			value: this.bucket.bucketName,
			exportName: "ShareBucketName",
		});
		// this.db = new rds.DatabaseInstance(this, "FileUploadLogs", {
		// engine: rds.DatabaseInstanceEngine.postgres({
		// version: rds.PostgresEngineVersion.VER_16,
		// }),
		// vpc,
		// allocatedStorage: 20,
		// databaseName: "uploads",
		// credentials: rds.Credentials.fromGeneratedSecret("postgres"),
		// });
	}
}
