
Meteor.methods({
  createExplanationOfBenefit:function(explanationOfBenefitObject){
    check(explanationOfBenefitObject, Object);

    if (process.env.NODE_ENV === 'test') {
      console.log('Creating ExplanationOfBenefit...');
      ExplanationOfBenefits.insert(explanationOfBenefitObject, function(error, result){
        if (error) {
          console.log(error);
        }
        if (result) {
          console.log('ExplanationOfBenefit created: ' + result);
        }
      });
    } else {
      console.log('This command can only be run in a test environment.');
      console.log('Try setting NODE_ENV=test');
    }
  },
  initializeExplanationOfBenefit:function(explanationOfBenefitValue, deviceId){
    check(explanationOfBenefitValue, Number);
    check(deviceId, String);

    if (ExplanationOfBenefits.find().count() === 0) {
      console.log('No records found in ExplanationOfBenefits collection.  Lets create some...');

      var defaultExplanationOfBenefit = {
        resourceType: 'ExplanationOfBenefit',
        status: 'final',
        category: {
          text: 'Weight'
        },
        effectiveDateTime: new Date(),
        subject: {
          display: 'Jane Doe',
          reference: ''
        },
        performer: {
          display: '',
          reference: ''
        },
        device: {
          display: 'Withings Weight Scale',
          reference: deviceId
        },
        valueQuantity: {
          value: explanationOfBenefitValue,
          unit: 'kg',
          system: 'http://unitsofmeasure.org'
        }
      };

      if (this.userId) {
        let user = Meteor.users.findOne({_id: this.userId});
        if (user && user.profile && user.profile.name && user.profile.name.text) {

          //   display: Patients.findByUserId(this.userId).fullName(),
          //   reference: 'Patients/' + Patients.findByUserId(this.userId).patientId()

          defaultExplanationOfBenefit.subject.display = user.profile.name.text;
          defaultExplanationOfBenefit.subject.reference = 'Meteor.users/' + this.userId;

          defaultExplanationOfBenefit.performer.display = user.profile.name.text;
          defaultExplanationOfBenefit.performer.reference = 'Meteor.users/' + this.userId;
        }
      }

      Meteor.call('createExplanationOfBenefit', defaultExplanationOfBenefit);
    } else {
      console.log('ExplanationOfBenefits already exist.  Skipping.');
    }
  },
  removeExplanationOfBenefitById: function(explanationOfBenefitId){
    check(explanationOfBenefitId, String);

    console.log('-----------------------------------------');
    console.log('Removing explanationOfBenefit... ');

    return ExplanationOfBenefits.remove({_id: explanationOfBenefitId})
  },
  dropExplanationOfBenefits: function(){
    // if (process.env.NODE_ENV === 'test') {
    console.log('-----------------------------------------');
    console.log('Dropping ' + ExplanationOfBenefits.find().count() + ' explanationOfBenefits...');

    ExplanationOfBenefits.find().forEach(function(explanationOfBenefit){
      console.log('explanationOfBenefit', explanationOfBenefit.id)
      ExplanationOfBenefits.remove({id: explanationOfBenefit.id}, function(err){
        if(err) console.log(err)
      });
    });

    // } else {
    //   console.log('This command can only be run in a test environment.');
    //   console.log('Try setting NODE_ENV=test');
    // }
  }

});
  