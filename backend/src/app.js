const express = require("express");

// Load and validate environment configuration first
const { config, validateEnvironment } = require("./config/env");

// Validate environment variables at startup
try {
  validateEnvironment();
} catch (error) {
  console.error("Environment validation failed:", error.message);
  process.exit(1);
}

const app = express();
const PORT = config.port;

// Connect to database (skip in test environment)
if (process.env.NODE_ENV !== "test") {
  const connectDB = require("./config/db");
  connectDB().catch((error) => {
    console.error(
      "Database connection failed, continuing without database:",
      error.message
    );
  });
}

// --------------------
// Basic Middleware
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------------
// CORS Middleware
// --------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// --------------------
// Request Logging (Optional)
// --------------------
if (config.enableRequestLogging) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });
    next();
  });
}

// --------------------
// Swagger Setup
// --------------------
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Surplus Listing Backend API",
    version: "1.0.0",
    description:
      "API documentation for Surplus Food Listing Platform with Safety Rules",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------------
// Health Check Routes
// --------------------
app.get("/", (req, res) => {
  res.json({
    message: "Surplus Listing Backend is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    status: "healthy",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// --------------------
// API Routes
// --------------------
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

// --------------------
// Error Handling
// --------------------
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/errorHandler");

app.use(notFoundHandler);
app.use(errorHandler);

// --------------------
// Graceful Shutdown
// --------------------
const gracefulShutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// --------------------
// Server Start
// --------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
