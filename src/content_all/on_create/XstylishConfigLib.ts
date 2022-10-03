type XstylishConfigData = any;

export type XstylishConfig = {
    name: string,
    targetPage: (location:Location) => boolean,
    style?: string | ((location:Location) => string),
    script?: (location:Location, config?:XstylishConfig, style?:HTMLElement) => boolean | void,
    /** 削除する要素のcssセレクタを記述 */
    selectorsToRemove?: Array<string | ((...args: any[]) => string)>
    selectorsToHide?: Array<string | ((...args: any[]) => string)>
    selectorsToInvisible?: Array<string | ((...args: any[]) => string)>
    requiredFontFamilies?: string[],
    data?: XstylishConfigData,
};


//
// 共通関数
//
export const textMatches = (text: string, patterns: Array<string | RegExp>) => {
    for (const pattern of patterns) {
        if (pattern instanceof RegExp ? pattern.test(text) : text.indexOf(pattern) !== -1) {
            return true;
        }
    }
    return false;
};
