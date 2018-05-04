import React, { Component} from 'react'
import { Modal } from 'antd';

class MessageBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rendered: false
    }
    this.close = this.close.bind(this)
  }
  close() {
    this.props.clean();
    this.setState({ rendered: false })
  }
  render() {
    console.log(this.props.error)
    if (typeof this.props.msg === 'string' && this.state.rendered === false) {
      this.setState({rendered: true})
      Modal[(this.props.error === true)? 'error': 'info']({
        title: this.props.msg,
        onOk: this.close,
      })
    }
    return (<div></div>);
  }
}

export default MessageBox;
