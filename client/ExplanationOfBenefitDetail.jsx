import { CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import { Row, Col } from 'react-bootstrap';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import { get, set } from 'lodash';



export class ExplanationOfBenefitsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      explanationOfBenefitId: false,
      explanationOfBenefit: {
        resourceType: 'ExplanationOfBenefits',
        status: 'preliminary',
        category: {
          text: ''
        },
        effectiveDateTime: '',
        subject: {
          display: '',
          reference: ''
        },
        performer: [],
        device: {
          display: '',
          reference: ''
        },
        valueQuantity: {
          value: '',
          unit: '',
          system: 'http://unitsofmeasure.org'
        },
        valueString: ''
      },
      form: {
        category: '',
        code: '',
        value: '',
        quantity: '',
        unit: '',
        deviceDisplay: '',
        subjectDisplay: '',
        subjectReference: '',
        effectiveDateTime: '',
        loincCode: '',
        loincCodeText: '',
        loincCodeDisplay: '',
        status: ''
      }
    }
  }
  dehydrateFhirResource(explanationOfBenefit) {
    let formData = Object.assign({}, this.state.form);

    formData.category = get(explanationOfBenefit, 'type.text')
    formData.code = get(explanationOfBenefit, 'code.text')
    formData.value = get(explanationOfBenefit, 'valueString')
    formData.comparator = get(explanationOfBenefit, 'valueQuantity.comparator')
    formData.quantity = get(explanationOfBenefit, 'valueQuantity.value')
    formData.unit = get(explanationOfBenefit, 'valueQuantity.unit')
    formData.deviceDisplay = get(explanationOfBenefit, 'device.display')
    formData.subjectDisplay = get(explanationOfBenefit, 'subject.display')
    formData.subjectReference = get(explanationOfBenefit, 'subject.reference')
    formData.effectiveDateTime = get(explanationOfBenefit, 'effectiveDateTime')
    formData.status = get(explanationOfBenefit, 'status')

    formData.loincCode = get(explanationOfBenefit, 'code.codeable[0].code')
    formData.loincCodeText = get(explanationOfBenefit, 'code.text')
    formData.loincCodeDisplay = get(explanationOfBenefit, 'code.codeable[0].display')

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('ExplanationOfBenefitsDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // received an explanationOfBenefit from the table; okay lets update again
    if(nextProps.explanationOfBenefitId !== this.state.explanationOfBenefitId){

      if(nextProps.explanationOfBenefit){
        this.setState({explanationOfBenefit: nextProps.explanationOfBenefit})     
        this.setState({form: this.dehydrateFhirResource(nextProps.explanationOfBenefit)})       
      }

      this.setState({explanationOfBenefitId: nextProps.explanationOfBenefitId})      
      shouldUpdate = true;
    }

    // both false; don't take any more updates
    if(nextProps.explanationOfBenefit === this.state.explanationOfBenefit){
      shouldUpdate = false;
    }
    
    return shouldUpdate;
  }
  getMeteorData() {
    let data = {
      explanationOfBenefitId: this.props.explanationOfBenefitId,
      explanationOfBenefit: false,
      form: this.state.form,
      displayDatePicker: false
    };

    if(this.props.displayDatePicker){
      data.displayDatePicker = this.props.displayDatePicker
    }
    
    if(this.props.explanationOfBenefit){
      data.explanationOfBenefit = this.props.explanationOfBenefit;
      data.form = this.dehydrateFhirResource(this.props.explanationOfBenefit);
    }

    //console.log("ExplanationOfBenefitsDetail[data]", data);
    return data;
  }

  renderDatePicker(displayDatePicker, effectiveDateTime){
    console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
    if (displayDatePicker) {
      return (
        <DatePicker 
          name='effectiveDateTime'
          hintText={ this.setHint("Date of Administration") } 
          container="inline" 
          mode="landscape"
          value={ effectiveDateTime ? effectiveDateTime : null}    
          onChange={ this.changeState.bind(this, 'effectiveDateTime')}      
          fullWidth
        />
      );
    }
  }
  setHint(text){
    if(this.props.showHints !== false){
      return text;
    } else {
      return '';
    }
  }
  render() {
    console.log('ExplanationOfBenefitsDetail.render()', this.state)
    //let formData = this.state.form;

    var patientInputs;
    if(this.props.showPatientInputs !== false){
      patientInputs = <Row>
        <Col md={6}>
          <TextField
            id='subjectDisplayInput'                
            name='subjectDisplay'
            floatingLabelText='Subject Name'
            // TimelineSidescrollPage dialog popup
            // Getting the following when passing an explanationOfBenefit in via props
            // A component is changing a controlled input of type text to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. 
            value={ get(this, 'data.form.subjectDisplay') }
            onChange={ this.changeState.bind(this, 'subjectDisplay')}
            hintText={ this.setHint('Jane Doe') }
            floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Col>
        <Col md={3}>
          <TextField
            id='subjectIdInput'                
            name='subjectReference'
            floatingLabelText='Subject ID'
            value={ get(this, 'data.form.subjectReference') }
            onChange={ this.changeState.bind(this, 'subjectReference')}
            hintText={ this.setHint('Patient/12345') }
            floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Col>
        <Col md={3}>
          <TextField
            id='categoryTextInput'                
            name='category'
            floatingLabelText='Category'
            value={ get(this, 'data.form.category') }
            onChange={ this.changeState.bind(this, 'category')}
            hintText={ this.setHint('Vital Signs') }
            floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Col>
      </Row>
    }

    return (
      <div id={this.props.id} className="explanationOfBenefitDetail">
        <CardText>
          { patientInputs }
          <Row>
          <Col md={6}>
              <TextField
                id='loincCodeTextInput'                
                name='loincCodeText'
                floatingLabelText='LOINC Code Text'
                value={ get(this, 'data.form.loincCodeText') }
                onChange={ this.changeState.bind(this, 'loincCodeText')}
                hintText={ this.setHint('HbA1c') }
                floatingLabelFixed={true}
                value={ get(this, 'data.form.loincCodeText') }
                onChange={ this.changeState.bind(this, 'loincCodeText')}
                hintText={ this.setHint('HbA1c') }
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={2}>
              <TextField
                id='loincCodeInput'                
                name='loincCode'
                floatingLabelText='LOINC Code'
                value={ get(this, 'data.form.loincCode') }
                onChange={ this.changeState.bind(this, 'loincCode')}
                hintText={ this.setHint('4548-4') }
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={4}>
              <TextField
                id='loincDisplayInput'                
                name='loincCodeText'
                floatingLabelText='LOINC Display'
                value={ get(this, 'data.form.loincCodeText') }
                onChange={ this.changeState.bind(this, 'loincCodeText')}
                hintText={ this.setHint('4548-4') }
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>

          <Row>
            <Col md={2}>
              <TextField
                id='comparatorInput'                
                name='valueQuantity.comparator'
                floatingLabelText='Comparator'
                hintText={ this.setHint('< | <= | >= | >') }
                value={ get(this, 'data.form.comparator') }
                onChange={ this.changeState.bind(this, 'comparator')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={2}>
              <TextField
                id='valueQuantityInput'                
                name='valueQuantity.value'
                floatingLabelText='Quantity'
                hintText={ this.setHint('70.0') }
                value={ get(this, 'data.form.quantity') }
                onChange={ this.changeState.bind(this, 'quantity')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={2}>
              <TextField
                id='valueQuantityUnitInput'                
                name='valueQuantity.unit'
                floatingLabelText='Unit'
                hintText={ this.setHint('kg') }
                value={ get(this, 'data.form.unit') }
                onChange={ this.changeState.bind(this, 'unit')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='valueStringInput'                
                name='value'
                floatingLabelText='Value'
                hintText={ this.setHint('AB+; pos; neg') }
                value={ get(this, 'data.form.value') }
                onChange={ this.changeState.bind(this, 'value')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='statusInput'                
                name='status'
                floatingLabelText='Status'
                value={ get(this, 'data.form.status') }
                onChange={ this.changeState.bind(this, 'status')}
                hintText={ this.setHint('preliminary | final') }
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <TextField
                id='deviceDisplayInput'                
                name='deviceDisplay'
                floatingLabelText='Device Name'
                value={ get(this, 'data.form.deviceDisplay') }
                onChange={ this.changeState.bind(this, 'deviceDisplay')}
                hintText={ this.setHint('iHealth Blood Pressure Cuff') }
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='deviceReferenceInput'                
                name='deviceReference'
                floatingLabelText='Device Name'
                // value={ get(this, 'data.form.deviceReference') }
                // onChange={ this.changeState.bind(this, 'deviceReference')}
                hintText={ this.setHint('Device/444') }
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <br />
              { this.renderDatePicker(this.data.displayDatePicker, get(this, 'data.form.effectiveDateTime') ) }
            </Col>

          </Row>
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.explanationOfBenefitId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(explanationOfBenefitId) {
    if (explanationOfBenefitId) {
      return (
        <div>
          <RaisedButton id="updateExplanationOfBenefitsButton" label="Save" className="saveExplanationOfBenefitsButton" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}}  />
          <RaisedButton id="deleteExplanationOfBenefitsButton" label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return (
        <RaisedButton id="saveExplanationOfBenefitsButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }
  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ExplanationOfBenefitsDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "category":
        set(formData, 'category', textValue)
        break;
      case "code":
        set(formData, 'code', textValue)
        break;        
      case "value":
        set(formData, 'value', textValue)
        break;        
      case "comparator":
        set(formData, 'comparator', textValue)
        break;
      case "quantity":
        set(formData, 'quantity', textValue)
        break;
      case "unit":
        set(formData, 'unit', textValue)
        break;
      case "deviceDisplay":
        set(formData, 'deviceDisplay', textValue)
        break;
      case "subjectDisplay":
        set(formData, 'subjectDisplay', textValue)
        break;
      case "subjectReference":
        set(formData, 'subjectReference', textValue)
        break;
      case "effectiveDateTime":
        set(formData, 'effectiveDateTime', textValue)
        break;
      case "status":
        set(formData, 'status', textValue)
        break;
      case "loincCode":
        set(formData, 'loincCode', textValue)
        break;
      case "loincCodeText":
        set(formData, 'loincCodeText', textValue)
        break;
      case "loincCodeDisplay":
        set(formData, 'loincCodeDisplay', textValue)
        break;
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateExplanationOfBenefits(explanationOfBenefitData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ExplanationOfBenefitsDetail.updateExplanationOfBenefits", explanationOfBenefitData, field, textValue);

    switch (field) {
      case "category":
        set(explanationOfBenefitData, 'category.text', textValue)
        break;
      case "code":
        set(explanationOfBenefitData, 'code.text', textValue)
        break;        
      case "value":
        set(explanationOfBenefitData, 'valueString', textValue)
        break;        
      case "comparator":
        set(explanationOfBenefitData, 'valueQuantity.comparator', textValue)
        break;        
      case "quantity":
        set(explanationOfBenefitData, 'valueQuantity.value', textValue)
        break;
      case "unit":
        set(explanationOfBenefitData, 'valueQuantity.unit', textValue)
        break;
      case "deviceDisplay":
        set(explanationOfBenefitData, 'device.display', textValue)
        break;
      case "subjectDisplay":
        set(explanationOfBenefitData, 'subject.display', textValue)
        break;
      case "subjectReference":
        set(explanationOfBenefitData, 'subject.reference', textValue)
        break;
      case "effectiveDateTime":
        set(explanationOfBenefitData, 'effectiveDateTime', textValue)
        break;    
      case "status":
        set(explanationOfBenefitData, 'status', textValue)
        break;    
      case "loincCode":
        set(explanationOfBenefitData, 'code.coding[0].code', textValue)
        break;
      case "loincCodeText":
        set(explanationOfBenefitData, 'code.text', textValue)
        break;
      case "loincCodeDisplay":
        set(explanationOfBenefitData, 'code.coding[0].display', textValue)
        break;
    }
    return explanationOfBenefitData;
  }

  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("ExplanationOfBenefitsDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let explanationOfBenefitData = Object.assign({}, this.state.explanationOfBenefit);

    formData = this.updateFormData(formData, field, textValue);
    explanationOfBenefitData = this.updateExplanationOfBenefits(explanationOfBenefitData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("explanationOfBenefitData", explanationOfBenefitData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({explanationOfBenefit: explanationOfBenefitData})
    this.setState({form: formData})
  }


  
  // this could be a mixin
  handleSaveButton() {
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new ExplanationOfBenefits...', this.state)

    let self = this;
    let fhirExplanationOfBenefitsData = Object.assign({}, this.state.explanationOfBenefit);

    if(process.env.NODE_ENV === "test") console.log('fhirExplanationOfBenefitsData', fhirExplanationOfBenefitsData);


    let explanationOfBenefitValidator = ExplanationOfBenefitsSchema.newContext();
    explanationOfBenefitValidator.validate(fhirExplanationOfBenefitsData)

    console.log('IsValid: ', explanationOfBenefitValidator.isValid())
    console.log('ValidationErrors: ', explanationOfBenefitValidator.validationErrors());

    if (this.data.explanationOfBenefitId) {
      if(process.env.NODE_ENV === "test") console.log("Updating explanationOfBenefit...");
      delete fhirExplanationOfBenefitsData._id;

      ExplanationOfBenefitss._collection.update({_id: this.data.explanationOfBenefitId}, {$set: fhirExplanationOfBenefitsData },function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("ExplanationOfBenefitss.insert[error]", error);
          console.log('error', error)
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          if(self.props.onUpdate){
            self.props.onUpdate(self.data.explanationOfBenefitId);
          }
          Bert.alert('ExplanationOfBenefits added!', 'success');
        }
      });
    } else {
      fhirExplanationOfBenefitsData.effectiveDateTime = new Date();
      if (process.env.NODE_ENV === "test") console.log("create a new explanationOfBenefit", fhirExplanationOfBenefitsData);

      ExplanationOfBenefitss._collection.insert(fhirExplanationOfBenefitsData, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("ExplanationOfBenefitss.insert[error]", error);
          console.log('error', error)
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          if(self.props.onInsert){
            self.props.onInsert(self.data.explanationOfBenefitId);
          }
          Bert.alert('ExplanationOfBenefits added!', 'success');
        }
      });
    }
  }

  // this could be a mixin
  handleCancelButton() {
    if(this.props.onCancel){
      this.props.onCancel();
    }
  }

  handleDeleteButton() {
    console.log('Delete explanationOfBenefit...', this.data.explanationOfBenefitId)
    let self = this;
    ExplanationOfBenefitss._collection.remove({_id: this.data.explanationOfBenefitId}, function(error, result){
      if (error) {
        console.log('error', error)
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        if(this.props.onDelete){
          this.props.onDelete(self.data.explanationOfBenefitId);
        }
        Bert.alert('ExplanationOfBenefits deleted!', 'success');
      }
    })
  }
}

ExplanationOfBenefitsDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  explanationOfBenefitId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  explanationOfBenefit: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
ReactMixin(ExplanationOfBenefitsDetail.prototype, ReactMeteorData);
export default ExplanationOfBenefitsDetail;