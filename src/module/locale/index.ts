import { zh } from "./zh-CN";
import { en } from "./en-US";
import { LocaleType } from "../enum";

export const getUrlParam = (key: string) => {
    const url = window.location?.href;
    let value = "";
    if (url.includes(key)) {
      value = url.split(key)[1].replace(/=/, "").split("&")[0];
    }
    return value;
};

export const getLanguage = () => {
    let locale = "";
    !locale && (locale = getUrlParam('locale') || getUrlParam('lang'));
    !locale && (locale = navigator.language);
    !locale && (locale = LocaleType.zh_CN);
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
