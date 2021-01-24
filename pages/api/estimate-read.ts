const WPM = 200
const WORD_LENGTH = 5


export default function estimateReadTime(texts: string) {
    return Math.floor(countWwordsInText(texts.trim().split(/\s+/), WORD_LENGTH) / WPM)
}

function countWwordsInText(textList: string[], wordLength: number) {
    return textList.reduce((total, t) => total + (t.length / wordLength), 0)
}
