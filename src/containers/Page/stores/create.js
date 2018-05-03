import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';
import set from 'lodash.set';

import Box from '../../../components/utility/box';
import Form from '../../../components/uielements/form';
import PageLoading from '../../../components/pageLoading'

import { Col, Row } from 'antd';
import Input from '../../../components/uielements/input';
import Button from '../../../components/uielements/button';
import Select, { SelectOption } from '../../../components/uielements/select'
import Async from '../../../helpers/asyncComponent';
import Dropzone from '../../../components/uielements/dropzone.js';
import DropzoneWrapper from './components/dropzone.style';
import { notification } from '../../../components';
import actions from '../../../redux/business/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
        discount_schedule: [
          { discount: '0', date: 'monday' },
          { discount: '0', date: 'tuesday' },
          { discount: '0', date: 'wednesday' },
          { discount: '0', date: 'thursday' },
          { discount: '0', date: 'friday' },
          { discount: '0', date: 'saturday' },
          { discount: '0', date: 'sunday' }
        ],
        refound_schedule: [
          { refound: '0', date: 'monday' },
          { refound: '0', date: 'tuesday' },
          { refound: '0', date: 'wednesday' },
          { refound: '0', date: 'thursday' },
          { refound: '0', date: 'friday' },
          { refound: '0', date: 'saturday' },
          { refound: '0', date: 'sunday' }
        ],
        location: {}
      }
    }
    this.inputChange = this.inputChange.bind(this);
    this.locationChange = this.locationChange.bind(this)
    this.categoryChange = this.categoryChange.bind(this)
    this.subcategoryChange = this.subcategoryChange.bind(this)
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
    this.changeSchedule = this.changeSchedule.bind(this)
    this.initForm = this.initForm.bind(this)
    this.dropzone = null;
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    if (typeof this.props.match.params.id !== 'undefined') {
      this.setState({
        loading:true,
        mode: 'edit',
        id: this.props.match.params.id
      })
      this.props.fetchBusiness( this.props.match.params.id )
    }
  }

  submit () {
    // TODO: Validation!
    this.props.saveBusiness(this.state.form)
  }

  changeSchedule(type, key, value) {
    let schedule = this.state.form[type+'_schedule']
    schedule[key][type] = Number(value);
    this.setState({
      form: {
        ...this.state.form,
        [type+'_schedule'] : schedule
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const checkLoading = (businesses) => {
      console.log(businesses,this.state.id)
      if (businesses) {
        const business = businesses.filter(x => x.account_id === this.state.id)
        if(business.length !== 0) {
          this.initForm(business[0])
        }
      }
    }

    if( this.state.loading === true) {
      checkLoading(nextProps.businesses)
    }

  }

  initForm(business) {
    this.setState({form: {
      ...this.state.form,
      ...business
    }, loading: false})
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
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }
    })
    console.log(this.state)
  }

  inputChange(e) {
    const result = set(
      { data: this.state.form },
      e.target.id,
      e.target.value
    )
    this.setState({ form : result.form   });   
    console.log(this.state.form)
  }

  categoryChange(id) {
    this.setState({
      form: {
        ...this.state.form,
        category_id: id,
        sub_category: null
      }
    })
  }

  subcategoryChange(id) {
    this.setState({
      form: {
        ...this.state.form,
        sub_subcategory: id
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

    const renderForm = () => {
      return (
        <Form style={{width:'100%'}}>
          <Box>
            <Row style={{width:'100%'}} gutter={16} >
              <Col lg={12} md={24} sm={24}>
                
                <FormItem label="Name">
                  <Input type="text"  defaultValue={this.state.form.name} id="form.name" onChange={this.inputChange} />
                </FormItem>
                
                <FormItem label="Email">
                  <Input type="email" defaultValue={this.state.form.email} id="form.email" onChange={this.inputChange} />
                </FormItem>
                
                <FormItem label="Location">
                  <BasicLeafletMapWithMarker onChange={this.locationChange} marker={{lat: this.state.form.latitude, lng: this.state.form.longitude }}/>
                </FormItem>
                
                <FormItem label="Category">
                  <Select
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={Number(this.state.form.category_id)}
                      onChange={this.categoryChange}>
                    {
                      this.props.categories
                        .filter(category => category.parent === '0')
                        .map(category => (<SelectOption key={category.id} value={Number(category.id)} selected={this.state.form.category_id == category.id}>{category.title}</SelectOption>))
                    }
                  </Select>
                </FormItem>
                <FormItem label="Subcategory">
                  <Select
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={Number(this.state.form.category_id)}
                      onChange={this.subcategoryChange}>
                    {
                      this.props.categories
                        .filter(category => Number(category.parent) === Number(this.state.form.category_id))
                        .map(category => (<SelectOption key={category.id} value={Number(category.id)} selected={this.state.form.subcategory_id == category.id}>{category.title}</SelectOption>))
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
                          Refound
                        </Col>
                        <Col>
                          Discoun
                        </Col>
                      </Row>
                    </Col>
                    {
                    this.state.form.discount_schedule.map((discount, key) => (
                      <Col sm={3} key={'discount-' + key}>
                        <Row>
                          <Col style={{textAlign:'center',textTransform:'capitalize'}}>
                            {discount.date.substr(0,3)}
                          </Col>
                          <Col>
                            <Input type='number' defaultValue={this.state.form.refound_schedule[key].refound} onChange={(e) => this.changeSchedule('refound',key,e.target.value)} style={{width:'100%'}} />
                          </Col>
                          <Col>
                            <Input type='number' defaultValue={discount.discount} onChange={(e) => this.changeSchedule('discount',key,e.target.value)} style={{width:'100%'}} />
                          </Col>
                        </Row>
                      </Col>
                    ))
                    }
                  </Row>
                </FormItem>
              </Col>
              <Col lg={12} md={24} sm={24}>
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
                  <textarea id="form.description" defaultValue= {this.state.form.description} onChange={this.inputChange} style={textAreaStyle}></textarea>
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" style={{margin: '20px 0' }} onClick={this.submit} >Save store</Button>
          </Box>
        
       </Form>
      )
    }

    return (
      <LayoutContentWrapper>
        <PageHeader>
          { (this.state.mode !== 'edit')? (<IntlMessages id="sidebar.createStore" />): 'Edit store' }
        </PageHeader>
          { (this.state.loading)? <PageLoading /> : renderForm() }
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  categories : state.Business.categories,
  businesses : state.Business.stores,
});

const mapDispatchToProps = (dispatch) => ({
  fetchBusiness: bindActionCreators(actions.fetchBusiness, dispatch),
  saveBusiness: bindActionCreators(actions.saveBusiness, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(CreateStore)