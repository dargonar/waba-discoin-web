import gql from 'graphql-tag';

export default gql`
    query {
        currentGame @client {
            score
        }
    }
`