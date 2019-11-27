var set = new Set()
var code = ``
var codeArr = code.split('\n')
var obj = {}
codeArr.forEach(item => {
  if (item.match(/-moz-|-ms-|-webkit-/)) {
    return
  }
  item = item.trim().replace(';', '')
  if (set.has(item)) {
    if (obj[item]) {
      obj[item] = obj[item] + 1
    } else {
      obj[item] = 1
    }
  } else {
    set.add(item)
  }
})
var ret = {}
Object.keys(obj).forEach(item => {
  if (obj[item] > 4) {
    ret[item] = obj[item]
  }
})
console.log(ret)
