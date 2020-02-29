import gql from 'graphql-tag';

export const OPERATIONS_GQL = gql`
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