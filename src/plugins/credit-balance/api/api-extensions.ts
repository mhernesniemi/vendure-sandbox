import gql from "graphql-tag";

export const shopApiExtensions = gql`
  type CreditBalance implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    balanceChange: Int!
    description: String!
  }

  extend type Customer {
    creditBalances: [CreditBalance!]!
  }

  extend type Query {
    activeCustomerCreditBalances: [CreditBalance!]!
  }

  extend type Mutation {
    addCreditBalance(
      balanceChange: Int!
      description: String!
    ): [CreditBalance!]!
    removeCreditBalance(id: ID!): [CreditBalance!]!
  }
`;
