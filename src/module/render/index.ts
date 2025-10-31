import Confetti from "./confetti";
import MultiWords from "./multiWords";
import MultiWordsWorker from "./multiWordsWorker";

export default class RenderHelper {
    static RH_confetti: Confetti = Confetti.instance();
    static RH_multiWords: MultiWords = MultiWords.instance();
    static RH_multiWordsWorker: MultiWordsWorker = MultiWordsWorker.instance();
}

