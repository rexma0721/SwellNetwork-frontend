import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const GET_NODE_OPERATOR_BY_USER = gql`
  query NodeOperatorByUser($wallet: String!) {
    nodeOperatorByUser(userUniqueInput: { wallet: $wallet }) {
      id
      location
      nodes
      cpu
      ram
      network
      storage
      category
      name
      yearsOfExperience
      email
      website
      social
      description
      status
      user {
        id
        wallet
      }
      validators {
        id
        status
        whitelist
        pubKey
        depositDatas {
          id
          amount
          signature
          depositDataRoot
        }
      }
    }
  }
`;
