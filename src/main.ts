import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useLogger(app.get(Logger));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `checker-${Math.floor(Math.random() * 1000)}`,
        brokers: [configService.get<string>("KAFKA_BROKER", "localhost:9092")],
      },
      consumer: {
        heartbeatInterval: 5000,
        rebalanceTimeout: 5000,
        groupId: "checker-consumer",
      },
    },
  });

  await app.startAllMicroservices();
  console.log("Card checker service is listening...");
}
bootstrap();
