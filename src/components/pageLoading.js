import React, { Component } from 'react';
import Button from './uielements/button';

class PageLoading extends Component {
  render() {
    const loadingStyle = {
      margin: '20px auto'
    };
    return (<Button shape="circle" loading style={loadingStyle}/>);
  }
}

export default PageLoading;