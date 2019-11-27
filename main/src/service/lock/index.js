import { fetch } from '@/service/fetch.js'
import api from './api.js'

const parkingsLock = (stationSn, parkingType, page, pageSize, showLoading) => {
  return fetch(
    api.PARKINGS_LOCK,
    { stationSn, parkingType, page, pageSize },
    'post',
    { showLoading }
  )
}
const openOrCloseLock = (parkingSn, lockSn, action) => {
  return fetch(
    api.OPEN_OR_CLOSE_LOCK,
    {
      parkingSn,
      lockSn,
      action
    },
    'post',
    {
      noErrorMsg: true
    }
  )
}
const tweet = (parkingSn, lockSn) => {
  return fetch(
    api.TWEET,
    {
      parkingSn,
      lockSn,
      action: 'hg'
    },
    'post',
    {
      noErrorMsg: true
    }
  )
}

export default {
  openOrCloseLock,
  parkingsLock,
  tweet
}
