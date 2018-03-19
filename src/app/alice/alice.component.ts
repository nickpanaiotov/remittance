import {Component, NgZone, OnInit} from '@angular/core';
import {MetaCoinService, Web3Service} from '../../services/services';
import {canBeNumber} from '../../util/validation';
import {keccak256} from 'js-sha3';
import {RemittanceService} from '../../services/remittance-service';

@Component({
  selector: 'app-alice',
  templateUrl: './alice.component.html',
  styleUrls: ['./alice.component.css']
})
export class AliceComponent {

// TODO add proper types these variables
  account: any;
  accounts: any;

  balance: number;
  balanceEth: number;
  sendingAmount: number;
  recipientAddress: string;
  passwordCarol: string;
  passwordBob: string;
  duration: number;
  status: string;
  canBeNumber = canBeNumber;

  constructor(private _ngZone: NgZone,
              private web3Service: Web3Service,
              private metaCoinService: MetaCoinService,
              private remittanceService: RemittanceService) {
    this.onReady();
  }

  onReady = () => {

    // Get the initial account balance so it can be displayed.
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() => {
        this.refreshBalance();
        this.refreshBalanceEth();
      });
    }, err => alert(err))
  };

  refreshBalance = () => {
    this.metaCoinService.getBalance(this.account)
      .subscribe(value => {
        this.balance = value
      }, e => {
        this.setStatus('Error getting balance; see log.')
      })
  };

  refreshBalanceEth = () => {
    this.web3Service.getBalance(this.account)
      .subscribe(value => {
        this.balanceEth = value
      }, e => {
        this.setStatus('Error getting balance; see log.')
      })
  };

  setStatus = message => {
    this.status = message;
  };

  sendCoin = () => {
    this.setStatus('Initiating transaction... (please wait)');


    this.metaCoinService.sendCoin(this.account, this.recipientAddress, this.sendingAmount)
      .subscribe(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
        this.refreshBalanceEth();
      }, e => this.setStatus('Error sending coin; see log.'))
  };

  submitTransaction = () => {
    this.setStatus('Initiating transaction... (please wait)');

    let password = '0x' + keccak256(this.passwordCarol + this.passwordBob);
    this.remittanceService.submitTransaction(this.account, this.recipientAddress, this.sendingAmount, this.duration, password)
      .subscribe(() => {
        this.setStatus('Transaction Submitted!');
        this.refreshBalance();
        this.refreshBalanceEth();
      }, e => this.setStatus('Error sending coin; see log.'))
  }
}
