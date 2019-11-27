import employee from './employee'
import apply from './apply'
import companyInfo from './companyInfo'
import bill from './bill'
export default {
  ...employee,
  ...apply,
  ...companyInfo,
  ...bill
}
