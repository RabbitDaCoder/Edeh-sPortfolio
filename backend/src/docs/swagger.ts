import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio Platform API",
      version: "2.0.0",
      description:
        "API for Edeh Chinedu Daniel Portfolio Platform. " +
        "To authorize admin endpoints, click the **Authorize** button and enter your JWT token.",
      contact: {
        name: "Edeh Chinedu Daniel",
        email: "edehchinedu59@gmail.com",
        url: "https://edehchinedu.dev",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "API v1",
      },
      {
        url: "/api/v2",
        description: "API v2 (Guestbook)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your access token from POST /auth/login response.",
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
    "./src/modules/projects/projects.routes.ts",
    "./src/modules/skills/skills.routes.ts",
    "./src/modules/testimonials/testimonials.routes.ts",
    "./src/modules/profile/profile.routes.ts",
    "./src/modules/upload/upload.routes.ts",
    "./src/modules/polaroids/polaroids.routes.ts",
    "./src/modules/comments/comment.routes.ts",
    "./src/modules/guestbook/guestbook.routes.ts",
    "./src/modules/notifications/notification.routes.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
