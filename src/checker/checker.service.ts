import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CheckerResponse } from "./responses";
import { PinoLogger } from "nestjs-pino";

import { Status } from "./types";
import { CardCheckerDto } from "./dto";

@Injectable()
export class CheckerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CheckerService.name);
  }

  private CARD_SUCCESS_NUMBER = this.configService.get("CARD_SUCCESS_NUMBER", "1111111111111111");
  private CARD_SUCCESS_EXPIRATION_DATE = this.configService.get(
    "CARD_SUCCESS_EXPIRATION_DATE",
    "01/22",
  );
  private CARD_SUCCESS_CODE = +this.configService.get<number>("CARD_SUCCESS_CODE", 123);

  checkCard(dto: CardCheckerDto): CheckerResponse {
    this.logger.info(
      {
        card: {
          cardNumber: dto.card.cardNumber,
        },
        total: dto.total,
      },
      "Check card",
    );

    const status = this.checkCardStatus(dto);

    this.logger.info(
      {
        card: {
          cardNumber: dto.card.cardNumber,
        },
        status,
      },
      "Card checked",
    );

    return { status };
  }

  private checkCardStatus(dto: CardCheckerDto): Status {
    if (
      !dto.card ||
      !dto.card.cardNumber ||
      !dto.card.securityCode ||
      !dto.card.expirationDate ||
      !dto.total
    ) {
      this.logger.error(
        {
          card: {
            cardNumber: dto.card.cardNumber,
          },
          total: dto.total,
        },
        "Card is invalid",
      );
      return Status.ERROR;
    }

    if (
      dto.card.cardNumber === this.CARD_SUCCESS_NUMBER &&
      dto.card.securityCode === this.CARD_SUCCESS_CODE &&
      dto.card.expirationDate === this.CARD_SUCCESS_EXPIRATION_DATE
    ) {
      this.logger.trace(
        {
          card: {
            cardNumber: dto.card.cardNumber,
          },
        },
        "Card is valid",
      );
      return Status.SUCCESS;
    } else {
      return Status.INVALID_CARD;
    }
  }
}
