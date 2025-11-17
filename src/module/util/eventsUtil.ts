import EventEmitter from "eventemitter3";
export default class EventsUtil {
    emitter = new EventEmitter();
    static instanceObject: EventsUtil|null = null;
    static instance(): EventsUtil {
        if(!EventsUtil.instanceObject){
            EventsUtil.instanceObject = new EventsUtil();
        }
        return EventsUtil.instanceObject;
    };

    emit(event: string, params?: any){
        this.emitter.emit(event, params);
    }

    subscribeOnce(event:string, fn:(params:any) => void, context: any) {
        this.emitter.once(event, fn, context);
    }

    subscribe(event:string, fn:(params:any) => void, context: any) {
        this.emitter.on(event, fn, context);
    }

    unSubscribe(event:string) {
        this.emitter.removeListener(event);
    }
}

export const EventsUtilHelper = EventsUtil.instance();
