"use strict";

import { mockData } from "./mockData.js";

const getProductsById = async ({ pathParameters }) => {
  const productId = pathParameters?.productId;

  try {
    const product = await mockData.getProductById(productId);
    if (!product) throw new Error("Product not found");

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
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      message: error.message,
    };
  }
};

export { getProductsById };
