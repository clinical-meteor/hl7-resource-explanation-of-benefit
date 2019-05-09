import SimpleSchema from 'simpl-schema';

// create the object using our BaseModel
ExplanationOfBenefit = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
ExplanationOfBenefit.prototype._collection = ExplanationOfBenefits;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof ExplanationOfBenefits === 'undefined'){
  if(Package['clinical:autopublish']){
    ExplanationOfBenefits = new Mongo.Collection('ExplanationOfBenefits');
  } else if(Package['clinical:desktop-publish']){    
    ExplanationOfBenefits = new Mongo.Collection('ExplanationOfBenefits');
  } else {
    ExplanationOfBenefits = new Mongo.Collection('ExplanationOfBenefits', {connection: null});
  }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
ExplanationOfBenefits._transform = function (document) {
  return new ExplanationOfBenefit(document);
};




ExplanationOfBenefitDstu2 = new SimpleSchema({
  'resourceType' : {
    type: String,
    defaultValue: 'ExplanationOfBenefit'
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },

});




ExplanationOfBenefitStu3 = new SimpleSchema({
  'resourceType' : {
    type: String,
    defaultValue: 'ExplanationOfBenefit'
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    }
});



ExplanationOfBenefitSchema = ExplanationOfBenefitDstu2;


BaseSchema.extend(ExplanationOfBenefitSchema);
DomainResourceSchema.extend(ExplanationOfBenefitSchema);
ExplanationOfBenefits.attachSchema(ExplanationOfBenefitSchema);

export default { ExplanationOfBenefit, ExplanationOfBenefits, ExplanationOfBenefitSchema, ExplanationOfBenefitDstu2, ExplanationOfBenefitStu3 };