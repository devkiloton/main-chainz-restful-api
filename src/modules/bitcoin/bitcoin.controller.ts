import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { UserPayload } from 'src/types/user-payload';
import { PublicWallet } from './types/public-wallet';

@UseGuards(AccessTokenGuard)
@Controller('bitcoin')
export class BitcoinController {
  constructor(private readonly bitcoinService: BitcoinService) {}

  @Post('create-wallet')
  async createWallet(@Req() req: UserPayload) {
    return await this.bitcoinService.createWallet({ userId: req.sub });
  }

  @Post('create-transaction')
  async createTransaction(@Body() data: { satoshis: number; receiver: string }, @Req() req: UserPayload) {
    return await this.bitcoinService.createTransaction({
      // SERIALIZE DATA LATER WITH DTO
      satoshis: Number(data.satoshis),
      receiver: data.receiver,
      userId: req.sub,
    });
  }

  @Get()
  async findInformation(@Req() req: UserPayload): Promise<PublicWallet> {
    return await this.bitcoinService.findInformation(req.sub);
  }
}
