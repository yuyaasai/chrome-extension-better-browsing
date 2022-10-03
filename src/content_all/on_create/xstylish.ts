import { XstylishConfig, textMatches } from './XstylishConfigLib';
import globalOption from './xstylishconfigs/xstylishGlobalOption';
import xstylishAws from './xstylishconfigs/xstylishAws';
import xstylishL from './xstylishconfigs/xstylishL';
import xstylishSites from './xstylishconfigs/xstylishSites';

export default (window: Window) => {
    const doc = document;
    const loc = window.location;

    //
    // 全体 ignore 判定
    //
    if (textMatches(loc.host, globalOption.ignoreDomains)) {
        return;
    }
    if (textMatches(loc.pathname, globalOption.ignorePathnames)) {
        return;
    }

    //
    // サイト別にスタイルをつけやすくするため、bodyにurlから生成したidをつける
    //
    document.body.id = loc.hostname.replace(/\./g, '_').replace(/^www_/, '') + '__xstyl';

    //
    // スタイルの読み込み
    //
    const settings: XstylishConfig[] = [];
    xstylishAws(settings);
    xstylishL(settings);
    xstylishSites(settings);

    //
    // 処理の実行
    //
    let requiredFonts: Set<string> | null = null;
    let targetExists = 0;
    for (const s of settings) {
        if (!s.targetPage || !s.targetPage(loc)) continue;
        targetExists = 1;

        // CSSの注入
        let style:HTMLElement | undefined;
        if (s.name && s.style) {
            style = doc.createElement('style');
            style.id = 'xstylish_' + s.name;
            // @ts-ignore
            style.innerHTML = s.style.charCodeAt ? s.style : s.style(loc);
            doc.head.appendChild(style);
        }

        // ***Selectorsで定義された要素を取り除く
        if (s.selectorsToRemove) {
            for (const selector of s.selectorsToRemove) {
                for (const target of doc.querySelectorAll(typeof selector === 'string' ? selector : selector())) {
                    target.remove();
                }
            }
        }
        if (s.selectorsToHide) {
            for (const selector of s.selectorsToHide) {
                for (const target of doc.querySelectorAll(typeof selector === 'string' ? selector : selector())) {
                    if (target instanceof HTMLElement) {
                        target.style.display = 'none';
                    }
                }
            }
        }
        if (s.selectorsToInvisible) {
            for (const selector of s.selectorsToInvisible) {
                for (const target of doc.querySelectorAll(typeof selector === 'string' ? selector : selector())) {
                    if (target instanceof HTMLElement) {
                        target.style.visibility = 'hidden';
                    }
                }
            }
        }

        // カスタムスクリプトの実行
        s.script && s.script(loc, s, style);

        if (s.requiredFontFamilies) {
            requiredFonts ??= new Set<string>();
            for (const family of s.requiredFontFamilies) {
                requiredFonts.add(family);
            }
        }
    }

    if (!targetExists) {
        return;
    }
};
