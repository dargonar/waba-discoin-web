import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';

import Box from '../../../components/utility/box';
import Form from '../../../components/uielements/form';

import { Col, Row } from 'antd';
import Input from '../../../components/uielements/input';
import Button from '../../../components/uielements/button';
import Select, { SelectOption } from '../../../components/uielements/select'
import Async from '../../../helpers/asyncComponent';
import Dropzone from '../../../components/uielements/dropzone.js';
import DropzoneWrapper from './components/dropzone.style';
import { notification } from '../../../components';

import { connect } from 'react-redux';

const FormItem = Form.Item;

const BasicLeafletMapWithMarker = props => (
  <Async
    load={import(/* webpackChunkName: "basicLeafletMapWithMarker" */ './components/map.js')}
    componentProps={props}
    componentArguement={'leafletMap'}
  />
);

class CreateStore extends Component {
  constructor(props){
    super(props);
    this.state = { 
      form: {
        location: {}
      }
    }
    this.inputChange = this.inputChange.bind(this);
    this.locationChange = this.locationChange.bind(this)
    this.categorieChange = this.categorieChange.bind(this)
    this.subcategorieChange = this.subcategorieChange.bind(this)
    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      parallelUploads: 1,
      uploadMultiple: false,
      maxFilesize: 1, // MB
      dictRemoveFile: 'Delete',
      dictCancelUploadConfirmation: 'Are you sure to cancel upload?',
      postUrl: 'no-url'
    };
    this.djsConfig = { autoProcessQueue: false };
    this.imageUpload = this.imageUpload.bind(this)
    this.dropzone = null;
  }

  imageUpload(file) {
    this.setState({
      form: {
        ...this.state.form,
        image: file.dataURL
      }
    })
    this.dropzone.emit("complete", file);
  }

  locationChange(e) {
    this.setState({
      form: {
        ...this.state.form,
        location: {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        }
      }
    })
    console.log(this.state)
  }

  inputChange(e) {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.id]: e.target.value
      }
    })
    console.log(this.state)
  }

  categorieChange(id) {
    this.setState({
      form: {
        ...this.state.form,
        categorie: id,
        subcategorie: null
      }
    })
  }

  subcategorieChange(id) {
    this.setState({
      form: {
        ...this.state.form,
        subcategorie: id
      }
    })
  }

  render() {
    const textAreaStyle = {
      width: '100%',
      padding: '10px',
      height: '221px',
      borderRadius: '4px',
      border: '1px solid #e9e9e9'
    }

    const eventHandlers = {
      init: dz => { 
        this.dropzone = dz; 
        dz.on('addedfile', function(file) {
          if (dz.files.length > 1) {
            dz.removeFile(dz.files[0]);
          }
        });
      },
      addedfile: file => this.imageUpload(file)
    };

    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="sidebar.createStore" />
        </PageHeader>
        <Box>
          <Form>
              <Row style={{width:'100%'}} gutter={16} >
                <Col md={12} sm={24}>
                  
                  <FormItem label="Name">
                    <Input type="text" id="name" onChange={this.inputChange} />
                  </FormItem>
                  
                  <FormItem label="Email">
                    <Input type="email" id="email" onChange={this.inputChange} />
                  </FormItem>
                  
                  <FormItem label="Location">
                    <BasicLeafletMapWithMarker onChange={this.locationChange} marker={this.state.form.location}/>
                  </FormItem>
                  
                  <FormItem label="Category">
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        onChange={this.categorieChange}>
                      {
                        this.props.categories
                          .filter(categorie => categorie.parent === '0')
                          .map(categorie => (<SelectOption key={categorie.id}>{categorie.title}</SelectOption>))
                      }
                    </Select>
                  </FormItem>
                  
                  <FormItem label="Subcategory">
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        onChange={this.subcategorieChange}>
                      {
                        this.props.categories
                          .filter(categorie => categorie.parent === this.state.form.categorie)
                          .map(categorie => (<SelectOption key={categorie.id}>{categorie.title}</SelectOption>))
                      }
                    </Select>
                  </FormItem>
                  
                  <FormItem label="Rates">
                    <Row style={{width:'100%'}}>
                      <Col sm={3}>
                        <Row style={{width:'100%', textAlign:'center'}}>
                          <Col>
                            Type
                          </Col>
                          <Col>
                            Refund
                          </Col>
                          <Col>
                            Discoun
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={3}>
                        <Row>
                          <Col style={{textAlign:'center'}}>
                            Mon
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={3}>
                        <Row>
                          <Col style={{textAlign:'center'}}>
                            Tue
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={3}>
                        <Row>
                          <Col style={{textAlign:'center'}}>
                            Wed
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={3}>
                        <Row>
                          <Col style={{textAlign:'center'}}>
                            Thu
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={3}>
                        <Row>
                          <Col style={{textAlign:'center'}}>
                            Fri
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={3}>
                        <Row>
                          <Col style={{textAlign:'center'}}>
                            Sat
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={3}>
                        <Row>
                          <Col style={{textAlign:'center'}}>
                            Sun
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                          <Col>
                            <Input type='number' style={{width:'100%'}} />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col md={12} sm={24}>
                  <FormItem label="Image">
                    <DropzoneWrapper>
                      <Dropzone
                        config={this.componentConfig}
                        eventHandlers={eventHandlers}
                        djsConfig={this.djsConfig}
                      />
                    </DropzoneWrapper>
                  </FormItem>
                  <FormItem  label="Description">
                    <textarea id="description" onChange={this.inputChange} style={textAreaStyle}></textarea>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Box>
          <Button type="primary" style={{marginLeft: 'auto' }} onClick={this.submit} >Save store</Button>
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  categories : state.Business.categories,
});

const mapDispatchToProps = (dispatch) => ({
  
})


export default connect(mapStateToProps, mapDispatchToProps)(CreateStore)