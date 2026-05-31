/// <reference types="node" />
import {
	DeleteCommand,
	GetCommand,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { setTimeout } from "timers/promises";

const client = new DynamoDBClient({
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test",
	},
});

const TB_NAME = "AppTable";

const DDB = DynamoDBDocumentClient.from(client, {
	marshallOptions: {
		removeUndefinedValues: true,
	},
});

interface OrderItem {
	PK: string;
	SK: string;
	status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
	amount: number;
	createdAt: string;
}

function randomData(limit: number = 10): OrderItem[] {
	const items: OrderItem[] = [];
	const statuses: Array<"PENDING" | "PAID" | "SHIPPED" | "CANCELLED"> = [
		"PENDING",
		"PAID",
		"SHIPPED",
		"CANCELLED",
	];

	for (let i = 0; i < limit; i++) {
		items.push({
			PK: `USER#${i}`,
			SK: `ORDER#${randomUUID()}`,
			status: statuses[Math.floor(Math.random() * statuses.length)],
			amount: Math.round(Math.random() * (1000 - 10) + 10),
			createdAt: new Date().toISOString(),
		});
	}

	return items;
}

const main = async () => {
	const LIMIT = 1000;
	const ITEMS = randomData(LIMIT);
	console.log(`Inserting ${LIMIT} items...`);
	let start = performance.now();
	for (let i = 0; i < LIMIT; i++) {
		await DDB.send(
			new PutCommand({
				TableName: TB_NAME,
				Item: ITEMS[i],
			}),
		);
	}
	let end = performance.now();

	console.log(
		`Inserted ${LIMIT} items in ${((end - start) / 1000).toFixed(4)}s`,
	);

	console.log("Waiting for 5 seconds ...");
	await setTimeout(5000);

	console.log(`Querying ${LIMIT} items...`);
	start = performance.now();
	for (let i = 0; i < LIMIT; i++) {
		await DDB.send(
			new QueryCommand({
				TableName: TB_NAME,
				KeyConditionExpression: "PK = :pk",
				ExpressionAttributeValues: {
					":pk": `USER#${Math.floor(Math.random() * LIMIT)}`,
				},
			}),
		);
	}
	end = performance.now();

	console.log(
		`Queried ${LIMIT} items in ${((end - start) / 1000).toFixed(4)}s`,
	);

	await setTimeout(5000);
	console.log("Sleep for 5 seconds...");
	console.log("Deleting items...");

	start = performance.now();
	for (let i = 0; i < LIMIT; i++) {
		await DDB.send(
			new DeleteCommand({
				TableName: TB_NAME,
				Key: {
					PK: `USER#${i}`,
					SK: ITEMS[i].SK,
				},
			}),
		);
	}
	end = performance.now();
	console.log(
		`Deleted ${LIMIT} items in ${((end - start) / 1000).toFixed(4)}s`,
	);
};

await main();
