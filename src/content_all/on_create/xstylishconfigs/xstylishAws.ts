"use strict"
import { XstylishConfig } from "../XstylishConfigLib"
import { setNavColorAsync } from "../../../submodules/userscript-aws-console-colors/aws-console-colors.user"

const UuidStyles = [
    "font-weight: 400; background-color: #5a5a5a; color: #b9b9b9!important",
    "font-weight: 400; background-color: #5a5a5a; color: #cccc77!important",
    "font-weight: 400; background-color: #5a5a5a; color: #77cccc!important",
    "font-weight: 400; background-color: #5a5a5a; color: #66ce66!important",
    "font-weight: 400; background-color: #5a5a5a; color: #a0a0ff!important",
    "font-weight: 400; background-color: #5a5a5a; color: #ff9933!important",
    "font-weight: 400; background-color: #5a5a5a; color: #de99de!important",
    "font-weight: 400; background-color: #5a5a5a; color: #ef7979!important",
    "font-weight: 400; background-color: #5a5a5a; color: #ff66cc!important",
    "font-weight: 400; background-color: #5a5a5a; color: #dcdcdc!important",
    "font-weight: 400; background-color: #5a5a5a; color: #33ff33!important",
    "font-weight: 400; background-color: #5a5a5a; color: #ffff77!important",
    "font-weight: 400; background-color: #5a5a5a; color: #33ffff!important",
    "font-weight: 400; background-color: #5a5a5a; color: #ff4444!important"
]
const AWS_CONFIG = ["AWS_ENABLED", "AWS_DECORATION_ENABLED"]
const AWS_DISABLED = !AWS_CONFIG.includes("AWS_ENABLED")
const AWS_DECORATION_DISABLED = !AWS_CONFIG.includes("AWS_DECORATION_ENABLED")
const Days = ["日", "月", "火", "水", "木", "金", "土"]
const ClowdWatchLogCss = `
:root {
--styyl-red: #c82829;
--styyl-orange: #ec7211;
--styyl-yellow: #d4b542;
--styyl-purple: #8859a8;
--styyl-gray: #888;
--styyl-aws-num: rgb(138, 107, 5);
}
xx { display: none }
.styyl-sp { tab-size: 1 }
.styyl-f0 { font-size: 0 }
.styyl-quote { font-size: 0 }
.styyl-quote::after { content: "'"; font-size:1.4rem; color: #000!important }
.styyl-tag-info {}
.styyl-tag-event { color: var(--styyl-purple); font-weight: bold }
.styyl-tag-warn { color: var(--styyl-red) }
.styyl-tag-other { color: var(--styyl-red); font-weight: bold }
.styyl-tag-exception, .styyl-tag-error, .styyl-err, .styyl-fatal, .logs__log-events-table__content .logs__events__text-error { color: #ff2829!important; background-color: #ffff66!important; font-weight: 700 }
.styyl-jwt, .styyl-jwt .styyl-shorten { color: var(--styyl-red)!important }
.styyl-prop1, .styyl-prop2 { color: var(--styyl-purple) }
.styyl-ni { color: rgb(132, 86, 206) }
.styyl-remark { color: #eee; background-color: #222 }
.styyl-gray { color: var(--styyl-gray) }
.styyl-shorten { color: var(--styyl-gray) }
.styyl-stacktrace { color: var(--styyl-gray) }
.styyl-method { color: #afafaf }
.styyl-mockuuid, .styyl-mockuuid .styyl-shorten { color: var(--styyl-gray)!important }
.styyl-abbr::after { content: '…' }
.styyl-url, .styyl-email, .styyl-addr { color: #4271ae }
.styyl-num { color: var(--styyl-aws-num)!important }
.styyl-time, .styyl-time > .styyl-num, .styyl-time > .styyl-num > .styyl-num { color: var(--styyl-orange)!important }
.styyl-timestamp { color: var(--styyl-red) }
.styyl-time-y { font-weight: 700 }
.styyl-time-t { color: var(--styyl-gray) }
.styyl-time-h { color: var(--styyl-orange); display: inline-block; padding: 0 0 0 2px; font-weight: 700 }
.styyl-time-ms { color: var(--styyl-red); display: inline-block; padding: 0 2px 0 0; font-weight: 700 }
.styyl-time-f { color: var(--styyl-gray) }
.styyl-time-tz { color: var(--styyl-gray); font-weight: 700 }
.styyl-time-selected { color: yellow; background: #000 }

.logs__log-events-table__timestamp-cell { font-size: 13px!important }
.logs__log-events-table__cell { font-size: 14px!important; font-family: monaco,menlo,consolas,MeiryoKe_Gothic }
.awsui-table-row-selected span[data-testid="logs__log-events-table__message"] { display: none; opacity: 0 }
.logs__log-events-table__content, .logs__events__json { font-size: 15px!important; font-weight: bold!important; font-family: monaco,menlo,consolas,MeiryoKe_Gothic }
.logs__events__json { overflow: visible!important }`
type Replacer = (dest: string[], ...matches: string[]) => void
interface Store {
    uuidList: string[]
    style: HTMLStyleElement
    decorateUuid: Replacer
}

const replaceTextByMatches = (dest: string[], text: string, m: RegExpMatchArray, replacer: Replacer) => {
    if (m.index !== 0) {
        dest.push(text.substring(0, m.index))
    }
    replacer(dest, ...m)
    const tail = text.substring((m.index ?? 0) + m[0].length)
    if (tail.length !== 0) {
        dest.push(tail)
    }
}

const replaceText = (dest: string[], text: string, re: RegExp, replacer: Replacer) => {
    const matchesList = text.matchAll(re)
    let currentIndex = 0
    for (const m of matchesList) {
        if (currentIndex !== m.index) {
            dest.push(text.substring(currentIndex, m.index))
        }
        replacer(dest, ...m)
        currentIndex = (m.index ?? 0) + m[0].length
    }
    const tail = text.substring(currentIndex)
    if (tail.length !== 0) {
        dest.push(tail)
    }
}
const replaceTexts = (targets: (string)[], re: RegExp, replacer: Replacer): string[] => {
    const ret: string[] = []
    for (let i = 0, l = targets.length; i < l; i++) {
        const text = targets[i]
        if (text == null || text.length === 0) {
            throw new Error("target is null", { cause: { targets, re } })
        } else if (text[0] === "<") {
            ret.push(text)
        } else {
            replaceText(ret, text, re, replacer)
        }
    }
    return ret
}
const pad0 = (n: number) => (n <= 9 ? "0" : "") + String(n)
const shortenText = (t: string, len: number, className?: string, title?: string): string => {
    const clazz = (className != null ? "styyl-" + className.replace(/"/g, '\\"') + " " : "") + "styyl-gray"
    if (t.length <= len * 2 + 3) {
        return '<x class="' + clazz + '">' + t + "</x>"
    } else {
        return "<x title='" + (title ?? t).replace(/'/g, "\\'") + "' class='" + clazz + "'>" +
            t.slice(0, len) +
            "<x class=styyl-f0>" + t.slice(len, -len) + "</x><x class=styyl-abbr></x>" +
            t.slice(-len) +
            "</x>"
    }
}
const shortenBase64Text = (dest: string[], t: string/* base64、といいつつ"-"も含む */) => {
    const len = t.length
    if (/[=0-9]/.test(t)) { // 数字を含まない場合は普通の単語の可能性が高いのでこの判定を入れる
        if (!isNaN(Number(t))) {
            decorateNum(dest, t)
        } else if (len < 24) {
            dest.push("<x class=styyl-shorten>" + t + "</x>")
        } else {
            dest.push(shortenText(t, 12))
        }
    } else {
        dest.push(t) // 数値も=も含まない場合はbase64と判定しない
    }
}
const shortenSameChars = (dest: string[], t: string) => dest.push(shortenText(t, 6))
const decorateNum = (dest: string[], n: string) => {
    const l = n.length
    if (l === 10 || l === 13) { // as timestamp
        const time = Number(l === 10 ? n + "000" : n) + 32400000 // 32400000は9時間 (+09:00)
        const d = new Date(time)
        if (!isNaN(d.getTime())) {
            const hasMs = (time % 1000) !== 0
            const hasSec = (time % 100000) !== 0
            return dest.push(
                `<x class=styyl-timestamp title="${d.getUTCFullYear()}/${pad0(d.getUTCMonth() + 1)}/${
                    pad0(d.getUTCDate())}(${Days[d.getUTCDay()]}) ${pad0(d.getUTCHours())}時${pad0(d.getUTCMinutes())}分${
                    hasSec ? `${pad0(d.getUTCSeconds())}${hasMs ? "." + String(d.getUTCMilliseconds()) : ""}秒` : ""}">${n}</x>`
            )
        }
    }
    return dest.push("<x class=styyl-num>" + n + "</x>")
}
const decorateJwt = (dest: string[], m: string, a: string, b: string) => {
    let title
    try {
        title = JSON.stringify(JSON.parse(atob(a)), null, "　") + "." + JSON.stringify(JSON.parse(atob(b)), null, "　")
    } catch (e) {}
    dest.push(shortenText(m, 6, "jwt", title))
}
const decorateX = (dest: string[], t: string) => dest.push("<x>" + t + "</x>")
const decorateTime = (dest: string[], t: string) => dest.push("<x class=styyl-time>" + t + "</x>")
const decorateStackTrace = (dest: string[], _: string, a: string, method: string, b: string, line: string, c: string) => dest.push(
    "<x class=styyl-stacktrace>" + a + "<x class=styyl-method>" + method + "</x>" + b + "<span class=styyl-num>" + line + "</span>" + c + "</x>")
const decorateUrl = (dest: string[], url: string) => dest.push("<x class=styyl-url>" + url + "</x>")
const decorateMacAddress = (dest: string[], i: string) => dest.push("<x class=styyl-url>" + i + "</x>")
const decorateIpAddress = (dest: string[], ipv4or6: string) => dest.push("<x class=styyl-url>" + ipv4or6 + "</x>")
const decorateDomain = (dest: string[], d: string) => dest.push("<x class=styyl-url>" + d + "</x>")
const decorateAddress = (dest: string[], x: string) => dest.push("<x class=styyl-addr>" + x + "</x>")
const shortenMockUuid = (uuid: string) => shortenText(uuid, 6, "mockuuid")
const shortenUuid = (dest: string[], uuid: string) => dest.push(shortenText(uuid, 6, uuid))
const decorateEmail = (dest: string[], email: string) => dest.push("<x class=styyl-email>" + email + "</x>")
const decorateProp1 = (dest: string[], m: string) => dest.push("<x class=styyl-prop1>" + m + "</x>")
const decorateProp2 = (dest: string[], m: string) => dest.push("<x class=styyl-prop2>" + m + "</x>")
const textContentToDecoratedHtml = (
    targetNode: Node,
    store: Store,
    colorUuid: boolean
): { uuidColored: boolean, htmls: string[] } => {
    let ret: string[] = []

    // テキストをHTMLに変換するのでエスケープ
    const temp: string = (targetNode.textContent ?? "").replace(/[&<>]/g, m => m === "<" ? "&lt" : m === ">" ? "&gt" : "&amp")

    let uuidColored = false
    if (!colorUuid) {
        ret.push(temp)
    } else {
        // 最初のUUIDへの色付け
        let tempMatch = temp.match(/([0-9]{4}-[0-9]{2}-[0-9]{2}T[^ ]+)\t([a-z0-9]{8}-(?:[a-z0-9]{4}-){3}[a-z0-9]{12})\t([A-Z]+)\t([\s\S]+)/)
        if (tempMatch != null) {
            // 2022-07-07T03:18:05.689Z f52ee991-3f2b-512f-9644-b2d16d8d1fac INFO (log) at MethodName (/var/???.js:127:12)
            replaceTextByMatches(ret, temp, tempMatch, (dest, _, date, uuid, lv, log) => {
                decorateTime(dest, date)
                dest.push("<x class=styyl-sp>\t</x>")
                store.decorateUuid(dest, uuid)
                dest.push("<x class=styyl-sp>\t</x>")
                dest.push(`<x class="styyl-tag-${lv.toLowerCase().replace(/"/g, "")}">${lv}</x>`)
                dest.push("<x class=styyl-sp>\t</x>")
                dest.push(log)
            })
        } else {
            tempMatch = temp.match(/(?<=\s|^)[a-z0-9]{8}-(?:[a-z0-9]{4}-){3}[a-z0-9]{12}(?=\s)/)
            if (tempMatch != null) {
                replaceTextByMatches(ret, temp, tempMatch, store.decorateUuid)
                uuidColored = true
            } else {
                ret.push(temp)
            }
        }
    }

    const r = replaceTexts
    ret = r(ret, /(?:(?:START|REPORT|END) RequestId|Billed Duration|Memory Size|Max Memory Used|Init Duration|XRAY TraceId):\s*/g, decorateProp1)
    ret = r(ret, /"queryStringParameters":\s*/g, (dest, m) => dest.push("<x styyl-remark>" + m + "</x>"))
    ret = r(ret, / (?:Chrome|AppleWebKit)\/[.0-9]+/g, decorateX) // Chromeのversionがipaddrとかぶるので先に
    if (false) { // eslint-disable-line no-constant-condition
        // アドレス系
        ret = r(ret, /arn:aws:[-_/:0-9a-zA-Z./]+[0-9a-zA-Z]+/g, decorateUrl) // AWSのARN
        ret = r(ret, /https?:\/\/(?:[-_0-9a-zA-Z]+\.){1,}[-_0-9a-zA-Z]+(\/[\w!?/+\-_~=.,*&@#$%()'[\]:]+)?/g, decorateUrl) // URL
        ret = r(ret, /[+\-._0-9a-zA-Z]+@([-_0-9a-zA-Z]+\.)+(?:net|com|org|(?:(?:co|ne)\.)?jp|jp|info|xyz)/g, decorateEmail) // email (text@domain)
        ret = r(ret, /[-_0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.(?:net|com|org|(?:(?:co|ne)\.)?jp|jp|info|xyz)/g, decorateDomain) // domainはURLの後
        ret = r(ret, /(?<![0-9a-fA-Z:])(?:[0-9a-fA-F]{2}:){5}(?:[0-9a-fA-F]{2})(?![0-9a-zA-Z:])/g, decorateMacAddress)
        ret = r(ret, /(?:::)?(?:[0-9a-fA-F]{0,4}:){2,}:?(?![0-9a-fA-F:])(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?![0-9])|(?<![0-9])(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?![0-9])/g, decorateIpAddress) // 簡易IPv6|IPv4
    } else {
        // アドレス系まとめ(高速化)
        ret = r(ret, /arn:aws:[-_/:0-9a-zA-Z./]+[0-9a-zA-Z]+|https?:\/\/(?:[-_0-9a-zA-Z]+\.){1,}[-_0-9a-zA-Z]+(\/[\w!?/+\-_~=.,*&@#$%()'[\]:]+)?|[+\-._0-9a-zA-Z]+@([-_0-9a-zA-Z]+\.)+(?:net|com|org|(?:(?:co|ne)\.)?jp|jp|info|xyz)|[-_0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.(?:net|com|org|(?:(?:co|ne)\.)?jp|jp|info|xyz)|(?<![0-9a-fA-Z:])(?:[0-9a-fA-F]{2}:){5}(?:[0-9a-fA-F]{2})(?![0-9a-zA-Z:])|(?:::)?(?:[0-9a-fA-F]{0,4}:){2,}:?(?![0-9a-fA-F:])(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?![0-9])|(?<![0-9])(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?![0-9])/g, decorateAddress)
    }
    if (false) { // eslint-disable-line no-constant-condition
        // 時刻
        ret = r(ret, /(?<![0-9])20[0-9]{2}[-/]?(?:0[1-9]|1[0-2])[-/]?(?:0[1-9]|[1-3][0-9])\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9](?![0-9])/g, decorateTime) // 日時: 20yyMMdd or 20yy/MM/dd or 20yy-MM-dd + 時刻(HH:mm:ss)
        ret = r(ret, /(?:MON|TUE|WED|THU|FRI|SAT|SUM) (?:JAN|FEB|MAR|APR|MAY|JUNE?|JULY?|AUG|SEPT?|OCT|NOV|DEV) [0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2} UTC [0-9]{4}/ig, decorateTime) // Tue Jul 12 02:13:30 UTC 2022
        ret = r(ret, /[0-9]{4}\/[0-9]{2}\/[0-9]{2}|[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?(?:\+[0-9]{2}:[0-9]{2})?Z?/g, decorateTime) // yyyy-MM-ddThh:mm:ss.fff+09:00
        ret = r(ret, /[0-3][0-9]\/(?:JAN|FEB|MAR|APR|MAY|JUNE?|JULY?|AUG|SEPT?|OCT|NOV|DEV)\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2} \+[0-9]{4}/ig, decorateTime) // 12/Jul/2022:04:14:05 +0000
        ret = r(ret, /(?:MON|TUE|WED|THU|FRI|SAT|SUM), [0-9]{2} (?:JAN|FEB|MAR|APR|MAY|JUNE?|JULY?|AUG|SEPT?|OCT|NOV|DEV) [0-9]{4}(?: [0-9]{2}:[0-9]{2}:[0-9]{2}(?: GMT)?)?/ig, decorateTime) // 日時: Tue, 31 Jan 2022
        ret = r(ret, /[1-9][0-9]{3}[0-1][0-9][0-3][0-9]T[0-9]{6}Z/ig, decorateTime) // 20220823T082059Z
    } else {
        // 日時の正規表現まとめ(高速化)
        ret = r(ret, /(?<![0-9])20[0-9]{2}[-/]?(?:0[1-9]|1[0-2])[-/]?(?:0[1-9]|[1-3][0-9])\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9](?![0-9])|(?:MON|TUE|WED|THU|FRI|SAT|SUM) (?:JAN|FEB|MAR|APR|MAY|JUNE?|JULY?|AUG|SEPT?|OCT|NOV|DEV) [0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2} UTC [0-9]{4}|[0-9]{4}\/[0-9]{2}\/[0-9]{2}|[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?(?:\+[0-9]{2}:[0-9]{2})?Z?|[0-3][0-9]\/(?:JAN|FEB|MAR|APR|MAY|JUNE?|JULY?|AUG|SEPT?|OCT|NOV|DEV)\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2} \+[0-9]{4}|(?:MON|TUE|WED|THU|FRI|SAT|SUM), [0-9]{2} (?:JAN|FEB|MAR|APR|MAY|JUNE?|JULY?|AUG|SEPT?|OCT|NOV|DEV) [0-9]{4}(?: [0-9]{2}:[0-9]{2}:[0-9]{2}(?: GMT)?)?|[1-9][0-9]{3}[0-1][0-9][0-3][0-9]T[0-9]{6}Z/ig, decorateTime)
    }
    ret = r(ret, /(?<=\s)(at (?:async )?)([._&a-zA-Z0-9]+)( \(.+?:)(\d+)([^)]+\))/g, decorateStackTrace)
    ret = r(ret, /(ey[-_0-9a-zA-Z]{26,})\.(ey[-_0-9a-zA-Z]{26,})\.([-_0-9a-zA-Z]+)/g, decorateJwt)
    ret = r(ret, /(?<=[\s"',><:])(?:40[0-9]|41[0-8]|42[1-9]|431|451|50[0-8]|51[0-1]|(?:[A-Z][a-z]*){1,}(?:Error|Exception)|UNAUTHORIZED|Unauthorized|ERROR|EXCEPTION|FAIL(?:ED)?|Fail(?:ed)?|(?:TASK |Task )?(?:TIMED?|Timed?) ?(?:OUT|Out|out))(?=[\s'",><:]|$)/g, (dest, m) => dest.push('<x class="styyl-err">' + m + "</x>")) // エラーに色付け
    ret = r(ret, /(__stripe_[a-z]+=)([a-z0-9]{8}-(?:[a-z0-9]{4}-){3}[a-z0-9]{18})/g, (dest, _, a, b) => dest.push("<x class=styyl-gray>" + a + "</x>" + shortenMockUuid(b))) // UUIDもどき
    ret = r(ret, /[a-z0-9]{8}-(?:[a-z0-9]{4}-){3}[a-z0-9]{12}/g, shortenUuid)
    ret = r(ret, /([^\s])\1{24,}/g, shortenSameChars) // 連続(25以上)した同じ文字
    ret = r(ret, /(?<![0-9a-zA-Z])ap-[a-z]+-[1-9]+_/g, (dest, m) => decorateX(dest, m)) // aws
    ret = r(ret, /(card|prod|sub|price|cus|si|evt|in|il|di|ch)_([0-9a-zA-Z]{12,})/g, (_, a, b) => a + "_" + shortenText(b, 4)) // stripe
    ret = r(ret, /(pi)_([a-zA-Z0-9]+)_(secret)_([a-zA-Z0-9]+)/g, (_, a, b, c, d) => `<x class=styyl-gray>${a}<x>_</x>${shortenText(b, 4)}<x>_</x>${c}<x>_</x>${shortenText(d, 4)}</x>`) // stripe
    ret = r(ret, /([1-9])-([0-9a-fA-F]{8})-([0-9a-fA-F]{24})(?![0-9a-fA-F])/g, (_, a, b, c) => `<x class=styyl-gray>${a}<x>-</x><x>${b}</x><x>-</x>${shortenText(c, 4)}</x>`) // X-Amzn-Trace-Id
    ret = r(ret, /(?<![0-9])20[0-9]{2}[-/]?(?:0[1-9]|1[0-2])[-/]?(?:0[1-9]|[1-3][0-9])(?![0-9])/g, decorateTime) // 日時: 20yyMMdd or 20yy/MM/dd or 20yy-MM-dd
    ret = r(ret, /(\s*)\[([-_ a-zA-Z]+)\](\s*)/g, (dest, _, m1, m2, m3) => {
        let t = m2.toLowerCase()
        if (!["info", "debug", "trace", "warn", "error", "fatal", "exception", "event"].includes(t)) {
            t = "other"
        }
        dest.push(`<x class=styyl-sp>${m1}</x><x class=styyl-tag-${t}>[${m2}]</x><x class=styyl-sp>${m3}</x>`)
    })

    ret = r(ret, /[-_+/a-zA-Z0-9]{12,}=*/g, shortenBase64Text)
    ret = r(ret, /(?:[-_a-zA-Z0-7]+)(?:[=:])(?!$)/g, decorateProp1)
    ret = r(ret, /(["'])([^"]+)\1:(?!$)/g, decorateProp2)
    ret = r(ret, /(?<![a-zA-Z])(undefined|null|false|true)(?![a-zA-Z])/g, (dest, m) => dest.push("<x class=styyl-ni>" + m + "</x>"))
    ret = r(ret, /(?<=[\s"',:])([0-9]+(?:\.[0-9]+)?)(?=[\s'",:]|$)/g, decorateNum) // 数値

    return { uuidColored, htmls: ret }
}

const walk = (element: HTMLElement, store: Store, recursiveCall: boolean) => {
    const childNodes = [...element.childNodes]
    if (childNodes.length === 0) {
        return
    }

    if (!recursiveCall) {
        if (childNodes[0].nodeName === "XX") {
            return // <XX></XX>がある場合は処理済みなので処理終了
        } else {
            element.insertBefore(document.createElement("XX"), childNodes[0])
            // setTimeout(() => console.log('insert XX'), 1)
        }
    }

    let colorUuid = !recursiveCall
    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i]
        const nodeName = node.nodeName
        if (nodeName === "#text") {
            const deco = textContentToDecoratedHtml(node, store, colorUuid)
            if (deco.uuidColored) {
                colorUuid = false
            }

            const dom = new DOMParser().parseFromString("<body>" + deco.htmls.join("") + "</body>", "text/html");
            [...dom.body.childNodes].forEach(newNode => {
                element.insertBefore(newNode, node)
            })
            node.remove()
        } else if (nodeName === "X") {
            // XXでガードしているので、ここは基本的には通らないはず。通っても処理済みなので何もしない
        } else if (nodeName === "BR") {
            // 何もしないtag
        } else {
            const ele = (node as HTMLElement)
            if (ele.classList.contains("logs__events__json-string")) {
                const htmls = textContentToDecoratedHtml(ele, store, false).htmls

                // logs__events__json-string の文字列エスケープが見にくいので改良
                let h = htmls.join("")
                const re = /\\(<x(?: [^>]+)?>)?"/g
                if (h.length >= 3 && h[0] === '"' && h[h.length - 1] === '"' && re.test(h)) {
                    h = '<x class=styyl-quote>"</x>' +
                        h.substring(1, h.length - 1).replace(re, '<x class=styyl-f0>\\</x>$1"') +
                        '<x class=styyl-quote>"</x>'
                }
                ele.innerHTML = h
            } else if (ele.classList.contains("logs__events__text-error")) {
                // 処理不要
            } else if (ele.classList.contains("logs__events__json-null")) {
                // 処理不要
            } else if (ele.classList.contains("logs__events__json-key")) {
                // 処理不要
            } else if (ele.classList.contains("logs__events__json-boolean")) {
                // 処理不要
            } else if (ele.classList.contains("logs__events__json-number")) {
                // 処理不要
            } else if (ele.classList.contains("logs__events__json")) {
                walk(ele, store, true)

                // クリック時にjsonの内容をconsole出力する
                ele.addEventListener("click", (ex) => {
                    const text = ele.innerText
                    const time = ele.closest(".awsui-table-row")?.querySelector(".logs__log-events-table__cell .logs__log-events-table__timestamp-cell")?.textContent ?? ""
                    try {
                        console.log("🌟" + time + "🌟", JSON.parse(text))
                    } catch (ex) {
                        console.log("🔥" + time + "🔥", ex, text)
                    }
                })
            } else {
                console.warn("ここは通らない？", { ele, outerHtml: ele.outerHTML, childNodes })
                walk(ele, store, true)
            }
        }
    }
}

const getAllAddedHtmlElements = (mutations: MutationRecord[]) => {
    const ret: HTMLElement[] = []
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
            if (addedNode instanceof HTMLElement) {
                ret.push(addedNode)
            }
        })
    })
    return ret
}

const xstylishScript = (
    iframeAddedCallback: (iframe: HTMLIFrameElement, colorTask: Promise<{ contentBgColor: string }>) => void,
    iframeRemovedCallback: (iframe: HTMLIFrameElement) => void
) => {
    if (AWS_DISABLED) {
        console.log("AWS_DISABLED")
        return
    }

    const colorTask = setNavColorAsync(document, [
        { pattern: /dev/i }
    ])

    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((addedNode) => {
                if (addedNode instanceof HTMLElement) {
                    const iframes = addedNode.getElementsByTagName("IFRAME")
                    for (let a = 0; a < iframes.length; a++) {
                        iframeAddedCallback(iframes[a] as HTMLIFrameElement, colorTask)
                    }
                }
            })

            mutation.removedNodes.forEach((removedNode) => {
                if (removedNode instanceof HTMLElement) {
                    const iframes = removedNode.getElementsByTagName("IFRAME")
                    for (let b = 0; b < iframes.length; b++) {
                        iframeRemovedCallback(iframes[b] as HTMLIFrameElement)
                    }
                }
            })
        })
    }).observe(document.body, { attributes: false, characterData: false, subtree: true, childList: true })
}

const iframeAddedCallback = (iframe: HTMLIFrameElement, colorTask: Promise<{ contentBgColor: string }>) => {
    const id = iframe.id
    const contentWindow = iframe.contentWindow
    console.log("ADDED:", { id, iframe, contentWindow })
    if (contentWindow == null) throw new Error(`${id} is null`)
    const doc = contentWindow.document

    colorTask.then(colors => {
        const s = doc.createElement("style")
        s.innerHTML = `main { background-color: ${colors.contentBgColor}!important }`
        doc.head.append(s)
    }).catch(console.error)

    if (id === "microConsole-Logs") {
        console.log({ id, contentWindow, doc })

        const style = doc.createElement("style")
        style.id = "xstyll-aws"
        doc.head.appendChild(style)
        style.innerHTML = ClowdWatchLogCss

        if (AWS_DECORATION_DISABLED) return

        new MutationObserver((mutations, observer) => {
            getAllAddedHtmlElements(mutations).forEach((addedNode) => {
                const tables = addedNode.getElementsByClassName("awsui-table-container")
                for (let i = 0, l = tables.length; i < l; i++) {
                    const table = tables[i] as HTMLElement
                    console.log("awsui-table-container", table)
                    if (table.dataset.doneTag === "1") continue
                    table.dataset.doneTag = "1"

                    const store: Store = {
                        uuidList: [],
                        style,
                        decorateUuid: (dest: string[], uuid: string): void => {
                            const className = "styyl-" + uuid
                            if (!store.uuidList.includes(uuid)) {
                                const style = UuidStyles[store.uuidList.length % UuidStyles.length]
                                store.uuidList.push(uuid)
                                store.style.innerHTML += `\n.${className} { padding: 0 2px }\n.${className}, .${className} * { ${style} }`
                            }
                            shortenUuid(dest, uuid)
                        }
                    }

                    const tbody = table.querySelector("tbody")
                    if (tbody == null) {
                        console.error("tbody not found")
                        continue
                    }

                    const render = () => {
                        const selector = '[data-testid="logs__log-events-table__message"], .logs__log-events-table__formatted-message .logs__log-events-table__content'
                        const messages = tbody.querySelectorAll(selector)
                        for (let m = 0, n = messages.length; m < n; m++) {
                            const message = messages[m]
                            if (message instanceof HTMLElement) {
                                walk(message, store, false)
                            }
                        }

                        const times = tbody.querySelectorAll(".logs__log-events-table__timestamp-cell")
                        for (let m = 0, n = times.length; m < n; m++) {
                            const t = times[m]
                            if ([...t.children].findIndex(x => x.nodeName === "XX") === -1) {
                                t.innerHTML = "<xx></xx>" + t.innerHTML.replace(
                                    /(20[0-9]{2}-[01][0-9]-[0-3][0-9])T([0-2][0-9]):([0-5][0-9]:[0-5][0-9])\.([0-9]+)\+([0-2][0-9]:[0-5][0-9])/,
                                    (_, y: string, h: string, ms: string, f: string, tz: string) => `<x class=styyl-time-y>${y
                                    }</x><x class=styyl-time-t>T</x><x class=styyl-time-h>${h}</x><x class=styyl-time-ms>:${ms
                                    }</x><x class=styyl-time-f>.${f}</x><x class=styyl-time-tz>+${tz}</x>`)
                            }
                        }
                    }

                    const beginRender = () => {
                        // console.log('render')
                        render()
                        new MutationObserver((mutationsList, observer) => {
                            observer.disconnect()
                            render()
                            setTimeout(beginRender, 500)
                        }).observe(tbody, { childList: true, subtree: true, characterData: true })
                    }
                    beginRender()

                    // 時刻でmousedownしたときに色をtoggleする (clickにすると開閉してしまうのでmousedown)
                    // eslint-disable-next-line no-constant-condition
                    if (false) { // 追加で読み込み時などに位置がずれるので廃止
                        table.addEventListener("mousedown", (e) => {
                            const t = e.target as HTMLElement
                            if (t.classList.contains("logs__log-events-table__timestamp-cell")) {
                                t.classList.toggle("styyl-time-selected")
                            } else if (t.classList.contains("logs__log-events-table__cell")) {
                                const f = t.firstElementChild
                                if (f?.classList.contains("logs__log-events-table__timestamp-cell") === true) {
                                    f.classList.toggle("styyl-time-selected")
                                }
                            }
                        })
                    }
                }
            })
        }).observe(doc.body, { subtree: true, childList: true })
    }
}

const iframeRemovedCallback = (iframe: HTMLIFrameElement) => {
    console.log("REMOVED:", { iframe })
}

const xstylish_Aws: XstylishConfig = { // eslint-disable-line @typescript-eslint/naming-convention
    name: "aws",
    targetPage: loc => loc.href.includes(".console.aws.amazon.com/") || loc.href.startsWith("https://console.aws.amazon.com/"),
    script: () => xstylishScript(iframeAddedCallback, iframeRemovedCallback)
}

export default (dest: XstylishConfig[]) => {
    dest.push(xstylish_Aws)
}

export const _private = {
    pad0_2: pad0
}
