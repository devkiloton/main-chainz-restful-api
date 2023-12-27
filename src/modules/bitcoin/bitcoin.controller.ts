import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { UserPayload } from 'src/types/user-payload';
import { PublicWallet } from './types/public-wallet';
import { CreatedWallet } from './types/created-wallet';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UserReq } from 'src/types/user-req';

@Controller('bitcoin')
@UseGuards(AccessTokenGuard)
export class BitcoinController {
  constructor(private readonly bitcoinService: BitcoinService) {}

  @Post('create-wallet')
  async createWallet(@Req() req: UserPayload): Promise<CreatedWallet> {
    return await this.bitcoinService.createWallet({ userId: req.sub });
  }

  @Post('create-transaction')
  async createTransaction(@Body() data: CreateTransactionDto, @Req() req: UserPayload): Promise<string> {
    return await this.bitcoinService.createTransaction({
      satoshis: Number(data.satoshis),
      receiver: data.receiver,
      userId: req.sub,
    });
  }

  @Get()
  async findInformation(@Req() req: UserReq): Promise<PublicWallet> {
    return await this.bitcoinService.findInformation(req.user.sub);
  }
}
