import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators';
import { Query } from '@nestjs/common/decorators';
import { ethers } from 'ethers';
import { AppService} from './app.service';


//0xeb9E2AA47eeC2438900a8B433ac6fC36Ee466171

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('token-address')
  getTokenAddress(){
    return {result: this.appService.getTokenAddress()};
  }

  @Get('tokenizedBallot-address')
  getTokenizedBallotAddress(){
    return {result: this.appService.getTokenizedBallotAddress()};
  }


  // @Post('request-tokens')
  // requestToken(@Body() body){
  //   return {result: this.appService.requestTokens()};
  // }
}