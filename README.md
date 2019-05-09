## clinical:hl7-resource-explanation-of-benefits


#### Licensing  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)


#### Integration & Verification Tests  
[![CircleCI](https://circleci.com/gh/clinical-meteor/hl7-resource-explanation-of-benefits/tree/master.svg?style=svg)](https://circleci.com/gh/clinical-meteor/hl7-resource-explanation-of-benefits/tree/master)


#### API Reference  
The resource in this package implements the FHIR ExplanationOfBenefit Resource DTSU2 schema provided at  [https://www.hl7.org/fhir/DSTU2/explanation-of-benefits.html](https://www.hl7.org/fhir/DSTU2/explanation-of-benefits.html).  


#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-explanation-of-benefits

# to initialize default data
INITIALIZE=true meteor
````


#### Example   

```js
var newExplanationOfBenefit = {}
ExplanationOfBenefits.insert(newExplanationOfBenefit);
```

#### Extending the Schema

```js
ExtendedExplanationOfBenefitSchema = new SimpleSchema([
  ExplanationOfBenefitSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
ExplanationOfBenefits.attachSchema( ExtendedExplanationOfBenefitSchema );
```


#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).



#### Acknowledgements     

Many thanks to iHealth Labs, DxRx Medical, VisExcell, Parkland Center for Care Innovation, and many others for their support in creating this library.    