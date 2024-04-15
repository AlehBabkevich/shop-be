import AWS from "aws-sdk";

const s3 = new AWS.S3({ region: "eu-west-1" });

const importProductsFile = async (event) => {
  try {
    console.log("importProductsFile - > event: ", event);
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };
    const fileName = event.queryStringParameters.name;

    if (!fileName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "File name is required" }),
      };
    }
    const fileKey = `uploaded/${fileName}`;
    const region = "eu-west-1";
    const bucket = "import-bucket-aws";

    const params = {
      Bucket: bucket,
      Key: fileKey,
      Expires: 3600,
      ContentType: "text/csv",
    };
    const url = await s3.getSignedUrl("putObject", params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(url),
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
