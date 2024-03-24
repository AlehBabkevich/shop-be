"use strict";
import { mockData } from "./mockData.js";

const getProductsList = async (event) => {
  try {
    const products = await mockData.getProducts();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      message: error,
    };
  }
};

export { getProductsList };
