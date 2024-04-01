"use strict";

import { dynamoClient } from "../dynamoDB.js";

const getProductsList = async (event) => {
  try {
    const productsList = await dynamoClient.getProductsListFromDB();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(productsList),
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

export { getProductsList };
