/// <reference types="node" />
import {
	SQSClient,
	ReceiveMessageCommand,
	DeleteMessageBatchCommand,
} from "@aws-sdk/client-sqs";

import { setTimeout } from "timers/promises";

const sqs = new SQSClient({
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test",
	},
});

const SQS_QUEUE_URL = "http://localhost:4566/000000000000/my-sqs";

async function PollQueue() {
	while (true) {
		const response = await sqs.send(
			new ReceiveMessageCommand({
				QueueUrl: SQS_QUEUE_URL,
				MaxNumberOfMessages: 3,
				WaitTimeSeconds: 2,
			}),
		);
		const msgs = response.Messages || [];

		for (const msg of msgs) {
			if (!msg.Body || !msg.ReceiptHandle) continue;
			const body = JSON.parse(msg.Body);
			const event = JSON.parse(body.Message);
			console.log("Received event:", event);

			// Delete the message after processing
			await sqs.send(
				new DeleteMessageBatchCommand({
					QueueUrl: SQS_QUEUE_URL,
					Entries: [
						{
							Id: msg.MessageId!,
							ReceiptHandle: msg.ReceiptHandle,
						},
					],
				}),
			);
		}
		await setTimeout(3000);
	}
}

PollQueue().catch((e) => console.error("Exitting..."));
