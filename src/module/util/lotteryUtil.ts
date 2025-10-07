import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import * as XLSX from 'xlsx';
import LotteryDB, { create_LotteryDB } from "../indexedDB/control";
import Util from "./";
import EventsUtil from "./eventsUtil";
import { RenderConfetti, create_renderConfetti } from "../render";
import { AlertType, EventType, ObjectStoreIndexType, PrizeType, StepType } from "../enum";
import { AlertInfoInterface, LotteryDataInterface, PrizeInterface, UserInterface } from "../interface";
import { config, lotteryId, mockData } from "../mockData"; 
import Locale from "../locale";

export default class LotteryUtil {
    containerId: string = "lottery-core-container";
    table: any[] = [];
    sphere: any[] = [];
    config: any = config;
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
    renderConfetti: RenderConfetti = create_renderConfetti();
    alertMsg: string = "";
    maxUserCount: number = 0;
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

    get unLuckyUsers() {
        const unLuckyUsers = this.lotteryData.users.filter((user: UserInterface) => !user.isWin && user.id <= this.maxUserCount);
        return unLuckyUsers;
    }

    get luckyCount(){
        return this.lotteryData.prizes.reduce((pre: number, cur: PrizeInterface) => pre + cur.count, 0);
    }

    initialize() {
        this.lotteryDB.initialize().then(async() => {
            const res = await this.getLotteryData(lotteryId);
            this.lotteryData = JSON.parse(JSON.stringify(res));
            this.maxUserCount = this.lotteryData.users.length;
            this.initCards();
            this.animate();
            this.registerEvent();
            this.handleUpdateBtnGroup();
            this.handleUpdateLotteryData();
            await this.setTransform();
            console.log(this);
        });
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
                </div>
            </div>
        `;
        return cardEle;
    }

    initCards(){
        const { row, col, resolution, width, height } = this.config,
            { users } = this.lotteryData;
        let index = 0;

        // 构建 camera
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 3000;
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

        new TWEEN.Tween(this)
            .to({}, 2 * selectDuration)
            .onUpdate(this.render.bind(this))
            .start()
            .onComplete(() => {
                this.flipCard(true, () => {
                    let timer: any = setTimeout(() => {
                        this.lotteryData.users.forEach((it: UserInterface) => (it.isInPrize = false));
                        this.renderConfetti.draw();
                        this.alert({message: this.alertMsg});
                        this.setLotteryData();
                        this.isLottery = false;
                        clearTimeout(timer);
                        timer = null;
                    }, 1500);
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
        return new Promise((resolve, reject) => {
            new TWEEN.Tween(this)
                .to({}, 2 * resetDuration)
                .onUpdate(this.render.bind(this))
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
        if(type === StepType.lottery){ 
            if(this.unLuckyUsers.length === 0){ // 判断当前是否存在可抽奖用户
                status = false;
                this.alert({type: AlertType.warning, message: Locale.Common.NoLotteryUsers});   
            }
            if(prizeIndex === 0){ // 判断当前抽奖活动已完成
                status = false;
                this.alert({type: AlertType.warning, message: Locale.Common.LotteryCompleted});   
            }
        }
        if(type === StepType.reLottery){
            if(this.luckyCount === 0){ // 判断当前抽奖活动未开始
                status = false;
                this.alert({type: AlertType.warning, message: Locale.Common.LotteryCarryOut});   
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
                                    this.lotteryData.users.forEach((it: UserInterface) => {
                                        if(this.select3dCardIds.includes(it.id)){
                                            it.isWin = false;
                                            it.gift = PrizeType.none;
                                        }
                                    });
                                    await this.resetCards();
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
                this.alert({type: AlertType.error, message: Locale.Common.LotteryError});
                reject(err);
            }
        });
    }

    /**
     * @description 开始抽奖 
     * */ 
    start() {
        this.isLottery = true;
        this.setRotate().then(() => {
            const { prizes, prizeIndex, users } = this.lotteryData,
                count = this.getRealCount();

            let total = prizes.reduce((pre, cur) => pre + cur.count, 0);
                
            this.select3dCardIds = [];
            this.alertMsg = "";
            for(let i = 0; i < count; i++) {
                const randomIndex = this.getRandomValue(this.unLuckyUsers.length),
                    user = this.unLuckyUsers[randomIndex];
                if(user){
                    users.forEach((it: UserInterface) => {
                        if(user.id === it.id){
                            it.isWin = true;
                            it.isInPrize = true;
                            this.select3dCardIds.push(it.id);
                            it.gift = prizes[prizeIndex].type;
                            it.order = total + i;
                            it.date = Util.formatDate();
                        }
                    });
                    this.alertMsg += i > 0 ? `、${user.id}` : user.id;
                    if(i === count - 1){
                        this.alertMsg = Locale.Common.Congratulations(this.alertMsg, Util.getPrizeName(prizes[prizeIndex].type));
                    }
                }
            }
            this.selectedCards();
        });
    }

    importExcel(file: File){
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(false);
                return;
            };
            const reader = new FileReader();
            reader.onload = (e: any) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // 获取第一个工作表
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // 转换为 JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    // 二维数组 const arrayData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if(this.luckyUsers.length > 0){
                        this.alert({type: AlertType.warning, message: Locale.Common.LotteryUnderway});
                    }else{
                        if(jsonData.length > 0){
                            const { users } = this.lotteryData;
                            jsonData.forEach((obj: any) => {
                                const id = Number(obj[Locale.Common.Number]),
                                    name = obj[Locale.Common.Name];
                                if(id && name && users[id-1]){
                                    users[id-1].name = name;
                                }
                            });
                            this.maxUserCount = jsonData.length;
                            this.setLotteryData();
                        }
                        this.alert({message: Locale.Common.UploadSuccess});
                    }
                    
                    console.log('Convert Excel data to JSON:', jsonData);
                    // 这里可以处理转换后的 JSON 数据
                    resolve(true);
                } catch (err) {
                    this.alert({type: AlertType.error, message: Locale.Common.UploadFailed});
                    reject(err);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    exportExcel(){
        return new Promise((resolve, reject) => {
            const { prizes } = this.lotteryData;
            let jsonData: any = this.luckyUsers.sort((a: UserInterface, b: UserInterface) => b.order - a.order).map((it: UserInterface) => { 
                const curPrize = prizes.find((p: PrizeInterface) => p.type === it.gift);
                return {
                    [Locale.Common.Number]: `${it.id}`, // 必须要是字符串
                    [Locale.Common.Name]: it.name,
                    [Locale.Common.Prize]: Util.getPrizeName(it.gift as PrizeType),
                    [Locale.Common.Gift]: curPrize ? curPrize.name : "",
                    [Locale.Common.Date]: it.date
                };
            });
            // 1. 将 JSON 数据转换为工作表
            const worksheet: any = XLSX.utils.json_to_sheet(jsonData);
            
            // 2. 创建新工作簿并附加工作表
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, Locale.Common.PrizeForm); 
            
            // 🔧 设置列宽（单位：字符宽度）
            worksheet['!cols'] = [
                { wch: 10 },
                { wch: 10 }, 
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
            ];
            
            // 获取工作表的范围
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            
            // 为所有单元格设置左对齐样式（包括标题行和数据行）
            for(let row = range.s.r; row <= range.e.r; row++) {
                for(let col = range.s.c; col <= range.e.c; col++) {
                    const address = XLSX.utils.encode_cell({r: row, c: col});
                    if(worksheet[address]) {
                        worksheet[address].s = worksheet[address].s || {};
                        worksheet[address].s.alignment = {
                            horizontal: "left",
                            vertical: "center"
                        };
                    }
                }
            }
            
            // 3. 导出并下载 Excel 文件
            XLSX.writeFile(workbook, `${Locale.Common.PrizeForm}.xlsx`, {
                cellStyles: true,
                bookType: 'xlsx'
            });
            resolve(true);
        });
    }

    reset(){
        return new Promise(async(resolve, reject) => {
            this.lotteryData = Util.deepCopy(mockData);
            this.setLotteryData();
            this.handleUpdateBtnGroup();
            this.handleUpdateLotteryData();
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
            const { rotateDuration, isAuto, times } = this.config,
                scene = this.scene!;
            scene.rotation.y = 0;

            let rotationTween: any = null;

            const sport = (params: any) => {
                const { pos, duration, easeType = TWEEN.Easing.Exponential.InOut } = params;
                new TWEEN.Tween(scene.rotation)
                    .to(pos, duration)
                    .onUpdate(this.render.bind(this))
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
                        .onUpdate(this.render.bind(this))
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
        let { prizes, prizeIndex } = this.lotteryData;
        if(prizes[prizeIndex].count === prizes[prizeIndex].total){
            prizeIndex -= 1;
            this.lotteryData.prizeIndex = prizeIndex;
        }
        prizes[prizeIndex].count += this.getRealCount();
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

    updateRenderSize(){
        const camera = this.camera!,
            renderer = this.renderer!;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }

    registerEvent(){
        window.addEventListener("resize", (e: any) => {
            this.updateRenderSize();
        });
    }

    flipCard(status: boolean, callback?: Function){
        const winnerBg = document.querySelector(".main-winnerBg") as HTMLElement;
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

    alert(data: AlertInfoInterface){
        const alertInfo = {
            type: AlertType.info,
            isShow: true
        };
        EventsUtil.emit(EventType.showAlert, {...alertInfo, ...data});
    }

    handleUpdateLotteryData(){
        EventsUtil.emit(EventType.updatePrizes, this.lotteryData);
    }

    handleUpdateBtnGroup(type?: StepType){
        const { isAuto, times } = this.config;
        EventsUtil.emit(EventType.updateBtnGroup, {
            isShowTable: this.isShowTable,
            isShowPause: isAuto ? false : times === Infinity,
            type
        });
    }
}

export function create_lotteryUtil(): LotteryUtil {
    return LotteryUtil.instance();
}
