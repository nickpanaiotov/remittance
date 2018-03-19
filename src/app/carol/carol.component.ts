import {Component, NgZone, OnInit} from '@angular/core';
import {MetaCoinService, Web3Service} from '../../services/services';
import {canBeNumber} from '../../util/validation';
import {RemittanceService} from '../../services/remittance-service';

@Component({
  selector: 'app-carol',
  templateUrl: './carol.component.html',
  styleUrls: ['./carol.component.css']
})
export class CarolComponent {

// TODO add proper types these variables
  account: any;
  accounts: any;

  balance: number;
  balanceEth: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  passwordCarol: string;
  passwordBob: string;

  constructor(
    private _ngZone: NgZone,
    private web3Service: Web3Service,
    private metaCoinService: MetaCoinService,
    private remittanceService: RemittanceService
  ) {
    this.onReady();
  }

  onReady = () => {

    // Get the initial account balance so it can be displayed.
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[1];

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
      }, e => {this.setStatus('Error getting balance; see log.')})
  };

  refreshBalanceEth = () => {
    this.web3Service.getBalance(this.account)
      .subscribe(value => {
        this.balanceEth = value
      }, e => {this.setStatus('Error getting balance; see log.')})
  };

  setStatus = message => {
    this.status = message;
  };

  withdraw = () => {
    this.setStatus('Initiating transaction... (please wait)');

    this.remittanceService.withdraw(this.passwordCarol, this.passwordBob, this.account)
      .subscribe(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
        this.refreshBalanceEth();
      }, e => this.setStatus('Error sending coin; see log.'))
  };
}
