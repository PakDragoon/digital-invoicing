import { INestApplication } from "@nestjs/common";
import helmet from "helmet";

export function setupSecurity(app: INestApplication) {
  // Use NODE_ENV to determine the environment
  const isDevelopment = process.env.NODE_ENV === "development";

  // Set up CORS with regex for allowed origins:
  // - In development, allow any localhost port.
  // - In production, allow specific domains.
  app.enableCors({
    origin: (origin, callback) => {
      // const allowedOrigins = isDevelopment
      //   ? [/http:\/\/localhost(:\d+)?/]
      //   : [
      //       //
      //       /https:\/\/api\.clientdomain\.com/,
      //       /https:\/\/digital-invoicing-ui\.vercel\.app/,
      //       /https:\/\/digital-invoicing-ui\.vercel\.app\//,
      //     ];
      const allowedOrigins = isDevelopment
        ? ["http://localhost:5173"]
        : ["https://digital-invoicing-ui.vercel.app"];

      // Allow requests with no origin (e.g., Postman, mobile apps)
      if (!origin) return callback(null, true);

      // Check if any regex pattern matches the origin
      // if (allowedOrigins.some((pattern) => pattern.test(origin))) {
      //   return callback(null, true);
      // }
      if (allowedOrigins.some((url) => url === origin)) {
        return callback(null, true);
      }

      console.error("🚫 Blocked CORS request:", origin);
      callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization", "X-Refresh-Token"],
    optionsSuccessStatus: 204,
  });

  // Configure Helmet for security headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: isDevelopment
        ? false
        : {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "'unsafe-inline'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "https:"],
            },
          },
      hsts: isDevelopment
        ? false
        : { maxAge: 31536000, includeSubDomains: true, preload: true },
    }),
  );

  // Remove the X-Powered-By header
  app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    next();
  });

  console.log("✅ Security configured — Single Origin CORS, Helmet, headers");
}
