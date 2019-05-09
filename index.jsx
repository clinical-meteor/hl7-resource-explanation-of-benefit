

import ExplanationOfBenefitsPage from './client/ExplanationOfBenefitsPage';
import ExplanationOfBenefitsTable from './client/ExplanationOfBenefitsTable';
import ExplanationOfBenefitDetail from './client/ExplanationOfBenefitDetail';
import VitalMeasurements from './client/VitalMeasurements';
import HealthLog from './client/HealthLog';

var DynamicRoutes = [{
  'name': 'ExplanationOfBenefitsPageRoute',
  'path': '/explanation-of-benefits',
  'component': ExplanationOfBenefitsPage,
  'requireAuth': true
}, {
  'name': 'HealthLog',
  'path': '/vitals-tracking',
  'component': HealthLog,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'ExplanationOfBenefits',
  'to': '/explanation-of-benefits',
  'href': '/explanation-of-benefits'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  ExplanationOfBenefitsPage,
  ExplanationOfBenefitsTable,
  ExplanationOfBenefitDetail,
  VitalMeasurements,

  HealthLog
};



