"use strict";

import { dynamoClient } from "../dynamoDB.js";

const getProductsById = async ({ pathParameters }) => {
  const productId = pathParameters?.productId;
  try {
    const product = await dynamoClient.getProductsByIdFromDB(productId);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      message: error.message,
    };
  }
};

export { getProductsById };
