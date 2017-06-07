# mean-sample
Sample MEAN stack basic server

With:
  - AngularJS 1.6 SPA
    - angular-ui-router 1.0.3 (component routing)
    - angular-material
    - angular-messages
    - angular-css
  - Node + Express
  - Passport authentication (local and Facebook)
  - JWT tokens
  - Webpack 2

Can be deployed on Heroku. Add a .env file on the project root directory with:
  ```
    NODE_MODULES_PRODUCTION=true
    FACEBOOK_ClientId=<your FB app clientId>
    FACEBOOK_ClientSecret=<your FB app clientSecret>
  ```
