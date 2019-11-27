import {fetch} from '@/service/fetch.js'
import api from './api/'

/**
 * 获取企业员工列表
 * @param {Number} page 页码
 * @param {String} companySn 企业编号
 */
const getEmployeeList = (page, companySn) => {
  return fetch(api.GET_EMPLOYEE_LIST, {
    page,
    pageSize: 20,
    companySn
  }, 'post', {
    showLoading: false
  })
}

/**
 * 获取员工状态 status： notExists（未注册）isStaff（已经是企业员工）ok（已注册）
 * @param {String} phone 手机号
 */
const getEmployeeStatus = (phone) => {
  return fetch(api.GET_EMPLOYEE_STATUS, {
    phone
  })
}

/**
 * 添加员工
 * @param {Object} params companySn、userId、uid
 */
const addEmployee = (params) => {
  console.log('====params====', params)
  return fetch(api.ADD_EMPLOYEE, params)
}

/**
 * 获取员工详情
 * @param {String} staffId 员工id
 */
const getEmployeeDetail = (staffId) => {
  return fetch(api.GET_EMPLOYEE_DETAIL, {
    staffId
  })
}

/**
 * 获取企业订单列表
 * @param {Number} page 页码
 * @param {Object} params companySn、whetherThisMonth（是否获取当月企业订单）、userId
 */
const getCompanyOrderList = (page, params) => {
  return fetch(api.GET_COMPANY_ORDER_LIST, {
    page,
    pageSize: 20,
    ...params
  }, 'post', {
    showLoading: false
  })
}

/**
 * 企业移除员工
 * @param {String} staffId 员工id
 */
const removeEmployee = (staffId) => {
  return fetch(api.REMOVE_EMPLOYEE, {
    staffId
  })
}

export default {
  getEmployeeList,
  getEmployeeStatus,
  addEmployee,
  getEmployeeDetail,
  getCompanyOrderList,
  removeEmployee
}
