import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck() {
    return { status: "OK" };
  }

  @Get("hello")
  getHello() {
    return "Hello World!";
  }
}
