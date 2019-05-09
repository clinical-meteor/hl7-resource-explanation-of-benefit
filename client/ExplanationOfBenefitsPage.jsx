
import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';

import { GlassCard, VerticalCanvas, FullPageCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import ExplanationOfBenefitDetail from './ExplanationOfBenefitDetail';
import ExplanationOfBenefitsTable from './ExplanationOfBenefitsTable';

Session.setDefault('explanationOfBenefitPageTabIndex', 1);
Session.setDefault('explanationOfBenefitSearchFilter', '');
Session.setDefault('selectedExplanationOfBenefitId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export class ExplanationOfBenefitsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('explanationOfBenefitPageTabIndex'),
      explanationOfBenefitSearchFilter: Session.get('explanationOfBenefitSearchFilter'),
      currentExplanationOfBenefitId: Session.get('selectedExplanationOfBenefitId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedExplanationOfBenefit: false
    };

    if (Session.get('selectedExplanationOfBenefitId')){
      data.selectedExplanationOfBenefit = ExplanationOfBenefits.findOne({_id: Session.get('selectedExplanationOfBenefitId')});
    } else {
      data.selectedExplanationOfBenefit = false;
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("ExplanationOfBenefitsPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('explanationOfBenefitPageTabIndex', index);
  }
  handleActive(index){
  }
  // this could be a mixin
  onNewTab(){
    console.log("onNewTab; we should clear things...");

    Session.set('selectedExplanationOfBenefitId', false);
    // Session.set('explanationOfBenefitDetailState', {
    //   resourceType: 'ExplanationOfBenefit',
    //   status: 'preliminary',
    //   category: {
    //     text: ''
    //   },
    //   effectiveDateTime: '',
    //   subject: {
    //     display: '',
    //     reference: ''
    //   },
    //   performer: {
    //     display: '',
    //     reference: ''
    //   },
    //   device: {
    //     display: '',
    //     reference: ''
    //   },
    //   valueQuantity: {
    //     value: '',
    //     unit: '',
    //     system: 'http://unitsofmeasure.org'
    //   }
    // });
  }
  onInsert(explanationOfBenefitId){
    Session.set('selectedExplanationOfBenefitId', false);
    Session.set('explanationOfBenefitPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ExplanationOfBenefits", recordId: explanationOfBenefitId});
  }
  onUpdate(explanationOfBenefitId){
    Session.set('selectedExplanationOfBenefitId', false);
    Session.set('explanationOfBenefitPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ExplanationOfBenefits", recordId: explanationOfBenefitId});
  }
  onRemove(explanationOfBenefitId){
    Session.set('explanationOfBenefitPageTabIndex', 1);
    Session.set('selectedExplanationOfBenefitId', false);
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ExplanationOfBenefits", recordId: explanationOfBenefitId});
  }
  onCancel(){
    Session.set('explanationOfBenefitPageTabIndex', 1);
  }
  render() {
    return (
      <div id="explanationOfBenefitsPage">
        <VerticalCanvas>
          <GlassCard height='auto'>
            <CardTitle
              title="ExplanationOfBenefits"
            />
            <Tabs id="explanationOfBenefitsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
              <Tab className="newExplanationOfBenefitTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0} >
                <ExplanationOfBenefitDetail 
                  id='newExplanationOfBenefit' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  showHints={true}
                  onInsert={ this.onInsert }
                  explanationOfBenefit={ this.data.selectedExplanationOfBenefit }
                  explanationOfBenefitId={ this.data.currentExplanationOfBenefitId } 
                  />
              </Tab>
              <Tab className="explanationOfBenefitListTab" label='ExplanationOfBenefits' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <ExplanationOfBenefitsTable 
                  displayBarcodes={false} 
                  multiline={false}
                  showSubjects={false}
                  showDevices={false}
                  />
              </Tab>
              <Tab className="explanationOfBenefitDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                <ExplanationOfBenefitDetail 
                  id='explanationOfBenefitDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  explanationOfBenefit={ this.data.selectedExplanationOfBenefit }
                  explanationOfBenefitId={ this.data.currentExplanationOfBenefitId } 
                  showPatientInputs={true}
                  showHints={false}
                  onInsert={ this.onInsert }
                  onUpdate={ this.onUpdate }
                  onRemove={ this.onRemove }
                  onCancel={ this.onCancel }
                  />
              </Tab>
            </Tabs>

          </GlassCard>
        </VerticalCanvas>
      </div>
    );
  }
}



ReactMixin(ExplanationOfBenefitsPage.prototype, ReactMeteorData);

export default ExplanationOfBenefitsPage;