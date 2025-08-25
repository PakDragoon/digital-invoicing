import { INestApplication } from "@nestjs/common";
import helmet from "helmet";

export function setupSecurity(app: INestApplication) {
    const isDevelopment = process.env.NODE_ENV === "development";

    // Allow specific origins (simpler & safer than regex)
    const allowedOrigins = isDevelopment
        ? ["http://localhost:3000", "http://127.0.0.1:3000"]
        : [
            "https://api.clientdomain.com",
            "https://digital-invoicing-ui.vercel.app",
        ];

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // allow Postman / curl

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.error("🚫 Blocked CORS request:", origin);
            callback(new Error("Not allowed by CORS"), false);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Accept",
            "X-Requested-With",
            "Origin",
        ],
        exposedHeaders: ["Authorization", "X-Refresh-Token"],
        optionsSuccessStatus: 204,
    });

    // Helmet security headers
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

    // Handle OPTIONS globally (fallback in case CORS preflight gets stuck)
    app.use((req, res, next) => {
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
            res.header(
                "Access-Control-Allow-Methods",
                "GET,PUT,POST,PATCH,DELETE,OPTIONS"
            );
            res.header(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization, Accept, X-Requested-With, Origin"
            );
            return res.sendStatus(200);
        }
        next();
    });

    app.use((req, res, next) => {
        res.removeHeader("X-Powered-By");
        next();
    });

    console.log("✅ Security configured — CORS + Helmet + Preflight handler");
}
