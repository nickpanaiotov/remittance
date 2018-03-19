import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service'

const remittanceArtifacts = require('../../build/contracts/Remittance.json');
const contract = require('truffle-contract');

@Injectable()
export class RemittanceService {

  Remittance = contract(remittanceArtifacts);

  constructor(private web3Ser: Web3Service) {
    // Bootstrap the MetaCoin abstraction for Use
    this.Remittance.setProvider(web3Ser.web3.currentProvider);
  }

  submitTransaction(from, to, value, duration, password): Observable<boolean> {
    let remittance;

    return Observable.create(observer => {
      this.Remittance
        .deployed()
        .then(instance => {
          remittance = instance;
          return remittance.submitTransaction(to, duration, password, {
            from: from,
            value: value,
            gas: 1000000
          });
        })
        .then(result => {
          observer.next(result);
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        });
    })
  }

  withdraw(cPassword, bPassword, account): Observable<boolean> {
    let remittance;

    return Observable.create(observer => {
      this.Remittance
        .deployed()
        .then(instance => {
          remittance = instance;
          return remittance.withdraw(cPassword, bPassword, {
            from: account
          });
        })
        .then(result => {
          observer.next(result);
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        });
    })
  }
}
