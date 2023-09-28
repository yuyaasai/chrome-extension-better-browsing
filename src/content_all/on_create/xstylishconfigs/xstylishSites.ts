import { type XstylishConfig, textMatches } from "../XstylishConfigLib"

const xstylish_BacklogJp: XstylishConfig = { // eslint-disable-line @typescript-eslint/naming-convention
    name: "backlog.jp",
    targetPage: loc => loc.href.includes(".backlog.jp/"),
    style: ".project-nav { opacity: 0.5 }"
}

const xstylish_Bing = { // eslint-disable-line @typescript-eslint/naming-convention
    name: "Bing",
    targetPage: loc => loc.href.startsWith("https://www.bing.com/search?"),
    script: (loc) => {
        // Google検索へリダイレクトする
        const params = new URLSearchParams(location.search)
        const q = params.get("q")
        if (q == null) {
            return
        }

        const url = new URL("https://www.google.com/search")
        url.searchParams.set("q", q)
        loc.href = url.href
    }
} satisfies XstylishConfig

const xstylish_AccessBlocker = { // eslint-disable-line @typescript-eslint/naming-convention
    name: "AccessBlocker",
    targetPage: loc => textMatches(loc.host, [
        "twitter.com",
        "x.com",
        "www.youtube.com"
    ]),
    style: "body { display: none }",
    script: () => {
        document.body.innerHTML = "Access Blocked"
        setInterval(() => {
            document.body.innerHTML = "Access Blocked"
        }, 1000)
    }
} satisfies XstylishConfig

export default (dest: XstylishConfig[]) => {
    dest.push(xstylish_BacklogJp)
    dest.push(xstylish_Bing)
    if ("有効化する場合は空文字にする".length === 0) dest.push(xstylish_AccessBlocker)
}
