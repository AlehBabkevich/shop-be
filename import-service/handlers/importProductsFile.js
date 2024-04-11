import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const importProductsFile = async (event) => {
  try {
    console.log("importProductsFile - > event: ", event);
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };
    const fileName = event.queryStringParameters.name;

    if (!nafileNameme) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "File name is required" }),
      };
    }
    const fileKey = `uploaded/${fileName}`;
    const region = "eu-west-1";
    const bucket = "import-bucket-aws";

    const client = new S3Client({ region });
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      Expires: 3600,
      ContentType: "text/csv",
    });
    const url = getSignedUrl(client, command, { expiresIn: 3600 });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};

export { importProductsFile };
