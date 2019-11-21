export default{
  //   姓名
  isHan(rule, value, callback){
    var re = new RegExp(/^[\u4e00-\u9fa5]+$/)
    if(re.test(value)){
      callback(new Error('请输入非汉字'))
    }else{
      callback(new Error('请输入非汉字'))
    }
  },
  //  手机号
  phoneValid(rule, value, callback){
    var re = new RegExp(/^[1][3456789]\d{9}$/)
    if(re.test(value)){
      callback()
    }else{
      callback(new Error('请输入正确格式的手机号码'))
    }
  },
 isIdCard(rule, value, callback) {
    //身份证正则表达式(18位)
    var isIdCard2 = /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i;
    var stard = "10X98765432"; //最后一位身份证的号码
    var first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
    var sum = 0;
    if (!isIdCard2.test(value)) {
      callback(new Error('请输入正确的身份证号'))
    }
    var year = value.substr(6, 4);
    var month = value.substr(10, 2);
    var day = value.substr(12, 2);
    var birthday = value.substr(6, 8);
    if (birthday != dateToString(new Date(year + '/' + month + '/' + day))) {//校验日期是否合法
      callback(new Error('请输入正确的身份证号'))
    }
    for (var i = 0; i < value.length - 1; i++) {
      sum += value[i] * first[i];
    }
    var result = sum % 11;
    var last = stard[result]; //计算出来的最后一位身份证号码
    if (value[value.length - 1].toUpperCase() == last) {
      callback()
    } else {
      callback(new Error('请输入正确的身份证号'))
    }
  },
  // 银行卡号
  bankCardValid(rule, value, callback) {
    var re = new RegExp(/^([1-9]{1})(\d{15}|\d{17}|\d{18})$/);
    if (re.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的银行卡号'))
    }
  }
}