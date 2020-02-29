import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { OPERATIONS_GQL } from '../../graphql/operations';
import Operation from '../../types/Operation';
import Transaction from '../../types/Transaction';
import { MAX_RENDERED_TRANSACTIONS, MAX_RENDERED_DEVIATIONS } from '../../constants/misc';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.css']
})
export class ExchangesComponent implements OnInit {
  transactions: Transaction[] = [];
  deviations: Transaction[] = [];
  highestValue: number = null;
  lowestValue: number = null;
  averageValue: number = 0;
  totalValue: number = 0;
  transactionsQuantity: number = 0;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.subscribe({
        query: OPERATIONS_GQL,
        variables: {
          type: 'payment'
        },
      })
      .subscribe((result: any) => {
        const operation: Operation = result.data.operations;
        const transaction: Transaction = operation.transaction;

        if (!transaction.success) {
          return;
        }

        transaction.dateReceived = new Date();

        this.checkHighest(transaction);
        this.checkLowest(transaction);
        this.addTransactionToHistory(transaction);
      });
  }

  /**
   * Checks if a transaction is above the current highest. If it is, set as highest
   *
   * @author mauricio.araldi
   * @since 0.1.0
   *
   * @param {Transaction} transaction Transaction to be checked against highest
   */
  checkHighest(transaction: Transaction) {
    if (this.highestValue === null || transaction.feeAmount > this.highestValue) {
      this.highestValue = transaction.feeAmount;
    }
  }

  /**
   * Checks if a transaction is below the curren lowest. If it is, set as lowest
   *
   * @author mauricio.araldi
   * @since 0.1.0
   *
   * @param {Transaction} transaction Transaction to be checked against lowest
   */
  checkLowest(transaction: Transaction) {
    if (this.lowestValue === null || transaction.feeAmount < this.lowestValue) {
      this.lowestValue = transaction.feeAmount;
    }
  }

  /**
   * Checks if a transaction is considered a deviation. It is considered when
   * above double the current average OR below half the current average
   *
   * @author mauricio.araldi
   * @since 0.1.0
   * 
   * @param {Transaction} transaction Transaction to be checked
   * @returns {Boolean} If transaction is a deviation
   */
  isDeviation(transaction: Transaction): boolean {
    return transaction.feeAmount > (this.averageValue * 2) 
      || transaction.feeAmount < (this.averageValue / 2);
  }

  /**
   * Adds a new transaction to history
   *
   * @author mauricio.araldi
   * @since 0.1.0
   *
   * @param {Transaction} transaction [description]
   */
  addTransactionToHistory(transaction: Transaction) {
    this.totalValue += transaction.feeAmount;
    this.transactionsQuantity++;

    this.averageValue = Math.round(this.totalValue / this.transactionsQuantity);

    this.transactions.unshift(transaction);

    if (this.transactions.length > MAX_RENDERED_TRANSACTIONS) {
      this.transactions.pop();
    }

    if (this.isDeviation(transaction)) {
      this.deviations.unshift(transaction);
    }

    if (this.deviations.length > MAX_RENDERED_DEVIATIONS) {
      this.deviations.pop();
    }
  }

}
