import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
        { url: "https://10.10.246.122:443", description: "HTTPS Server" },
        { url: "http://10.10.246.122:80", description: "HTTP Server" },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
