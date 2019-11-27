let config = {
  // url: 'https://api.1byongche.com:7101/v26/user/register-user-by-phone',
  url: 'https://pre.1byongche.cn:7101/v26/user/register-user-by-phone',
  // url: 'https://test.1byongche.cn:7101/v26/user/register-user-by-phone',
  activeName: '用户签到',
  version: 272,
  CERTKEY: '4drafaedaehb'
}
if (process.env.NODE_ENV === 'production') {
  config.url = 'https://api.1byongche.com:7101/v26/user/register-user-by-phone'
}
export default config
