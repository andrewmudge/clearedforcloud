import { getServerSession } from "next-auth/next";
import authOptions from "../auth/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

export async function GET() {
  const data = await ddb.send(new ScanCommand({ TableName: "BlogPosts" }));
  return NextResponse.json(data.Items || []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.email !== "mudge.andrew@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const item = {
    ...body,
    id: Date.now().toString(),
    date: new Date().toISOString().slice(0, 10),
  };
  await ddb.send(new PutCommand({ TableName: "BlogPosts", Item: item }));
  return NextResponse.json(item);
}