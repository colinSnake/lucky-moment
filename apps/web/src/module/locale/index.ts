import { zh } from "./zh-CN";
import { en } from "./en-US";
import { LocaleType } from "../enum";

export const getLanguage = () => {
    let locale = LocaleType.zh_CN;
    if(locale){
        if(locale.indexOf(LocaleType.zh_CN) > -1){
            locale = LocaleType.zh_CN; 
        }else{
            locale = LocaleType.en_US;
        }
    }
    return locale;
}

const Locale = getLanguage() === LocaleType.zh_CN ? zh : en;

export default Locale;
