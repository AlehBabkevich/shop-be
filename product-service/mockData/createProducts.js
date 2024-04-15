// import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// const client = new DynamoDBClient({ region: "eu-west-1" });
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "eu-west-1" });

const addProduct = async (product) => {
  const params = {
    TableName: "products",
    Item: product,
  };

  try {
    await dynamoDb.put(params).promise();
    console.log(`Product added: ${product.title}`);
  } catch (error) {
    console.error(`error: ${error.message}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      message: error,
    };
  }
};

const addStock = async (product) => {
  const params = {
    TableName: "stocks",
    Item: {
      product_id: product.id,
      count: Math.floor(Math.random() * 10),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    console.log(`Stock added: ${product.title}`);
  } catch (error) {
    console.error(`error: ${error.message}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      message: error,
    };
  }
};

(async () => {
  for (let i = 1; i <= 10; i++) {
    const product = {
      id: uuidv4(),
      title: `ProductTitle_${i}`,
      description: `Short Product Description_${i}`,
      price: Math.floor(Math.random() * 100 + 10),
    };
    await addProduct(product);
    await addStock(product);
  }
})();
