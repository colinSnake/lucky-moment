import EventEmitter from "eventemitter3";
export default class EventsUtil {
    static instanceObject: EventEmitter|null = null;
    static instance(): EventEmitter {
        if(!EventsUtil.instanceObject){
            EventsUtil.instanceObject = new EventEmitter();
        }
        return EventsUtil.instanceObject;
    };

    static emit(event: string, params?: any){
        EventsUtil.instance().emit(event, params);
    }

    static subscribeOnce(event:string, fn:(params:any) => void, context: any) {
        EventsUtil.instance().once(event, fn, context);
    }

    static subscribe(event:string, fn:(params:any) => void, context: any) {
        EventsUtil.instance().on(event, fn, context);
    }

    static unSubscribe(event:string) {
        EventsUtil.instance().removeListener(event);
    }
}
