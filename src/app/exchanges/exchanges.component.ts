import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const GET_OPERATIONS = gql`
  subscription exchanges($type: [OperationType]) {
    operations(type: $type) {
      transaction {
        id,
        feeAmount,
        success
      }
    }
  }
`;

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.css']
})
export class ExchangesComponent implements OnInit {
  operations: any[] = [];
  highestValue: number = null;
  lowestValue: number = null;
  averageValue: number = 0;
  totalValue: number = 0;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.subscribe({
        query: GET_OPERATIONS,
        variables: {
          type: 'payment'
        }
      }).subscribe(result => {
        const { operations }: any = result.data;
        const { transaction }: any = operations;

        if (!transaction.success) {
          return;
        }

        const operation = {
          id: transaction.id,
          value: transaction.feeAmount,
          date: new Date(),
        };

        if (this.highestValue === null || operation.value > this.highestValue) {
          this.highestValue = operation.value;
        }

        if (this.lowestValue === null || operation.value < this.lowestValue) {
          this.lowestValue = operation.value;
        }

        this.totalValue += operation.value;

        this.averageValue = Math.round(this.totalValue / this.operations.length);

        this.operations.unshift(operation);
      });
  }

}
