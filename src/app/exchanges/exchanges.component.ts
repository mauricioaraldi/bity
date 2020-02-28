import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const GET_EXCHANGES = gql`
  subscription exchanges($type: [OperationType]) {
    operations(type: $type) {
      id,
      transaction {
        feeAmount,
        feeCharged,
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
  exchanges: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.subscribe({
        query: GET_EXCHANGES,
        variables: {
          type: 'payment'
        }
      }).subscribe(result => {
      });
  }

}
