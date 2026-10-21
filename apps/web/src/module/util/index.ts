import { PrizeType } from '@/module/enum';
import Locale from '@/module/locale';
import EventsUtil, { EventsUtilHelper } from './eventsUtil';
import VoiceUtil, { VoiceUtilHelper } from './voiceUtil';

const getLotteryRuntime = async () => (await import('./lotteryUtil')).LotteryUtilHelper;

export const LotteryUtilHelper = {
    async initialize() {
        const lottery = await getLotteryRuntime();
        await lottery.initialize();
    },
    async main(params: any) {
        const lottery = await getLotteryRuntime();
        return lottery.main(params);
    },
    async importExcel(file: File) {
        const lottery = await getLotteryRuntime();
        return lottery.importExcel(file);
    },
    async exportExcel() {
        const lottery = await getLotteryRuntime();
        return lottery.exportExcel();
    },
};

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

    static getUrlParam(name: string) {
        return new URLSearchParams(window.location.search).get(name) ?? "";
    }
}

export { EventsUtilHelper, VoiceUtilHelper };
