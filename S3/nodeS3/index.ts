/// <reference types="node" />
import {
	CopyObjectCommand,
	CreateBucketCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	ListBucketsCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import * as fs from "fs";

const createDummyDumpFile = async (
	filePath: string,
	sizeMB = 50,
): Promise<void> => {
	const chunkSize = 1024 * 1024;
	const chunk = Buffer.alloc(chunkSize, 0);
	const stream = fs.createWriteStream(filePath);

	for (let i = 0; i < sizeMB; i++) {
		if (!stream.write(chunk)) {
			await new Promise<void>((resolve) => stream.once("drain", resolve));
		}
	}

	stream.end();
	await new Promise<void>((resolve, reject) => {
		stream.on("finish", resolve);
		stream.on("error", reject);
	});
};

const s3 = new S3Client({
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test",
	},
	endpoint: "http://localhost:4566",
});

const BucketList = await s3.send(new ListBucketsCommand());

console.log("Bucket List:", BucketList.Buckets);

try {
	await s3.send(
		new CreateBucketCommand({
			Bucket: "nodebuck1",
		}),
	);

	await s3.send(
		new CreateBucketCommand({
			Bucket: "nodebuck2",
		}),
	);
	console.log("Buckets created successfully");
} catch (error) {
	console.error("Error creating bucket");
}

await createDummyDumpFile("./dump.tmp");

await s3.send(
	new PutObjectCommand({
		Bucket: "nodebuck1",
		Key: "dump.tmp",
		Body: fs.createReadStream("./dump.tmp"),
	}),
);

console.log("File uploaded successfully");

await s3.send(
	new CopyObjectCommand({
		Bucket: "nodebuck2",
		CopySource: "/nodebuck1/dump.tmp",
		Key: "dump_copy.tmp",
	}),
);

console.log("File copied successfully");

await s3.send(
	new DeleteObjectCommand({
		Bucket: "nodebuck1",
		Key: "dump.tmp",
	}),
);

console.log("File deleted successfully");

const res = await s3.send(
	new GetObjectCommand({
		Bucket: "nodebuck2",
		Key: "dump_copy.tmp",
	}),
);

const total = res.ContentLength || 0;
let downloaded = 0;

const file = fs.createWriteStream("download.tmp");

if (res.Body) {
	const body = res.Body as NodeJS.ReadableStream;
	body.on("data", (chunk) => {
		downloaded += chunk.length;
		process.stdout.write(
			`\rDownloading ${((downloaded / total) * 100).toFixed(1)}%`,
		);
	});

	body.pipe(file);

	file.on("finish", () => {
		console.log("\nDone");
	});
}
console.log("File retrieved successfully");
