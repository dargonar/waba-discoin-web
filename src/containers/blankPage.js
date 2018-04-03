import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';

import { compose, graphql } from 'react-apollo';
import getCurrentGame from '../apollo/getCurrentGame';

class BlankPage extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <h1>Blank Page</h1>
          {this.props.currentGame.score}
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
)(BlankPage)