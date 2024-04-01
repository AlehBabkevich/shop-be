import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: "eu-west-1" });
const PRODUCT_TABLE_NAME = "products";
const STOCKS_TABLE_NAME = "stocks";

export const dynamoClient = {
  async getProductsListFromDB() {
    try {
      const products = await dynamoDBClient
        .scan({ TableName: PRODUCT_TABLE_NAME })
        .promise();
      const stocks = await dynamoDBClient
        .scan({ TableName: STOCKS_TABLE_NAME })
        .promise();

      const productsList = [];
      for (let i = 0; i < products.Items.length; i++) {
        productsList.push({
          ...products.Items[i],
          count: {
            ...stocks.Items.find(
              (item) => item.product_id === products.Items[i].id
            ),
          }.count,
        });
      }
      console.log(
        "getProductsListFromDB -> ",
        "Successful call, products list: ",
        productsList
      );
      return productsList;
    } catch (err) {
      console.log("getProductsListFromDB -> ", "Fail call: ", err);
      throw { message: "Fail on getProductsListFromDB method call", err };
    }
  },
  async getProductsByIdFromDB(productId) {
    const productParams = {
      TableName: PRODUCT_TABLE_NAME,
      Key: { id: productId },
    };
    const stockParams = {
      TableName: STOCKS_TABLE_NAME,
      Key: { product_id: productId },
    };

    try {
      const productData = await dynamoDBClient.get(productParams).promise();

      if (!productData.Item) throw "Product not found";

      const stockData = await dynamoDBClient.get(stockParams).promise();

      const product = {
        ...productData.Item,
        count: stockData.Item?.count || 0,
      };

      console.log(
        "getProductsByIdFromDB -> ",
        `Successful call by id: ${productId}, product: `,
        product
      );
      return product;
    } catch (error) {
      console.log(
        "getProductsByIdFromDB -> ",
        `Fail call by id: ${productId},`,
        error
      );
      throw {
        message: `Fail on getProductsByIdFromDB method call by product id: ${productId}`,
      };
    }
  },
  async createProductInDB(body) {
    const { title, description, price, count } = body;
    const productId = uuidv4();
    const productParams = {
      TableName: PRODUCT_TABLE_NAME,
      Item: {
        id: productId,
        title: title,
        description: description,
        price: price,
      },
    };
    const stockParams = {
      TableName: STOCKS_TABLE_NAME,
      Item: {
        product_id: productId,
        count: count,
      },
    };
    try {
      await dynamoDBClient.put(productParams).promise();
      await dynamoDBClient.put(stockParams).promise();
      console.log(
        "createProductInDB -> ",
        `New product added with id :${productId}.`
      );
      return { productParams, stockParams };
    } catch (error) {
      console.log(
        "createProductInDB -> ",
        `There was an error adding new item with id :${productId}.`,
        error
      );
      throw error;
    }
  },
};
