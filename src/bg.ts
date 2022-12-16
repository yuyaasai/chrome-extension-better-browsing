const loadFileAsync = async (url: string): Promise<string> => {
    try {
        const path = chrome.runtime.getURL(url)
        console.log("load file at " + path)
        const response = await fetch(path)
        return await response.text()
    } catch (e) {
        throw new Error(`failed to load file at ${url}`, { cause: e as Error })
    }
}

const loadJsonFileAsync = async (path: string): Promise<any> => {
    let json: string | null = null
    try {
        json = await loadFileAsync(path)
        json = json.replace(/\/\*[\s\S]+\*\//g, "") // コメントの除去
        const ret = JSON.parse(json)
        console.log("loaded json:", ret)
        return ret
    } catch (e) {
        throw new Error(`invalid JSON: ${json ?? "(null)"} at ${chrome.runtime.getURL(path)}`, { cause: e as Error })
    }
}

// disable_discarding_list
(async (): Promise<void> => {
    const config = await loadJsonFileAsync("config/extensionConfig.json")
    const listSrc = config.disable_discarding_list as string[]
    const listTemp = listSrc.map(
        (x) => x.match(/^\/((?:[^/\r\n]|\\\/)(?:[^/\r\n]|\\\/)+)\/([ig]*)$/) ?? x.toLowerCase()
    )
    const list = listTemp.map((x) => (typeof x === "string" ? { test: (url: string) => url.startsWith(x) } : new RegExp(x[1], x[2])))

    const apply = (tab: chrome.tabs.Tab): void => {
        const tabId = tab.id ?? 0
        if (tabId > 0 && list.some((x) => x.test(tab.url ?? ""))) {
            chrome.tabs.update(tabId, { autoDiscardable: false }).catch(console.error)
        }
    }

    chrome.tabs.onUpdated.addListener((_, info, tab) => info.status === "complete" && apply(tab))
    chrome.tabs.query({}, (tabs) => tabs.forEach(apply))
})().catch(console.error)
