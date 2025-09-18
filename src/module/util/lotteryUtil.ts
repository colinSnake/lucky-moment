import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import LotteryDB, { create_LotteryDB } from "../indexedDB/control";
import Util from "./";
import EventsUtil from "./eventsUtil";
import StarrySkyUtil, { create_StarrySkyUtil } from "./starrySkyUtil";
import { EventType, ObjectStoreIndexType, StepType } from "../enum";
import { LotteryDataInterface, PrizeInterface, UserInterface } from "../interface";
import { imgs, config, lotteryId, mockData } from "../mockData";

export default class LotteryUtil {
    containerId: string = "lottery-core-container";
    prizeGifts: PrizeInterface[] = [];
    table: any[] = [];
    sphere: any[] = [];
    config: any = config;
    camera: THREE.PerspectiveCamera|null = null;
    scene: THREE.Scene|null = null;
    renderer: CSS3DRenderer|null = null;
    controls: TrackballControls|null = null;
    select3dCardIndexs: any[] = [];
    _3dCards: any[] = [];
    lotteryData: LotteryDataInterface = {
        lotteryId: "",
        prizes: [],
        prizesCount: [],
        prizeIndex: 0,
        users: [],
        isLottery: false,
        isShowTable: true,
    };
    lotteryDB: LotteryDB = create_LotteryDB();
    starrySkyUtil: StarrySkyUtil = create_StarrySkyUtil();
    static instanceObj: LotteryUtil|null = null;
    static instance() {
        if (!this.instanceObj) {
            this.instanceObj = new LotteryUtil();
        }
        return this.instanceObj;
    }

    get currentLuckyUsers() {
        const luckyUsers = this.lotteryData.users.filter((user: UserInterface) => user.isInPrize);
        return luckyUsers;
    }

    get luckyUsers() {
        const luckyUsers = this.lotteryData.users.filter((user: UserInterface) => user.isWin);
        return luckyUsers;
    }

    set isShowTable(value: boolean){
        this.lotteryData.isShowTable = value;
    }

    get isShowTable() {
        return this.lotteryData.isShowTable;
    }

    set isLottery(value: boolean){
        this.lotteryData.isLottery = value;
    }

    get isLottery() {
        return this.lotteryData.isLottery;
    }
    
    get position() {
        const { row, col, width, height, step } = this.config;
        return {
            x: (width * col - step) / 2,
            y: (height * row - step) / 2,
        }
    };

    get totalCardsCount(){
        const { row, col } = this.config;
        return row * col;
    }

    get unLuckyUsers() {
        const unLuckyUsers = this.lotteryData.users.filter((user: UserInterface) => !user.isWin);
        return unLuckyUsers;
    }

    initialize() {
        this.lotteryDB.initialize().then(async() => {
            const res = await this.getLotteryData(lotteryId);
            this.lotteryData = JSON.parse(JSON.stringify(res));
            this.starrySkyUtil.initialize();
            this.initCards();
            this.animate();
            this.registerEvent();
            await this.setTransform();
            EventsUtil.emit(EventType.updatePrizes, this.lotteryData);
            EventsUtil.emit(EventType.updateBtns, this.isShowTable);
            console.log(this);
        });
    }

    createCard(params: any){
        const { index, user } = params,
            cardEle = document.createElement('div'),
            { dh_font_white_icon, dh_small_icon } = imgs;
        cardEle.className = "prize-card";
        cardEle.setAttribute("id", `card-${index}`)
        cardEle.classList.add('card');
        cardEle.innerHTML = `
            <div class="prize-card-inner">
                <div class="prize-card-front-side">
                    <img src=${dh_font_white_icon} alt="cover" />
                </div>
                <div class="prize-card-back-side active">
                    <div class="top">
                        <img src=${dh_small_icon} alt="cover" />
                    </div>
                    <div class="center">
                        <span class="number">${user.id}</span>
                    </div>
                    <div class="bottom">
                        <img src=${dh_small_icon} alt="cover" />
                    </div>
                </div>
            </div>
        `;
        return cardEle;
    }

    updateCard(user: UserInterface){
        const prizeCardEle = document.querySelector(`#card-${user.id}`);
        if(prizeCardEle) {

        }
    }

    initCards(){
        const { row, col, resolution, width, height, step } = this.config,
            { users } = this.lotteryData;
        let index = 0;

        // 构建 camera
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 3000;
        // 构建 scene
        this.scene = new THREE.Scene();

        for(let i = 0; i < row; i++) {
            for(let j = 0; j < col; j++) {
                const element = this.createCard({
                    index,
                    user: users[index % users.length],
                });
                // 创建 3D 对象
                const object = new CSS3DObject(element);
                object.position.x = this.getRandomPos();
                object.position.y = this.getRandomPos();
                object.position.z = this.getRandomPos();
                this.scene.add(object);
                this._3dCards.push(object);
                // 创建平面对象
                const planeObject = new THREE.Object3D();
                planeObject.position.x = j * width - this.position.x;
                planeObject.position.y = -(i * height) + this.position.y;
                planeObject.position.z = 0;
                this.table.push(planeObject);
                index++;
            }
        }

        const vector = new THREE.Vector3();
        for(let i = 0; i < this._3dCards.length; i++) {
            const _3dLen = this._3dCards.length,
                phi = Math.acos(-1 + (2 * i) / _3dLen),
                theta = Math.sqrt(_3dLen * Math.PI) * phi,
                object = new THREE.Object3D();
            object.position.setFromSphericalCoords(800 * resolution, phi, theta);
            vector.copy(object.position).multiplyScalar(2);
            object.lookAt(vector);
            this.sphere.push(object);
        }

        // 构建 renderer
        this.renderer = new CSS3DRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const lotteryContainerEle = document.querySelector(`#${this.containerId}`);
        this.renderer.domElement.classList.add('render');
        lotteryContainerEle && lotteryContainerEle.appendChild(this.renderer.domElement);

        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.enabled = false;
        this.controls.rotateSpeed = 0.5;
        // this.controls.zoomSpeed = 1.2;
        // this.controls.panSpeed = 0.8;
        this.controls.minDistance = 500;
        this.controls.maxDistance = 6000;
        this.controls.addEventListener('change', this.render.bind(this));
        // this.controls.keys = ['keyA', 'keyS', 'keyD'];
    }

    selectedCards(){
        const { resolution, width, selectDuration } = this.config,
            msg = this.currentLuckyUsers.map((user: UserInterface) => user.name || user.id).join('、');  

        // TODO: alert msg
        let tag = -(this.currentLuckyUsers.length - 1) / 2,
            percent = 0.85;

        console.log(this.select3dCardIndexs, "----------");

        this.select3dCardIndexs.forEach((id: number) => {
            const user = this.currentLuckyUsers.find((it: UserInterface) => it.id === id)!;
            this.updateCard(user);
            const object = this._3dCards[id - 1];
            new TWEEN.Tween(object.position)
                .to({
                    x: tag * width * resolution * percent,
                    y: 50 * resolution,
                    z: 2200,
                }, this.getRandomDuration(selectDuration))
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            new TWEEN.Tween(object.rotation)
                .to({
                    x: 0,
                    y: 0,
                    z: 0,
                }, this.getRandomDuration(selectDuration))
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            object.element && object.element.classList.add("prize");
            tag++;
        });

        new TWEEN.Tween(this)
            .to({}, 2 * selectDuration)
            .onUpdate(this.render.bind(this))
            .start()
            .onComplete(() => {
                this.isLottery = false;
                this.lotteryData.users.forEach((it: UserInterface) => (it.isInPrize = false));
            });
    }   

    resetCards(){
        const { resetDuration } = this.config;
        if(this.select3dCardIndexs?.length > 0){
            this.select3dCardIndexs.forEach((id: number) => {
                const object = this._3dCards[id - 1],
                    target = this.sphere[id - 1];
                new TWEEN.Tween(object.position)
                    .to({
                        x: target.position.x,
                        y: target.position.y,
                        z: target.position.z
                    }, this.getRandomDuration(resetDuration))
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                new TWEEN.Tween(object.rotation)
                    .to({
                        x: target.rotation.x,
                        y: target.rotation.y,
                        z: target.rotation.z
                    }, this.getRandomDuration(resetDuration))
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            });
        }
        return new Promise((resolve, reject) => {
            new TWEEN.Tween(this)
                .to({}, 2 * resetDuration)
                .onUpdate(this.render.bind(this))
                .start()
                .onComplete(() => {
                    this.select3dCardIndexs.forEach((id: number) => {
                        const object = this._3dCards[id - 1];
                        object.element && object.element.classList.contains("prize") && object.element.classList.remove("prize");
                    });
                    resolve(true);
                });
        });
    }

    main(step: StepType){
        return new Promise(async(resolve, reject) => {
            if(this.isLottery) {
                resolve(true);
            }else{
                switch(step){
                    case StepType.welcome:
                        {
                            this.isShowTable = false;
                            this.setLotteryData(lotteryId, this.lotteryData);
                            EventsUtil.emit(EventType.updateBtns, this.isShowTable);
                            await this.setTransform();
                        }
                        break;
                    case StepType.lottery:
                        {
                            const { prizeIndex } = this.lotteryData;
                            if(prizeIndex > -1){
                                this.setLotteryData(lotteryId, this.lotteryData);
                                this.updatePrizes();
                                await this.resetCards();
                                this.start();
                            }
                        }
                        break;
                    case StepType.reLottery:
                        {
                            const { prizeIndex } = this.lotteryData;
                            if(prizeIndex > -1){
                                await this.resetCards();
                                this.start();
                            }
                        }
                        break;
                    case StepType.export:
                        {
                            await this.exportExcel();
                        }
                        break;
                    case StepType.reset:
                        {
                        await this.reset();
                        }
                        break;
                    default:
                        break;
                }
                resolve(true);
            }
        });
    }

    /**
     * @description 开始抽奖 
     * */ 
    start() {
        this.isLottery = true;
        this.setRotate().then(() => {
            const { prizesCount, prizes, prizeIndex, users } = this.lotteryData,
                count = prizesCount[prizeIndex];
                
            this.select3dCardIndexs = [];
            for(let i = 0; i < count; i++) {
                const randomIndex = this.getRandomValue(this.unLuckyUsers.length),
                    user = this.unLuckyUsers[randomIndex];
                if(user){
                    users.forEach((it: UserInterface) => {
                        if(user.id === it.id){
                            it.isWin = true;
                            it.isInPrize = true;
                            this.select3dCardIndexs.push(it.id);
                        }
                    });
                }
            }
            if(prizeIndex === 0 && prizes[prizeIndex].total === 1){
                this.updatePrizes();
            }
            this.selectedCards();
        });
    }

    exportExcel(){
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    reset(){
        return new Promise(async(resolve, reject) => {
            this.lotteryData = Util.deepCopy(mockData);
            this.setLotteryData(lotteryId, this.lotteryData);
            EventsUtil.emit(EventType.updatePrizes, this.lotteryData);
            EventsUtil.emit(EventType.updateBtns, this.isShowTable);
            await this.setTransform();
            resolve(true);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls?.update();
        TWEEN.update();
    }

    render(){
        this.renderer!.render(this.scene!, this.camera!);
    }

    setShine(index: number){

    }

    setTransform(){
        return new Promise((resolve, reject) => {
            const { transformDuration } = this.config;
            let targets = this.table;
            if(!this.isShowTable) {
                targets = this.sphere;
            }

            for(let i = 0; i < this._3dCards.length; i++) {
                const object = this._3dCards[i];
                const target = targets[i];
                new TWEEN.Tween(object.position)
                    .to({
                        x: target.position.x,
                        y: target.position.y,
                        z: target.position.z
                    }, this.getRandomDuration(transformDuration))
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                new TWEEN.Tween(object.rotation)
                    .to({
                        x: target.rotation.x,
                        y: target.rotation.y,
                        z: target.rotation.z
                    }, this.getRandomDuration(transformDuration))
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }

            new TWEEN.Tween(this)
                .to({}, 2 * transformDuration)
                .onUpdate(this.render.bind(this))
                .start()
                .onComplete(() => {
                    resolve(true);
                });
        });
    }

    setRotate(){
        return new Promise((resolve, reject) => {
            const { rotateDuration } = this.config,
                scene = this.scene!;
            scene.rotation.y = 0;
            new TWEEN.Tween(scene.rotation)
                .to({ y: Math.PI * 8}, rotateDuration)
                .onUpdate(this.render.bind(this))
                .easing(TWEEN.Easing.Exponential.InOut)
                .start()
                .onComplete(() => {
                    resolve(true);
                });
        });
    }

    getRandomValue(value: number){
        return Math.floor(Math.random() * value);
    }

    getRandomPos(){
        return this.getRandomValue(4000) - 2000;
    }

    getRandomDuration(duration: number){
        return this.getRandomValue(duration) + duration
    }

    /**
     * @description: 更新 lottery data 
     **/ 
    updatePrizes(){
        const { prizes, prizesCount, prizeIndex } = this.lotteryData;
        prizes[prizeIndex].count += prizesCount[prizeIndex];
        if(prizes[prizeIndex].count === prizes[prizeIndex].total){
            this.lotteryData.prizeIndex = prizeIndex - 1;
        }
        EventsUtil.emit(EventType.updatePrizes, this.lotteryData);
    }

    /**
     * @description: 获取 indexedDB lottery data 
     **/ 
    getLotteryData(keyRange: string): Promise<LotteryDataInterface>{
        return new Promise(async(resolve, reject) => {
            const data = await this.lotteryDB.query({
                index: ObjectStoreIndexType.lotteryId,
                keyRange,
            });
            resolve(data ? data : Util.deepCopy(mockData));
        });
    }

    /**
     * @description: 更新 indexedDB lottery data 
     **/ 
    setLotteryData(key: string, value: LotteryDataInterface){
        return new Promise(async(resolve, reject) => {
            await this.lotteryDB.add({ index: ObjectStoreIndexType.lotteryId, keyRange: key, data: value });
            resolve(true);
        });
    }

    updateRenderSize(){
        const camera = this.camera!,
            renderer = this.renderer!;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
        this.starrySkyUtil.updateCanvasSize(this.starrySkyUtil.canvas!);
    }

    registerEvent(){
        window.addEventListener("resize", (e: any) => {
            this.updateRenderSize();
        });
    }
}

export function create_LotteryUtil(): LotteryUtil {
    return LotteryUtil.instance();
}
