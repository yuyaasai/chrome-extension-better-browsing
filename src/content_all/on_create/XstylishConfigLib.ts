type XstylishConfigData = any

export interface XstylishConfig {
    name: string
    targetPage: (location: Location) => boolean
    style?: string | ((location: Location) => string)
    script?: (location: Location, config?: XstylishConfig, style?: HTMLElement) => void
    /** 削除する要素のcssセレクタを記述 */
    selectorsToRemove?: Array<string | ((...args: any[]) => string)>
    selectorsToHide?: Array<string | ((...args: any[]) => string)>
    selectorsToInvisible?: Array<string | ((...args: any[]) => string)>
    requiredFontFamilies?: string[]
    data?: XstylishConfigData
}

//
// 共通関数
//
export const textMatches = (text: string, patterns: Array<string | RegExp>) => {
    for (const pattern of patterns) {
        if (typeof pattern === "string" ? text.includes(pattern) : pattern.test(text)) {
            return true
        }
    }
    return false
}
