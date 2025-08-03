import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { setupSecurity } from "./common/config/security.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

// Convert BigInt values to strings for JSON responses
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, "..", "public"));

  // Apply security middleware (CORS, Helmet)
  setupSecurity(app);

  // Apply global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Apply the global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set up Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle("Admin API")
    .setDescription("API for Admin Authentication & Management")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    customJs: "/swagger/swagger-auth.js",
  });

  // Use environment variable PORT or default to 8080
  const port = process.env.PORT || 8080;
  await app.listen(port);

  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(
    `📚 Swagger documentation available at http://localhost:${port}/api`,
  );
}

bootstrap();
