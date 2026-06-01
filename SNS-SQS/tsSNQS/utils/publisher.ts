/// <reference types="node" />
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import * as readline from "readline";
import { setTimeout } from "timers/promises";

const sns = new SNSClient({
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test",
	},
});

const SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:000000000000:my-sns";

async function PublishEvent(count: number) {
	for (let i = 0; i < count; i++) {
		const command = new PublishCommand({
			TopicArn: SNS_TOPIC_ARN,
			Message: JSON.stringify({
				eventType: "UserCreated",
				userId: Math.floor(Math.random() * 1000),
				email: `test${i}@example.com`,
			}),
		});

		const result = await sns.send(command);
		// console.log("Published: ", result.MessageId)
	}
}

async function main() {
	while (true) {
		try {
			console.log("Enter number of events to publish (or 'exit' to quit): ");
			const input = await new Promise<string>((resolve) => {
				const rl = readline.createInterface({
					input: process.stdin,
					output: process.stdout,
				});
				rl.question("> ", (answer) => {
					rl.close();
					resolve(answer);
				});
			}).catch(() => "exit");

			if (input.toLowerCase() === "exit") {
				console.log("Exiting...");
				break;
			}

			const count = parseInt(input);
			if (Number.isNaN(count) || count <= 0) {
				console.log("Please enter a positive integer.");
				continue;
			}

			await PublishEvent(count);
			await setTimeout(3000);
		} catch (e) {
			console.error(e);
		}
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
