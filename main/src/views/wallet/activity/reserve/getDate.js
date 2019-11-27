function formatDate(date){
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if(month < 10){
    month = '0' + month
  }
  if(day < 10){
    day = '0' + day
  }
  return `${year}/${month}/${day}`
}
export default function getDate(){
  let startDate = new Date('2018-02-08')
  let endDate = new Date('2018-02-13')
  let ret = []
  while(startDate <= endDate){
    ret.push(formatDate(startDate))
    startDate = new Date((startDate - 0) + 86400000)
  }
  return ret
}