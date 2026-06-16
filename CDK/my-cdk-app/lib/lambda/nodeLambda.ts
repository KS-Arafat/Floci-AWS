/// <reference types="node" />
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
	region: "us-east-1",
	forcePathStyle: true,
});

const handler = async (event: any) => {
	const method = event.httpMethod || event.requestContext?.http?.method;

	switch (method) {
		case "GET":
			return getHandler();

		case "POST":
			return postHandler(event);

		default:
			return {
				statusCode: 405,
				body: "Method Not Allowed",
			};
	}
};

function getHandler() {
	return {
		statusCode: 200,
		body: JSON.stringify({ msg: "GET OK" }),
	};
}

async function postHandler(event: any) {
	try {
		const body = JSON.parse(event.body || "{}");
		if (!body.file)
			return {
				statusCode: 200,
				body: JSON.stringify({ msg: "POST OK but need content", body }),
			};
		const fileContent = Buffer.from(body.file, "base64");
		const fileName = body.filename || `file-${Date.now()}`;
		await s3.send(
			new PutObjectCommand({
				Bucket: process.env.BUCKET_NAME,
				Key: fileName,
				Body: fileContent,
				ContentType: body.contentType || "application/octet-stream",
			}),
		);
		return {
			statusCode: 200,
			body: JSON.stringify({ msg: "Uploaded" }),
		};
	} catch (e) {
		console.error(e);

		return {
			statusCode: 500,
			body: JSON.stringify({
				msg: "Upload failed",
				error: e instanceof Error ? e.message : String(e),
			}),
		};
	} finally {
	}
}

export { handler };
