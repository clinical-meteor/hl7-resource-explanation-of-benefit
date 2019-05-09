import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const createExplanationOfBenefit = new ValidatedMethod({
  name: 'explanationOfBenefits.insert',
  validate: ExplanationOfBenefitSchema.validator(),
  run(explanationOfBenefitData) {

    console.log("createExplanationOfBenefit", explanationOfBenefitData);

    newExplanationOfBenefit = {
      status: 'final',
      category: {
        text: 'Foo'
      },
      effectiveDateTime: new Date(),
      subject: {
        display: 'Foo Faz',
        reference: '12345'
      },
      performer: {
        display: '',
        reference: ''
      },
      device: {
        display: 'Scale',
        reference: ''
      },
      valueQuantity: {
        value: 60,
        unit: '%',
        system: 'http://unitsofmeasure.org'
      }
    };

    // if (process.env.NODE_ENV === "test") {
    //   explanationOfBenefitData.test = true;
    // } else {
    //   explanationOfBenefitData.test = false;
    // }

    return ExplanationOfBenefits.insert(newExplanationOfBenefit);
  }
});

export const updateExplanationOfBenefit = new ValidatedMethod({
  name: 'explanationOfBenefits.update',
  validate: new SimpleSchema({
    _id: { type: String, optional: true }
  }).validator(),
  run({ _id, fooUpdate }) {

    // we're going to map the foo data onto a FHIR ExplanationOfBenefit resource
    let updatedExplanationOfBenefit = {
      resourceType: 'ExplanationOfBenefit',
      status: 'final',
      category: {
        text: ''
      },
      effectiveDateTime: new Date(),
      subject: {
        display: '',
        reference: ''
      },
      performer: {
        display: '',
        reference: ''
      },
      device: {
        display: '',
        reference: ''
      },
      valueQuantity: {
        value: '',
        unit: '%',
        system: 'http://unitsofmeasure.org'
      }
    };
    ExplanationOfBenefits.update(_id, { $set: updatedExplanationOfBenefit });
  }
});

export const removeExplanationOfBenefit = new ValidatedMethod({
  name: 'explanationOfBenefits.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    ExplanationOfBenefits.remove(_id);
  }
});
