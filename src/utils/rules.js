//小数验证
export function valiNumberFloat(rule, value, callback) {
    let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
    let int = /^[1-9]\d{0,7}(\.\d{1,7})?$/;
    if (!reg.test(value)) {
        callback(new Error('请输入数字'));
    } else if (!int.test(value)) {
        callback(new Error('输入整数不能大于8位'));
    } else if (value.toString().length > 16) {
        callback(new Error('输入数字不能大于16位'));
    } else {
        callback();
    }
}