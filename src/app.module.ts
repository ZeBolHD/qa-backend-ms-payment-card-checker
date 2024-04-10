import { Module } from "@nestjs/common";
import { CheckerController } from "./checker/checker.controller";
import { ConfigModule } from "@nestjs/config";
import { CheckerService } from "./checker/checker.service";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [LoggerModule.forRoot(), ConfigModule.forRoot({ isGlobal: true })],
  controllers: [CheckerController],
  providers: [CheckerService],
})
export class AppModule {}
