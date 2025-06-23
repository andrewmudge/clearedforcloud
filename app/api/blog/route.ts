import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

export async function GET() {
  try {
    const data = await ddb.send(new ScanCommand({ TableName: "BlogPosts" }));
    return NextResponse.json(data.Items || []);
  } catch (err) {
    console.error("DynamoDB error:", err);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}