import { audios } from "../mockData";
class VoiceUtil {
    audioRefs: Array<any> = [];
    speech: any = null;
    voices: any[] = [];
    chineseVoices: any[] = [];
    isSpeaking: boolean = false;
    static instanceObject: VoiceUtil|null = null;
    static instance(){
        if (this.instanceObject === null) {
            this.instanceObject = new VoiceUtil();
        }
        return this.instanceObject;
    }

    initialize(){
        this.speech = new SpeechSynthesisUtterance();
        this.loadVoices();
        this.loadAudioGroup();
        this.switchAudio(0);
    }

    speak(params: any, callback: Function|null = null){
        const {text, rate = 1, pitch = 1} = params;
        // 设置语音参数
        this.speech.text = text;
        this.speech.rate = parseFloat(rate);
        this.speech.pitch = parseFloat(pitch);
        this.speech.voice = this.chineseVoices[0];
        this.isSpeaking = true;
        // 播放语音
        speechSynthesis.speak(this.speech);
    }

    loadVoices(){
        this.voices = speechSynthesis.getVoices();
        this.chineseVoices = this.voices.filter(voice => voice.lang.includes('zh') || voice.lang.includes('cn'));
        this.registerEvents();
    }

    switchAudio(index: number){
        document.body.click();
        this.audioRefs.forEach(audioRef => audioRef.pause());
        this.audioRefs[index].play();
    }

    loadAudioGroup(){
        const audioARef = new Audio(audios.bg),
            audioBRef = new Audio(audios.play);
        audioARef.loop = true;
        audioBRef.loop = true;
        this.audioRefs = [audioARef, audioBRef];
    }

    registerEvents(){
        this.speech.onend = () => {
            this.switchAudio(0);
            this.isSpeaking = false;
        }

        this.speech.onerror = (e: any) => {
            console.error('语音合成错误:', e);
            this.isSpeaking = false;
        };
    }
    
}

const VoiceUtilHelper = () => VoiceUtil.instance();

export default VoiceUtilHelper;