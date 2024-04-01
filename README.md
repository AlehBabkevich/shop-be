# shop-be

1. Service is done
2. FE app is connected to DB - https://d1dbsqwk4db26.cloudfront.net

3. Additional scope:
   - All lambdas return error 500 status code on any error (DB connection, any unhandled error in code)
   - All lambdas do console.log for each incoming requests and their arguments
4. Product Service API:
   endpoints:  
    GET - https://800hohvpog.execute-api.eu-west-1.amazonaws.com/dev/products
   GET - https://800hohvpog.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}
   POST - https://800hohvpog.execute-api.eu-west-1.amazonaws.com/dev/products
   functions:
   getProductsList: product-service-dev-getProductsList
   getProductsById: product-service-dev-getProductsById
   createProduct: product-service-dev-createProduct

5. Link to FE PR - https://github.com/AlehBabkevich/shop-react-redux-cloudfront/tree/task-4
