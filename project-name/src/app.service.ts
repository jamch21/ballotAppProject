import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyERC20Token.json';
import * as dotenv from "dotenv";

//const ERC20VOTES_TOKEN_ADDRESS = '0x324c938062235e86dBF068AC2ede9211fE5f842f';
const ERC20VOTES_TOKEN_ADDRESS = '0xFe772eB508BbA3B65EC3e32cF7ee32aA3D26679B';
const TOKENIZED_BALLOT_ADDDRESS = '0x52Ed2261A5d05C34Ab4Bd66511812Ab7E0DC707a';

//const PRIVATE_KEY= process.env.PRIVATE_KEY || '';



@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  erc20Contract: ethers.Contract;


  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    const erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    );
    this.erc20Contract = erc20ContractFactory.attach(ERC20VOTES_TOKEN_ADDRESS);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY?? "", this.provider);

  }

  getTokenAddress() {
    return ERC20VOTES_TOKEN_ADDRESS;
  }

  getTokenizedBallotAddress() {
    return TOKENIZED_BALLOT_ADDDRESS;
  }

  // async requestTokens(body:any) {
  //   //TODO; do the minting
  //   //Todo: do the minting
  //   //await for the tx
  //   //return the tx hash
  //   return true;
  // }
}
