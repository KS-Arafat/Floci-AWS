/// <reference types="node" />
/// <reference types="jest" />
import { handler } from "../lib/lambda/nodeLambda";
import {
	S3Client,
	PutObjectCommand,
	PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

const s3Mock = mockClient(S3Client);

beforeEach(() => {
	s3Mock.reset();
	process.env.BUCKET_NAME = "test-bucket";
});

describe("Lambda Handler - GET Requests", () => {
	test("should return 200 with GET OK message", async () => {
		const event = {
			httpMethod: "GET",
			requestContext: {
				http: {
					method: "GET",
				},
			},
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({ msg: "GET OK" });
	});

	test("should handle GET request from requestContext", async () => {
		const event = {
			requestContext: {
				http: {
					method: "GET",
				},
			},
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({ msg: "GET OK" });
	});
});

describe("Lambda Handler - POST Requests", () => {
	test("should upload file successfully to S3", async () => {
		const fileContent = "test file content";
		const fileBase64 = Buffer.from(fileContent).toString("base64");

		s3Mock.on(PutObjectCommand).resolves({});

		const event = {
			httpMethod: "POST",
			body: JSON.stringify({
				file: fileBase64,
				filename: "test-file.txt",
				contentType: "text/plain",
			}),
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toEqual({ msg: "Uploaded" });
		const s3Input = s3Mock.call(0).args[0].input as PutObjectCommandInput;
		expect(s3Input.Bucket).toBe("test-bucket");
		expect(s3Input.Key).toBe("test-file.txt");
		expect(s3Input.ContentType).toBe("text/plain");
	});

	test("should use default filename if not provided", async () => {
		const fileContent = "test file content";
		const fileBase64 = Buffer.from(fileContent).toString("base64");

		s3Mock.on(PutObjectCommand).resolves({});

		const event = {
			httpMethod: "POST",
			body: JSON.stringify({
				file: fileBase64,
				contentType: "application/json",
			}),
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(200);
		const s3Input = s3Mock.call(0).args[0].input as PutObjectCommandInput;
		expect(s3Input.Bucket).toBe("test-bucket");
		expect(s3Input.Key).toMatch(/^file-\d+$/);
		expect(s3Input.ContentType).toBe("application/json");
	});

	test("should use default content type if not provided", async () => {
		const fileContent = "test file content";
		const fileBase64 = Buffer.from(fileContent).toString("base64");

		s3Mock.on(PutObjectCommand).resolves({});

		const event = {
			httpMethod: "POST",
			body: JSON.stringify({
				file: fileBase64,
				filename: "test-file",
			}),
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(200);
		const s3Input = s3Mock.call(0).args[0].input as PutObjectCommandInput;
		expect(s3Input.ContentType).toBe("application/octet-stream");
	});

	test("should return 200 when POST has no file content", async () => {
		const event = {
			httpMethod: "POST",
			body: JSON.stringify({
				filename: "test-file.txt",
			}),
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(200);
		const body = JSON.parse(response.body);
		expect(body.msg).toBe("POST OK but need content");
		expect(body.body).toEqual({ filename: "test-file.txt" });
	});

	test("should handle empty POST body", async () => {
		const event = {
			httpMethod: "POST",
			body: JSON.stringify({}),
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(200);
		const body = JSON.parse(response.body);
		expect(body.msg).toBe("POST OK but need content");
	});

	test("should handle S3 upload failure", async () => {
		const fileContent = "test file content";
		const fileBase64 = Buffer.from(fileContent).toString("base64");

		const error = new Error("S3 upload failed");
		s3Mock.on(PutObjectCommand).rejects(error);

		const event = {
			httpMethod: "POST",
			body: JSON.stringify({
				file: fileBase64,
				filename: "test-file.txt",
			}),
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(500);
		const body = JSON.parse(response.body);
		expect(body.msg).toBe("Upload failed");
		expect(body.error).toBe("S3 upload failed");
	});

	test("should handle malformed JSON in POST body", async () => {
		const event = {
			httpMethod: "POST",
			body: "invalid json{",
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(500);
		const body = JSON.parse(response.body);
		expect(body.msg).toBe("Upload failed");
		expect(body.error).toContain("Unexpected token");
	});

	test("should handle null body in POST request", async () => {
		const event = {
			httpMethod: "POST",
			body: null,
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(200);
		const body = JSON.parse(response.body);
		expect(body.msg).toBe("POST OK but need content");
	});
});

describe("Lambda Handler - Unsupported Methods", () => {
	test("should return 405 for unsupported HTTP method", async () => {
		const event = {
			httpMethod: "DELETE",
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(405);
		expect(response.body).toBe("Method Not Allowed");
	});

	test("should return 405 for PUT request", async () => {
		const event = {
			httpMethod: "PUT",
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(405);
		expect(response.body).toBe("Method Not Allowed");
	});

	test("should return 405 for PATCH request", async () => {
		const event = {
			httpMethod: "PATCH",
		};

		const response = await handler(event);

		expect(response.statusCode).toBe(405);
		expect(response.body).toBe("Method Not Allowed");
	});
});
