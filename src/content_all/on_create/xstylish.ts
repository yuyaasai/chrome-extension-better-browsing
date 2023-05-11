import { XstylishConfig, textMatches } from "./XstylishConfigLib"
import globalOption from "./xstylishconfigs/xstylishGlobalOption"
import xstylishAws from "./xstylishconfigs/xstylishAws"
import xstylishL from "./xstylishconfigs/xstylishL"
import xstylishSites from "./xstylishconfigs/xstylishSites"

export default (window: Window) => {
    const doc = document
    const loc = window.location

    //
    // 全体 ignore 判定
    //
    if (textMatches(loc.host, globalOption.ignoreDomains)) {
        return
    }
    if (textMatches(loc.href, globalOption.ignoreUrls)) {
        return
    }
    if (textMatches(loc.pathname, globalOption.ignorePathnames)) {
        return
    }

    //
    // スタイルの読み込み
    //
    const settings: XstylishConfig[] = []
    xstylishAws(settings)
    xstylishL(settings)
    xstylishSites(settings)

    //
    // 処理の実行
    //
    for (const s of settings) {
        if (!s.targetPage(loc)) continue

        // CSSの注入
        let style: HTMLElement | undefined
        if (s.name != null && s.style != null) {
            style = doc.createElement("style")
            style.id = "xstylish_" + s.name
            style.innerHTML = typeof s.style === "string" ? s.style : s.style(loc)
            doc.head.appendChild(style)
        }

        // ***Selectorsで定義された要素を取り除く
        if (s.selectorsToRemove != null) {
            for (const selector of s.selectorsToRemove) {
                for (const target of doc.querySelectorAll(typeof selector === "string" ? selector : selector())) {
                    target.remove()
                }
            }
        }
        if (s.selectorsToHide != null) {
            for (const selector of s.selectorsToHide) {
                for (const target of doc.querySelectorAll(typeof selector === "string" ? selector : selector())) {
                    if (target instanceof HTMLElement) {
                        target.style.display = "none"
                    }
                }
            }
        }
        if (s.selectorsToInvisible != null) {
            for (const selector of s.selectorsToInvisible) {
                for (const target of doc.querySelectorAll(typeof selector === "string" ? selector : selector())) {
                    if (target instanceof HTMLElement) {
                        target.style.visibility = "hidden"
                    }
                }
            }
        }

        // カスタムスクリプトの実行
        if (s.script != null) {
            s.script(loc, s, style)
        }
    }
}
