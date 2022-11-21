import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';
import ballotJson from '../assets/TokenizedBallot.json';
//import ballotJson

const ERC20VOTES_TOKEN_ADDRESS = '0x324c938062235e86dBF068AC2ede9211fE5f842f';
const PROPOSAL_NUM = 3;
const proposalList = ['Chocolate', 'Vanilla', 'Lemon'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.BaseProvider | undefined;
  tokenContractAddress: string | undefined;
  ballotContractAddress: string | undefined;
  //ballotContract instance connected to the wallet.

  etherBalance: number | undefined;
  tokenContract: ethers.Contract | undefined;
  ballotContract: ethers.Contract | undefined;
  winnerProposal: string | undefined;

  tokenBalance: number | undefined;
  votePower: number | undefined;

  constructor(private http: HttpClient) {}

  createWallet() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.wallet = ethers.Wallet.createRandom().connect(this.provider); //Create a random wallet.

    this.http
      .get<any>('http://localhost:3000/token-address')
      .subscribe((ans) => {
        this.tokenContractAddress = ans.result;
        this.updateBlockchainInfo();
        //setInterval(this.updateBlockchainInfo, 1000);
      });
  }

  private updateBlockchainInfo() {
    if (this.tokenContractAddress && this.wallet) {
      this.tokenContract = new ethers.Contract(
        this.tokenContractAddress,
        tokenJson.abi,
        this.wallet
      );
      //this.tokenContract.on("Transfer")
      this.wallet.getBalance().then((balanceBn) => {
        this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn));
      });

      this.tokenContract['balanceOf'](this.wallet.address).then(
        (tokenBalanceBn: BigNumber) => {
          this.tokenBalance = parseFloat(
            ethers.utils.formatEther(tokenBalanceBn)
          );
        }
      );

      this.tokenContract['getVotes'](this.wallet.address).then(
        (votePowerBn: BigNumber) => {
          this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn));
        }
      );
      //console.log(this.votePower, this.tokenBalance);
    }
  }

  vote(voteId: string) {
    console.log('Trying to vote for ' + voteId);
    //this.ballotContract["vote"](voteId);
    this.voteOptions();

    //Todo: this.ballotContract['vote](voteId)
  }

  voteOptions() {
    console.log('Calling voteOptions functions');
    this.http
      .get<any>('http://localhost:3000/tokenizedBallot-address')
      .subscribe((ans) => {
        this.ballotContractAddress = ans.result;
        console.log(`Ballot address = ${this.ballotContractAddress}`);

        if (this.ballotContractAddress) {
          this.ballotContract = new ethers.Contract(
            this.ballotContractAddress,
            ballotJson.abi,
            this.wallet
          );

          console.log(`Valid proposals: ${proposalList}`);

          console.log('Winning proposal check');
          //const winnerProposalName = await ballotContract.winnerName();
          this.ballotContract['winnerName']().then((ans: any) => {
            const winnerProposalName = ethers.utils.parseBytes32String(ans);
            console.log(`The winner account is ${winnerProposalName}`);
          });
        }
      });

    // this.http
    // .get<any>('http://localhost:3000/token-address')
    // .subscribe((ans) => {
    //   this.tokenContractAddress = ans.result;
    //   this.updateBlockchainInfo();
    //   //setInterval(this.updateBlockchainInfo, 1000);
    // });

    // if (this.ballotContractAddress && this.wallet){
    //   //Todo: get the proposals

    //}
  }

  getWinner() {
    this.http
      .get<any>('http://localhost:3000/tokenizedBallot-address')
      .subscribe((ans) => {
        this.ballotContractAddress = ans.result;
        console.log(`Ballot address = ${this.ballotContractAddress}`);

        if (this.ballotContractAddress) {
          this.ballotContract = new ethers.Contract(
            this.ballotContractAddress,
            ballotJson.abi,
            this.wallet
          );

          //console.log(`Valid proposals: ${proposalList}`);

          //console.log('Winning proposal check');
          //const winnerProposalName = await ballotContract.winnerName();
          this.ballotContract['winnerName']().then((ans: any) => {
            const winnerProposalName = ethers.utils.parseBytes32String(ans);
            //console.log(`The winner account is ${winnerProposalName}`);
            this.winnerProposal = winnerProposalName;
          });
        }
      });
  }

  request() {
    this.http
      .post<any>('http://localhost:3000/request-tokens', {
        address: this.wallet?.address,
      })
      .subscribe((ans) => {
        console.log(ans);
      });
  }
}
