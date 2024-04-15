"use strict";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: "eu-west-1" });
const PRODUCT_TABLE_NAME = "products";
const STOCKS_TABLE_NAME = "stocks";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const createProductInDB = async (body) => {
  const { title, description, price, count, id } = body;
  const productId = uuidv4();
  const productParams = {
    TableName: PRODUCT_TABLE_NAME,
    Item: {
      id: id,
      title: title,
      description: description,
      price: price,
    },
  };
  const stockParams = {
    TableName: STOCKS_TABLE_NAME,
    Item: {
      product_id: id,
      count: count,
    },
  };
  try {
    await dynamoDBClient.put(productParams).promise();
    await dynamoDBClient.put(stockParams).promise();
    console.log("createProductInDB -> ", `New product added with id :${id}.`);
    return { productParams, stockParams };
  } catch (error) {
    console.log(
      "createProductInDB -> ",
      `There was an error adding new item with id :${id}.`,
      error
    );
    throw error;
  }
};

const catalogBatchProcess = async (event) => {
  const products = await Promise.all(
    event.Records.map(async ({ body }) => {
      const result = await createProductInDB(JSON.parse(body));
      return result;
    })
  );
  console.log("catalogBatchProcess -> products: ", products);

  const snsParams = {
    Message: `Following products were created on DynamoDB ${PRODUCT_TABLE_NAME} table.
    ${JSON.stringify(products)}`,
    TopicArn: process.env.SNS_ARN,
  };

  const publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(snsParams)
    .promise();

  publishTextPromise
    .then((data) => {
      console.log(
        `Message ${snsParams.Message} sent to the topic ${snsParams.TopicArn}`
      );
      console.log("MessageID is " + data.MessageId);
    })
    .catch((err) => {
      console.error(err, err.stack);
    });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: "catalogBatchProcess executed successfully",
    }),
  };
};

export { catalogBatchProcess };
