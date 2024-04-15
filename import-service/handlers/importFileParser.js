import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import csv from "csv-parser";
import { v4 as uuidv4 } from "uuid";

const region = "eu-west-1";
const clientS3 = new S3Client({ region });
const clientSQS = new SQSClient({ region });
const bucket = "import-bucket-aws";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const queue = async (msg) => {
  const command = new SendMessageCommand({
    QueueUrl:
      "https://sqs.eu-west-1.amazonaws.com/851725410077/CatalogItemsQueue",
    MessageBody: msg,
  });

  const data = await clientSQS.send(command);
};

const sendToQueue = async (stream) => {
  const products = await parseStream(stream);
  console.log("sendToQueue -> products: ", products);

  for (const product of products) {
    await queue(JSON.stringify(product));
  }
};

const getObject = async ({ bucket, key }) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const commandResult = await clientS3.send(command);

  return commandResult.Body;
};

const copyObject = async (bucket, folder, objectName, folderToMove) => {
  const CopySource = `${bucket}/${folder}/${objectName}`;
  const destination = `${folderToMove}/${objectName}`;

  const command = new CopyObjectCommand({
    CopySource,
    Bucket: bucket,
    Key: destination,
  });

  try {
    const response = await clientS3.send(command);
  } catch (err) {
    console.error(err);
  }
};

const deleteObject = async (bucket, key) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await clientS3.send(command);
  } catch (err) {
    console.error(err);
  }
};

const parseStream = (stream) => {
  return new Promise((resolve, reject) => {
    const results = [];

    stream
      .pipe(csv({ separator: "," }))
      .on("data", (data) => {
        console.log("parse -> data: ", data);
        results.push(data);
      })
      .on("end", () => {
        console.log("CSV Parsing Completed");
        resolve(results);
      })
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      });
  });
};

const importFileParser = async (event) => {
  try {
    const key = event.Records[0].s3.object.key;
    const s3Stream = await getObject({
      bucket,
      key,
    });
    await sendToQueue(s3Stream);

    const [folder, objectName] = key.split("/");
    await copyObject(bucket, folder, objectName, "parsed");

    await deleteObject(bucket, key);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: `All line have been processed.` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: `Error: ${error}`,
      }),
    };
  }
};

export { importFileParser };
