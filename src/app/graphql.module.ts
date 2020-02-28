import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';

import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { STELLAR_GRAPHQL_HTTP, STELLAR_GRAPHQL_WS } from '../constants/url';

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class GraphQLConfigModule {
  constructor(apollo: Apollo, private httpClient: HttpClient) {
    const httpLink = new HttpLink(httpClient).create({ uri: STELLAR_GRAPHQL_HTTP });

    const subscriptionLink = new WebSocketLink({
      uri: STELLAR_GRAPHQL_WS,
      options: {
        reconnect: true
      }
    });

    const link = split(
      ({ query }) => {
        // const { kind, operation } = getMainDefinition(query);
        const { kind } = getMainDefinition(query);
        console.log(kind);
        return kind === 'OperationDefinition';
        // return kind === 'OperationDefinition' && operation === 'subscription';
      },
      subscriptionLink,
      httpLink
    );

    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}