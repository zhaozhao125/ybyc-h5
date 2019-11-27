import { fetch } from '@/service/fetch.js'
import api from '../api/'

const checkReserveCar = (use_car_begin_date, activity_city = 'hf') =>
  fetch(api.CHECK_RESERVE_CAR, {
    use_car_begin_date,
    activity_city
  })

const payReserveCar = (
  use_car_gener,
  use_car_days,
  use_car_city,
  use_car_begin_date,
  activity_city = 'hf'
) =>
  fetch(api.PAY_RESERVE_CAR, {
    activity_city,
    use_car_gener,
    use_car_days,
    use_car_city,
    use_car_begin_date
  })

export default {
  checkReserveCar,
  payReserveCar
}
