import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import LotteryDB, { create_LotteryDB } from "../indexedDB/control";
import Util, {EventsUtilHelper, VoiceUtilHelper} from "./";
import { AlertType, EventType, ObjectStoreIndexType, PrizeType, StepType } from "../enum";
import { LotteryDataInterface, PrizeInterface, UserInterface } from "../interface";
import { config, lotteryId, mockData } from "../mockData"; 
import Locale from "../locale";
import {
    applyWinners,
    getAvailableUsers,
    getDrawCount,
    getNextPrizeIndex,
    pickRandomUsers,
    rollbackWinners,
} from "../lottery/lotteryState";
import { applyParticipantList, exportPrizeList, readParticipantList } from "../lottery/excelService";

export default class LotteryUtil {
    containerId: string = "lottery-core-container";
    table: any[] = [];
    sphere: any[] = [];
    camera: THREE.PerspectiveCamera|null = null;
    scene: THREE.Scene|null = null;
    renderer: CSS3DRenderer|null = null;
    controls: TrackballControls|null = null;
    select3dCardIds: any[] = [];
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
    alertMsg: string = "";
    participantsCount: number = 0;
    private participantIdsOverride: number[] | undefined;
    pendingDrawCount = 0;
    private initialization: Promise<void> | null = null;
    private animationFrame: number | null = null;
    static instanceObj: LotteryUtil|null = null;
    static instance() {
        if (!this.instanceObj) {
            this.instanceObj = new LotteryUtil();
        }
        return this.instanceObj;
    }

    get config() {
        const row = Util.getUrlParam("row") || config.row,
            col = Util.getUrlParam("col") || config.col,
            participantsCount = Util.getUrlParam("participantsCount") || config.participantsCount;
        config.row = Number(row),
        config.col = Number(col),
        config.participantsCount = Number(participantsCount);
        return config;
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

    get unLuckyUsers() {
        return getAvailableUsers(
            this.lotteryData.users,
            this.participantsCount,
            this.participantIdsOverride ?? this.lotteryData.participantIds,
        );
    }

    get luckyCount(){
        return this.lotteryData.prizes.reduce((pre: number, cur: PrizeInterface) => pre + cur.count, 0);
    }

    initialize(): Promise<void> {
        if (this.initialization) return this.initialization;
        this.initialization = (async () => {
            await this.lotteryDB.initialize();
            const res = await this.getLotteryData(lotteryId);
            const countParam = Number(Util.getUrlParam("participantsCount"));
            this.lotteryData = Util.deepCopy(res);
            const requestedCount = Number.isSafeInteger(countParam) && countParam > 0
                ? Math.min(countParam, this.lotteryData.users.length)
                : 0;
            this.participantIdsOverride = requestedCount > 0
                ? this.lotteryData.users
                    .filter((user) => user.id <= requestedCount)
                    .map((user) => user.id)
                : undefined;
            this.participantsCount = this.participantIdsOverride?.length
                ?? this.lotteryData.participantIds?.length
                ?? this.lotteryData.users.length;
            this.initCards();
            this.registerEvent();
            this.handleUpdateBtnGroup();
            this.handleUpdateLotteryData();
            VoiceUtilHelper.initialize();
            await this.setTransform();
        })();
        return this.initialization;
    }

    createCard(user: UserInterface){
        const cardEle = document.createElement('div');
        cardEle.className = "prize-card-wrapper visible";
        cardEle.setAttribute("id", `card-${user.id}`)
        cardEle.innerHTML = `
            <div class="prize-card-inner">
                <div class="prize-card-front-side"></div>
                <div class="prize-card-back-side active">
                    <div class="center">
                        <span class="number">${user.id}</span>
                    </div>
                    <span class="crown"></span>
                </div>
            </div>
        `;
        return cardEle;
    }

    initCards(){
        const { row, col, step, resolution, width, height, cameraConfig } = this.config,
            { fov, near, far, aspect, posZ } = cameraConfig,
            { users } = this.lotteryData;
        let index = 0;

        // 构建 camera
        this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight || aspect, near, far);
        this.camera.position.z = posZ;
        // 构建 scene
        this.scene = new THREE.Scene();

        for(let i = 0; i < row; i++) {
            for(let j = 0; j < col; j++) {
                const user = users[index % users.length],
                    element = this.createCard(user);
                // 创建 3D 对象
                const object = new CSS3DObject(element);
                object.position.x = this.getRandomPos();
                object.position.y = this.getRandomPos();
                object.position.z = this.getRandomPos();
                this.scene.add(object);
                this._3dCards.push(object);
                // 创建平面对象
                const planeObject = new THREE.Object3D();
                planeObject.position.x = j * width - this.position.x + (width - step) / 2;
                planeObject.position.y = -(i * height) + this.position.y - (height - step) / 2;
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
        const { resolution, width, selectDuration } = this.config; 
        let tag = -(this.currentLuckyUsers.length - 1) / 2;

        this.select3dCardIds.forEach((id: number) => {
            const object = this._3dCards[id - 1];
            new TWEEN.Tween(object.position)
                .to({
                    x: tag * width * resolution * 1,
                    y: 50 * resolution,
                    z: 1200,
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

        this.animate();
        new TWEEN.Tween(this)
            .to({}, 2 * selectDuration)
            .start()
            .onComplete(() => {
                this.flipCard(true, () => {
                    VoiceUtilHelper.switchAudio(0);
                    this.lotteryData.users.forEach((it: UserInterface) => (it.isInPrize = false));
                    import("../render/confetti").then(({ default: Confetti }) => {
                        Confetti.instance().draw();
                    });
                    this.setLotteryData();
                    this.isLottery = false;
                });
            });
    }   

    resetCards(){
        const { resetDuration } = this.config;
        this.flipCard(false);
        if(this.select3dCardIds?.length > 0){
            this.select3dCardIds.forEach((id: number) => {
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
        this.animate();
        return new Promise((resolve, reject) => {
            new TWEEN.Tween(this)
                .to({}, 2 * resetDuration)
                .start()
                .onComplete(() => {
                    resolve(true);
                });
        });
    }
    
    checkCanLottery(params: any){
        const { type, text } = params,
            { isAuto }= this.config,
            { prizeIndex } = this.lotteryData;
        let status = true;
        if(VoiceUtilHelper.isSpeaking){
            status = false;
        }else{
            if(type === StepType.lottery && text !== Locale.Page.Pause){ 
                if(this.unLuckyUsers.length === 0){ // 判断当前是否存在可抽奖用户
                    status = false;
                    this.alert(AlertType.warning, Locale.Common.NoLotteryUsers);   
                }
                if(getNextPrizeIndex(this.lotteryData.prizes, prizeIndex) < 0){ // 所有奖品均已抽完
                    status = false;
                    this.alert(AlertType.warning, Locale.Common.LotteryCompleted);   
                }
            }
            if(type === StepType.reLottery){
                if(this.luckyCount === 0){ // 判断当前抽奖活动未开始
                    status = false;
                    this.alert(AlertType.warning, Locale.Common.LotteryCarryOut);   
                }
            }   
            // 判断上次抽奖未执行完毕，不发起新的抽奖
            if(isAuto) {
                this.isLottery && (status = false);
            }else{ 
                if(text !== Locale.Page.Pause && this.isLottery){
                    this.isLottery && (status = false);
                }
            }
        }
        return status;
    }

    main(params: any){
        const { type, text } = params;

        return new Promise(async(resolve, reject) => {
            try{
                this.alertMsg = "";
                if(!this.checkCanLottery(params)){
                    return resolve(true);
                }
                switch(type){
                    case StepType.welcome:
                        {
                            this.isShowTable = false;
                            this.handleUpdateBtnGroup();
                            await this.setTransform();
                        }
                        break;
                    case StepType.lottery:
                        {
                            if(text === Locale.Page.Pause){
                                this.config.times = 0;
                                this.handleUpdateBtnGroup(type);
                            }else{
                                const { prizeIndex } = this.lotteryData;
                                this.config.times = Infinity;
                                this.handleUpdateBtnGroup(type);
                                if(prizeIndex > -1){
                                    this.updatePrizes();
                                    this.handleAlert();
                                    await this.resetCards();
                                    this.start();
                                }
                            }
                        }
                        break;
                    case StepType.reLottery:
                        {
                            if(text === Locale.Page.Pause){
                                this.config.times = 0;
                                this.handleUpdateBtnGroup(type);
                            }else{
                                const { prizeIndex } = this.lotteryData;
                                this.config.times = Infinity;
                                this.handleUpdateBtnGroup(type);
                                if(prizeIndex > -1){ // 重置上一次抽奖结果
                                    const redrawCount = this.select3dCardIds.length;
                                    rollbackWinners(this.lotteryData, this.select3dCardIds);
                                    this.pendingDrawCount = redrawCount;
                                    await this.resetCards();
                                    this.handleAlert();
                                    this.start();
                                }
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
            }catch(err){
                this.alert(AlertType.error, Locale.Common.LotteryError);
                reject(err);
            }
        });
    }

    /**
     * @description 开始抽奖 
     * */ 
    start() {
        VoiceUtilHelper.switchAudio(1);
        this.isLottery = true;
        this.setRotate().then(() => {
            const { prizes, prizeIndex } = this.lotteryData,
                availableUsers = this.unLuckyUsers,
                count = this.pendingDrawCount || getDrawCount(this.lotteryData, availableUsers.length),
                orderStart = this.luckyCount - count;

            this.select3dCardIds = [];
            this.alertMsg = "";
            const selectedUsers = pickRandomUsers(availableUsers, count);
            this.pendingDrawCount = 0;
            applyWinners(this.lotteryData, selectedUsers, orderStart, Util.formatDate());
            this.select3dCardIds = selectedUsers.map((user) => user.id);
            const selectedIds = selectedUsers.map((user) => user.id).join("、");
            if (selectedUsers.length > 0 && prizes[prizeIndex]) {
                const { name, type } = prizes[prizeIndex];
                this.alertMsg = Locale.Common.Congratulations(selectedIds, Util.getPrizeName(type), name);
            }
            this.alert(AlertType.success, this.alertMsg, 8000);
            VoiceUtilHelper.speak({ text: this.alertMsg});
            this.selectedCards();
        });
    }

    importExcel(file: File){
        return new Promise(async (resolve, reject) => {
            if (!file) {
                resolve(false);
                return;
            };
            try {
                const rows = await readParticipantList(file);
                if (this.luckyUsers.length > 0) {
                    this.alert(AlertType.warning, Locale.Common.LotteryUnderway);
                } else {
                    const participantIds = applyParticipantList(this.lotteryData, rows);
                    if (participantIds.length === 0) {
                        this.alert(AlertType.warning, Locale.Common.NoLotteryUsers);
                        resolve(false);
                        return;
                    }
                    this.lotteryData.participantIds = participantIds;
                    this.participantIdsOverride = undefined;
                    this.participantsCount = participantIds.length;
                    await this.setLotteryData();
                    this.alert(AlertType.success, Locale.Common.UploadSuccess);
                }
                resolve(true);
            } catch (err) {
                this.alert(AlertType.error, Locale.Common.UploadFailed);
                reject(err);
            }
        });
    }

    exportExcel(){
        return exportPrizeList(this.luckyUsers, this.lotteryData.prizes).then(() => true);
    }

    reset(){
        return new Promise(async(resolve, reject) => {
            this.lotteryData = Util.deepCopy(mockData);
            this.pendingDrawCount = 0;
            this.participantIdsOverride = undefined;
            this.participantsCount = Number(Util.getUrlParam("participantsCount")) > 0
                ? Math.min(Number(Util.getUrlParam("participantsCount")), this.lotteryData.users.length)
                : this.lotteryData.users.length;
            await this.setLotteryData();
            this.handleUpdateBtnGroup();
            this.handleUpdateLotteryData();
            await this.setTransform();
            resolve(true);
        });
    }

    animate() {
        if (this.animationFrame !== null) return;
        const tick = () => {
            this.animationFrame = null;
            TWEEN.update();
            if (this.controls?.enabled) this.controls.update();
            this.render();
            if (TWEEN.getAll().length > 0) {
                this.animationFrame = requestAnimationFrame(tick);
            }
        };
        this.animationFrame = requestAnimationFrame(tick);
    }

    render(){
        if (!this.renderer || !this.scene || !this.camera) return;
        this.renderer.render(this.scene, this.camera);
    }

    setTransform(){
        return new Promise((resolve, reject) => {
            const { transformDuration } = this.config;
            let targets = this.table;
            if(!this.isShowTable) {
                targets = this.sphere;
            }
            this.flipCard(false);
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
            this.animate();

            new TWEEN.Tween(this)
                .to({}, 2 * transformDuration)
                .start()
                .onComplete(() => {
                    resolve(true);
                });
        });
    }

    setRotate(){
        return new Promise((resolve, reject) => {
            const { rotateDuration, isAuto, times } = this.config,
                scene = this.scene!;
            scene.rotation.y = 0;

            let rotationTween: any = null;

            const sport = (params: any) => {
                const { pos, duration, easeType = TWEEN.Easing.Exponential.InOut } = params;
                new TWEEN.Tween(scene.rotation)
                    .to(pos, duration)
                    .easing(easeType)
                    .start()
                    .onComplete(() => {
                        resolve(true);
                    });
            }
            let index = 0;
            if(isAuto){
                sport({ 
                    pos: {y: Math.PI * 8}, 
                    duration: rotateDuration 
                });
            }else{
                const initRotation = () => {
                    if (rotationTween) { // 清除旧动画
                        TWEEN.remove(rotationTween);
                    }
                    const pos = { y: Math.PI * 2},
                        duration = rotateDuration / 3;
                    // 创建新的旋转动画
                    rotationTween = new TWEEN.Tween(scene.rotation)
                        .to(pos, duration)
                        .easing(TWEEN.Easing.Linear.None)
                        .repeat(times)
                        .onRepeat(() => {
                            index++;
                            console.log('**旋转次数**', index);
                            if(this.config.times === 0){
                                console.log('**准备停止**', index);
                                rotationTween.stop();
                                sport({ 
                                    pos, 
                                    duration, 
                                    easeType: TWEEN.Easing.Exponential.Out
                                });
                            }
                        });
                        return rotationTween;
                }
                initRotation().start();
            }
            this.animate();
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

    getRealCount(){
        const { prizesCount, prizeIndex } = this.lotteryData;
        return prizesCount[prizeIndex] > this.unLuckyUsers.length ? this.unLuckyUsers.length : prizesCount[prizeIndex];
    }

    /**
     * @description: 更新 lottery data 
     **/ 
    updatePrizes(){
        const { prizes } = this.lotteryData;
        const prizeIndex = getNextPrizeIndex(prizes, this.lotteryData.prizeIndex);
        this.lotteryData.prizeIndex = prizeIndex;
        if (prizeIndex < 0) return;
        this.pendingDrawCount = getDrawCount(this.lotteryData, this.unLuckyUsers.length);
        prizes[prizeIndex].count += this.pendingDrawCount;
        this.handleUpdateLotteryData();
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
    setLotteryData(){
        return new Promise(async(resolve, reject) => {
            await this.lotteryDB.add({ index: ObjectStoreIndexType.lotteryId, keyRange: lotteryId, data: this.lotteryData });
            resolve(true);
        });
    }

    updateCamera(){
        const camera = this.camera!;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    updateRenderSize(){
        const renderer = this.renderer!;
        this.updateCamera();
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }

    registerEvent(){
        window.addEventListener("resize", (e: any) => {
            this.updateRenderSize();
        });
    }

    flipCard(status: boolean, callback?: Function){
        const winnerBg = document.querySelector(".wl-winnerBg") as HTMLElement;
        if(status){
            winnerBg && !winnerBg.classList.contains("visible") && winnerBg.classList.add("visible");
        }else{
            winnerBg && winnerBg.classList.contains("visible") && winnerBg.classList.remove("visible");
        }
        this._3dCards.forEach(object => {
            if(status){
                object.element && object.element.classList.contains("visible") && object.element.classList.remove("visible");
            }else{
                object.element && !object.element.classList.contains("visible") && object.element.classList.add("visible");
            }
        });
        this.select3dCardIds.forEach(id => {
            const object = this._3dCards[id - 1];
            if(status){
                object.element && !object.element.classList.contains("flip") && object.element.classList.add("flip");
            }else{
                object.element && object.element.classList.contains("flip") && object.element.classList.remove("flip");
                object.element && object.element.classList.contains("prize") && object.element.classList.remove("prize");
            }
        });
        callback && callback();
    }

    alert(type: AlertType, message: string, duration: number = 3000){
        EventsUtilHelper.emit(EventType.showAlert, {
            type,
            message,
            isShow: true,
            position: "right",
        });

        let timer: any = setTimeout(() => {
            EventsUtilHelper.emit(EventType.showAlert, {
                type,
                message,
                isShow: false,
                position: "right",
            });
            clearTimeout(timer);
            timer = null;
        }, duration);
    }

    handleAlert(){
        const { prizes, prizeIndex } = this.lotteryData;
        this.alert(AlertType.success, Locale.Common.LotteryNotice(prizes[prizeIndex].name));
    }

    handleUpdateLotteryData(){
        EventsUtilHelper.emit(EventType.updatePrizes, this.lotteryData);
    }

    handleUpdateBtnGroup(type?: StepType){
        const { isAuto, times } = this.config;
        EventsUtilHelper.emit(EventType.updateBtnGroup, {
            isShowTable: this.isShowTable,
            isShowPause: isAuto ? false : times === Infinity,
            type
        });
    }
}

export const LotteryUtilHelper = LotteryUtil.instance();
