import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio Platform API",
      version: "1.0.0",
      description: "API for Edeh Chinedu Daniel Portfolio Platform",
    },
    servers: [
      {
        url: "/api/v1",
        description: "API v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/modules/auth/auth.routes.ts",
    "./src/modules/blog/blog.routes.ts",
    "./src/modules/articles/articles.routes.ts",
    "./src/modules/books/books.routes.ts",
    "./src/modules/career/career.routes.ts",
    "./src/modules/achievements/achievements.routes.ts",
    "./src/modules/downloads/downloads.routes.ts",
    "./src/modules/contact/contact.routes.ts",
    "./src/modules/newsletter/newsletter.routes.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
