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
}
