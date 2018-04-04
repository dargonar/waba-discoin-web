import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';

import { compose, graphql } from 'react-apollo';
import getCurrentGame from '../../apollo/getCurrentGame';

class DiscountsAndRewards extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default compose(
  graphql(getCurrentGame, {
    props: ({data: { currentGame } }) => ({
      currentGame
    })
  })
)(DiscountsAndRewards)