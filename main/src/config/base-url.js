let BASE_URL = 'https://api.1byongche.com:7101/' // 正式地址

if (process.env.BUILD_ENV) {
  if (process.env.BUILD_ENV === 'test') {
    BASE_URL = 'https://pre.1byongche.cn:7101/' // 测试地址
    // BASE_URL = 'http://test.1byongche.cn:8520/'
  } else if (process.env.BUILD_ENV === 'production') {
    BASE_URL = 'https://api.1byongche.com:7101/' // 正式地址
  }
}

// 测试地址
// BASE_URL = 'https://pre.1byongche.cn:7101/v26'

// 开发地址
//  baseURL: "http://101.132.26.45:8089/v26"

// 准生产地址
// BASE_URL = 'https://api2.1byongche.com:7011/v26'

// 正式地址
// BASE_URL = 'http://api.1byongche.com:7001/v26'

// 正式地址https
// BASE_URL = 'https://api.1byongche.com:7101/v26'
export default BASE_URL
