# Source code for Blockchain workshop

There are 2 parts the the application

## Angular client
Using an older version of web3@0.20.5 because of this [issue](https://github.com/ethereum/web3.js/issues/1555)

### Development
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.x. This application is meant to be served from the server. When you are developing the application, start one of the server (below). 

Start Angular's development server with the proxy config file `proxy.config.js` using the following command: `ng serve -o --proxy-config proxy.config.js`. This will route all HTTP request to `localhost:3000`.

### Production
When you have completed development, build Angular `ng build --prod`. Copy all the contents of `dist` to one of the `public` folder of the server you are planning to use.

## Server

The REST end point /api/v1

### JavaScript

This is an [Express](http://expressjs.com) application. Static files are served from `public` directory. 

Defaults to port `3000`.

### Python

This is an [Flask](http://flask.pocoo.org/) application. Static files are served from `public` directory.

Defaults to port `3000`.

### Solidity Store
See documentation [here](solidity/README.md)
