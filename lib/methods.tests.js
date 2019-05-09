/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { ExplanationOfBenefits } from './ExplanationOfBenefits.js/index.js';
import { newExplanationOfBenefit, updateExplanationOfBenefit, removeExplanationOfBenefit } from './methods.js';

describe('ExplanationOfBenefits methods', function () {
  beforeEach(function () {
    if (Meteor.isServer) {
      ExplanationOfBenefits.find().forEach(function(explanationOfBenefit){
        ExplanationOfBenefits.remove({_id: explanationOfBenefit._id});
      });
    }
  });

  it('inserts a foo record into the ExplanationOfBenefits collection', function () {
    let explanationOfBenefitId = newFooExplanationOfBenefit.call({
      value: 0.08,
      status: 'final',
      device: '',
      effectiveDateTime: new Date(),
      subject: {
        display: 'Julia Doe',
        reference: '55555'
      },
      performer: {
        display: 'Julia Doe',
        reference: '55555'
      }
    });
    let getExplanationOfBenefit = ExplanationOfBenefits.findOne({_id: explanationOfBenefitId });
    assert.equal(getExplanationOfBenefit.category.text, 'Foo');
    assert.equal(getExplanationOfBenefit.valueQuantity.value, 0.08);
    assert.equal(getExplanationOfBenefit.status, 'final');
    assert.equal(getExplanationOfBenefit.subject.display, 'Julia Doe');
    assert.equal(getExplanationOfBenefit.subject.reference, '55555');
    assert.equal(getExplanationOfBenefit.performer.display, 'Julia Doe');
    assert.equal(getExplanationOfBenefit.performer.reference, '55555');
    assert.ok(getExplanationOfBenefit.effectiveDateTime);
  });

  it('updates a document in the ExplanationOfBenefits collection', function () {
    const { _id } = Factory.create('explanationOfBenefit');

    updateExplanationOfBenefit.call({
      _id,
      fooUpdate: {
        explanationOfBenefitValue: 0.07,
        explanationOfBenefitType: 'BAC',
        explanationOfBenefitStatus: 'OK',
        explanationOfBenefitSource: '0',
        patientId: '0'
      }
    });

    const getExplanationOfBenefit = ExplanationOfBenefits.findOne(_id);
    assert.equal(getExplanationOfBenefit.valueQuantity.value, 0.07);
  });

  it('removes a document from the ExplanationOfBenefits collection', function () {
    const { _id } = Factory.create('document');
    removeExplanationOfBenefit.call({ _id });
    const getExplanationOfBenefit = ExplanationOfBenefits.findOne(_id);
    assert.equal(getExplanationOfBenefit, undefined);
  });
});
