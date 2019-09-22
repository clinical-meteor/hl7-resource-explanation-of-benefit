

import ExplanationOfBenefitsPage from './client/ExplanationOfBenefitsPage';
import ExplanationOfBenefitsTable from './client/ExplanationOfBenefitsTable';
import ExplanationOfBenefitDetail from './client/ExplanationOfBenefitDetail';

var DynamicRoutes = [{
  'name': 'ExplanationOfBenefitsPageRoute',
  'path': '/explanation-of-benefits',
  'component': ExplanationOfBenefitsPage,
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
  ExplanationOfBenefitDetail
};



