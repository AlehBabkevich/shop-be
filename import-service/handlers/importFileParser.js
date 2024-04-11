import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandOutput,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import csv from "csv-parser";

const client = new S3Client({ region: "eu-west-1" });

const getObject = async ({ bucket, key }) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const commandResult: GetObjectCommandOutput = await client.send(command);

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
    const response = await client.send(command);
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
    const response = await client.send(command);
  } catch (err) {
    console.error(err);
  }
};

const parse = (stream) => {
  return new Promise((resolve, reject) => {
    const results = [];

    stream
      .pipe(csv())
      .on("data", (data) => {
        console.log("CSV Record:", data);
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
    console.log("importFileParser -> event: ", event);
    const bucket = "import-bucket-aws";
    const key = event.Records[0].s3.object.key;
    const s3Stream = await getObject({
      bucket,
      key,
    });

    const [folder, objectName] = key.split("/");
    await copyObject(bucket, folder, objectName, "parsed");

    await deleteObject(bucket, key);

    return parse(s3Stream);
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        error: "An error occurred",
      }),
    };
  }
};

export { importFileParser };
