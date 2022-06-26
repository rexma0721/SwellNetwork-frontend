import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const SIGN_UP_USER = gql`
  mutation SignupUser($userCreateInput: UserCreateInput!) {
    signupUser(data: $userCreateInput) {
      wallet
      nodeOperator {
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
      }
    }
  }
`;
