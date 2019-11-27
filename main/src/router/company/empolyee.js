const employees = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/employees/')
const employeeDetail = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/employees/employee-detail')
const employeeCreate = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/employees/employee-create')

export default [{
  path: 'employee-detail',
  name: 'company-employee-detail',
  component: employeeDetail,
  meta: {
    title: '员工详情'
  }
},
{
  path: 'employees',
  name: 'company-employees',
  component: employees,
  meta: {
    title: '员工'
  }
}, {
  path: 'employee-create',
  name: 'employee-create',
  component: employeeCreate,
  meta: {
    title: '添加员工'
  }
}
]
