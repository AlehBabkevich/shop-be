"use strict";

import { dynamoClient } from "../dynamoDB.js";

const createProduct = async ({ body }) => {
  try {
    const newProduct = await dynamoClient.createProductInDB(body);
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        productData: newProduct.productParams,
        stockData: newProduct.stockParams,
      }),
    };
  } catch (error) {
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

export { createProduct };
