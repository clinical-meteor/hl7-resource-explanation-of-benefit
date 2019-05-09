import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Card, CardMedia, CardTitle, CardText, CardActions, Toggle } from 'material-ui';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Table } from 'react-bootstrap';

import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';
import { get } from 'lodash';

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';

flattenExplanationOfBenefit = function(explanationOfBenefit){
  let result = {
    _id: '',
    meta: '',
    category: '',
    code: '',
    valueString: '',
    value: '',
    explanationOfBenefitValue: '',
    subject: '',
    subjectId: '',
    status: '',
    device: '',
    createdBy: '',
    effectiveDateTime: '',
    issued: '',
    unit: ''
  };

  result._id =  get(explanationOfBenefit, 'id') ? get(explanationOfBenefit, 'id') : get(explanationOfBenefit, '_id');
  result.category = get(explanationOfBenefit, 'category.text', '');
  result.code = get(explanationOfBenefit, 'code.text', '');
  result.valueString = get(explanationOfBenefit, 'valueString', '');
  result.comparator = get(explanationOfBenefit, 'valueQuantity.comparator', '');
  result.explanationOfBenefitValue = get(explanationOfBenefit, 'valueQuantity.value', '');
  result.unit = get(explanationOfBenefit, 'valueQuantity.unit', '');
  result.subject = get(explanationOfBenefit, 'subject.display', '');
  result.subjectId = get(explanationOfBenefit, 'subject.reference', '');
  result.device = get(explanationOfBenefit, 'device.display', '');
  result.status = get(explanationOfBenefit, 'status', '');
  
  if(get(explanationOfBenefit, 'effectiveDateTime')){
    result.effectiveDateTime =  moment(get(explanationOfBenefit, 'effectiveDateTime')).format("YYYY-MM-DD hh a");
  }
  if(get(explanationOfBenefit, 'issued')){
    result.effectiveDateTime =  moment(get(explanationOfBenefit, 'issued')).format("YYYY-MM-DD hh a");    
  }



  result.meta = get(explanationOfBenefit, 'category.text', '');

  if(result.valueString.length > 0){
    result.value = result.valueString;
  } else {
    result.value = result.comparator + ' ' + result.explanationOfBenefitValue + ' ' + result.unit;
  }




  return result;
}



// db.inventory.find( { item: { $not: /^p.*/ } } )  



export class ExplanationOfBenefitsTable extends React.Component {

  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        text: Glass.darkroom()
      },
      selected: [],
      explanationOfBenefits: []
    };


    if(this.props.data){
      console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(explanationOfBenefit){
          data.explanationOfBenefits.push(flattenExplanationOfBenefit(explanationOfBenefit));
        });  
      }
    } else {
      let query = {};
      if(this.props.query){
        query = this.props.query
      }
      if(this.props.hideEnteredInError){
        query['verificationStatus'] = {
          $nin: ['entered-in-error']  // unconfirmed | provisional | differential | confirmed | refuted | entered-in-error
        }
      }

      data.explanationOfBenefits = ExplanationOfBenefits.find(query).map(function(explanationOfBenefit){
        return flattenExplanationOfBenefit(explanationOfBenefit);
      });
    }


    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = "blur(3px)";
      data.style.WebkitFilter = "blur(3px)";
    }

    // this could be another mixin
    if (Session.get('backgroundBlurEnabled')) {
      data.style.backdropFilter = "blur(5px)";
    }

    if(process.env.NODE_ENV === "test") console.log("ExplanationOfBenefitsTable[data]", data);
    return data;
  }
  handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }
  displayOnMobile(width){
    let style = {};
    if(['iPhone'].includes(window.navigator.platform)){
      style.display = "none";
    }
    if(width){
      style.width = width;
    }
    return style;
  }
  handleSelect(selected) {
    this.setState({selected});
  }
  getDate(){
    return "YYYY/MM/DD";
  }
  noChange(){
    return "";
  }
  rowClick(id){
    Session.set("selectedExplanationOfBenefitId", id);
    Session.set('explanationOfBenefitPageTabIndex', 2);
    Session.set('explanationOfBenefitDetailState', false);
  }
  renderBarcode(id){
    if (this.props.displayBarcodes) {
      return (
        <td><span className="barcode">{id}</span></td>
      );
    }
  }
  renderBarcodeHeader(){
    if (this.props.displayBarcodes) {
      return (
        <th>_id</th>
      );
    }
  }
  renderSubject(id){
    if (this.props.showSubjects) {
      return (
        <td className='name'>{ id }</td>
      );
    }
  }
  renderSubjectHeader(){
    if (this.props.showSubjects) {
      return (
        <th className='name'>subject</th>
      );
    }
  }
  renderDevice(device){
    if (this.props.showDevices) {
      return (
        <td className='device.display'>{device }</td>
      );
    }
  }
  renderDeviceHeader(){
    if (this.props.showDevices) {
      return (
        <th className='device.display'>device</th>
      );
    }
  }

  renderValue(valueString){
    if (this.props.showvalueString) {
      return (
        <td className='value'>{ valueString }</td>
      );
    }
  }
  renderValueHeader(){
    if (this.props.showValueString) {
      return (
        <th className='value'>Value</th>
      );
    }
  }

  renderCodeHeader(){
    if (this.props.multiline === false) {
      return (
        <th className='code'>Code</th>
      );
    }
  }

  renderCategoryHeader(){
    if (this.props.multiline === false) {
      return (
        <th className='category'>Category</th>
      );
    }
  }


  renderValueString(valueString){
    if (this.props.showValueString) {
      return (
        <td className='value'>{ valueString }</td>
      );
    }
  }
  renderValueStringHeader(){
    if (this.props.showValueString) {
      return (
        <th className='value'>Value</th>
      );
    }
  }
  renderComparator(comparator){
    if (this.props.showComparator) {
      return (
        <td className='comparator'>{ comparator }</td>
      );
    }
  }
  renderComparatorHeader(){
    if (this.props.showComparator) {
      return (
        <th className='comparator'>Comparator</th>
        );
    }
  }
  renderToggleHeader(){
    if (!this.props.hideToggle) {
      return (
        <th className="toggle" style={{width: '60px'}} >Toggle</th>
      );
    }
  }
  renderToggle(){
    if (!this.props.hideToggle) {
      return (
        <td className="toggle" style={{width: '60px'}}>
            <Toggle
              defaultToggled={true}
            />
          </td>
      );
    }
  }
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <th className='actionIcons' style={{minWidth: '120px'}}>Actions</th>
      );
    }
  }
  renderActionIcons(actionIcons ){
    if (!this.props.hideActionIcons) {
      return (
        <td className='actionIcons' style={{minWidth: '120px'}}>
          <FaLock style={{marginLeft: '2px', marginRight: '2px'}} />
          <FaTags style={{marginLeft: '2px', marginRight: '2px'}} />
          <FaCode style={{marginLeft: '2px', marginRight: '2px'}} />
          <FaPuzzlePiece style={{marginLeft: '2px', marginRight: '2px'}} />          
        </td>
      );
    }
  } 
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.explanationOfBenefits.length; i++) {
      if(this.props.multiline){
        tableRows.push(
          <tr className="explanationOfBenefitRow" key={i} style={this.data.style.text} onClick={ this.rowClick.bind(this, this.data.explanationOfBenefits[i]._id)} >
            {/* <td className='category'>{this.data.explanationOfBenefits[i].category }</td> */}
            { this.renderToggle() }
            { this.renderActionIcons() }
            <td className='code'>
              <b>{this.data.explanationOfBenefits[i].code }</b> <br />
              {this.data.explanationOfBenefits[i].value }
              </td>
            {/* {this.renderComparator(this.data.explanationOfBenefits[i].comparator)}
            {this.renderValueString(this.data.explanationOfBenefits[i].explanationOfBenefitValue)} */}
            {this.renderValue(this.data.explanationOfBenefits[i].explanationOfBenefitValue)}
            {/* <td className='unit'>{this.data.explanationOfBenefits[i].unit }</td> */}
            {this.renderSubject(this.data.explanationOfBenefits[i].subject)}
            <td className='status' style={ this.displayOnMobile()} >{this.data.explanationOfBenefits[i].status }</td>
            {this.renderDevice(this.data.explanationOfBenefits[i].device)}
            <td className='date' style={{minWidth: '140px'}}>{this.data.explanationOfBenefits[i].effectiveDateTime }</td>
            {this.renderBarcode(this.data.explanationOfBenefits[i]._id)}
          </tr>
        );    

      } else {
        tableRows.push(
          <tr className="explanationOfBenefitRow" key={i} style={this.data.style.text} onClick={ this.rowClick.bind(this, this.data.explanationOfBenefits[i]._id)} >            
            { this.renderToggle() }
            { this.renderActionIcons() }
            <td className='category'>{this.data.explanationOfBenefits[i].category }</td>
            <td className='code'>{this.data.explanationOfBenefits[i].code }</td>
            {/* {this.renderComparator(this.data.explanationOfBenefits[i].comparator)}
            {this.renderValueString(this.data.explanationOfBenefits[i].explanationOfBenefitValue)} */}
            {this.renderValue(this.data.explanationOfBenefits[i].explanationOfBenefitValue)}
            {/* <td className='unit'>{this.data.explanationOfBenefits[i].unit }</td> */}
            {this.renderSubject(this.data.explanationOfBenefits[i].subject)}
            <td className='status' style={ this.displayOnMobile()} >{this.data.explanationOfBenefits[i].status }</td>
            {this.renderDevice(this.data.explanationOfBenefits[i].device)}
            <td className='date' style={{minWidth: '140px'}}>{this.data.explanationOfBenefits[i].effectiveDateTime }</td>
            {this.renderBarcode(this.data.explanationOfBenefits[i]._id)}
          </tr>
        );    
      }
    }


    return(
      <CardText>
        <Table id="explanationOfBenefitsTable" hover >
          <thead>
            <tr>
              {/* <th className='meta' style={ this.displayOnMobile('100px')}>Meta</th> */}
              {/* <th className='category'>Category</th>
              <th className='code'>Code</th> */}

              { this.renderToggleHeader() }
              { this.renderActionIconsHeader() }
              {this.renderCategoryHeader() }
              {this.renderCodeHeader() }
              {/* {this.renderComparatorHeader() }
              {this.renderValueStringHeader() } */}
              {this.renderValueHeader() }
              {/* <th className='unit'>Unit</th> */}
              {this.renderSubjectHeader() }
              <th className='status' style={ this.displayOnMobile()} >Status</th>
              {this.renderDeviceHeader() }
              <th className='date' style={{minWidth: '140px'}}>Date</th>
              {this.renderBarcodeHeader() }
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
      </CardText>
    );
  }
}

ExplanationOfBenefitsTable.propTypes = {
  barcodes: PropTypes.bool,
  data: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showSubjects: PropTypes.bool,
  showDevices: PropTypes.bool,
  showValueString: PropTypes.bool,
  showComparator: PropTypes.bool,
  hideToggle: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  enteredInError: PropTypes.bool,
  multiline: PropTypes.bool
};

ReactMixin(ExplanationOfBenefitsTable.prototype, ReactMeteorData);
export default ExplanationOfBenefitsTable; 