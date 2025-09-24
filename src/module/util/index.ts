import { PrizeType } from '@/module/enum';
import Locale from '@/module/locale';

export default class Util {
    static deepCopy (obj: any, cache: any = []) {

        function find (list: any, f: any) {
            return list.filter(f)[0];
        }

        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        const hit = find(cache, (c: any) => c.original === obj);
        if (hit) {
            return hit.copy;
        }

        const copy: any = Array.isArray(obj) ? [] : {};
        cache.push({
            original: obj,
            copy
        });

        Object.keys(obj).forEach(key => {
            copy[key] = this.deepCopy(obj[key], cache);
        });

        return copy;
    }

    static getPrizeName(type: PrizeType){
        switch(type){
            case PrizeType.specialPrize:
                return Locale.Common.SpecialPrize;
            case PrizeType.firstPrize:
                return Locale.Common.FirstPrize;
            case PrizeType.secondPrize:
                return Locale.Common.SecondPrize;
            case PrizeType.thirdPrize:
                return Locale.Common.ThirdPrize;
            case PrizeType.normalPrize:
                return Locale.Common.NormalPrize;
            default:
                return Locale.Common.None;
        }
    }

    static formatDate() {
        return new Date().toLocaleString().replace(/\//g, "-");
    }
}
