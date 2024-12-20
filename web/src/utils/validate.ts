/**
 * @Description: 校验规则函数
 * @Description: （函数请添加详细注释）
 */
import { RuleObject } from "antd/lib/form"
import { StoreValue } from "antd/lib/form/interface"

export function validate_password(
    rule: RuleObject,
    values: StoreValue,
    callback: (error?: string) => void
) {
    const reg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{12,32}$/; //密码校验
    if (!reg.test(values)) {
        callback("密码长度12-32位,且必须包含数字+大小写字母+特殊字符(@$!%*?&)");
    } else {
        callback();
    }
}
