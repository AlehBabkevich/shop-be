# shop-be

1. Service is done
2. FE app is connected to BE - https://d1dbsqwk4db26.cloudfront.net

3. Additional scope:
   - Async/await is used in lambda functions
   - ES6 modules are used for Product Service implementation
   - Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase.
   - Main error scenarios are handled by API ("Product not found" error).
4. Link to Product Service API:
   
   Product List: https://800hohvpog.execute-api.eu-west-1.amazonaws.com/dev/products

   Product by id: https://800hohvpog.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}

   Example: https://800hohvpog.execute-api.eu-west-1.amazonaws.com/dev/products/1

6. Link to FE PR - https://github.com/AlehBabkevich/shop-react-redux-cloudfront/tree/task-3
