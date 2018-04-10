import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';

class CreateStore extends Component {

  render() {

    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="sidebar.createStore" />
        </PageHeader>
      </LayoutContentWrapper>
    );
  }
}

export default CreateStore