/* eslint-disable import/first */
"use strict"

//
// immediate: 即時
//
import onImmediate from "./on_immediate/onImmediate"
(() => {
    onImmediate()
})()

//
//  on create: document生成してOnReadyより前
//
import xstylish from "./on_create/xstylish"
const key = setInterval(() => {
    if (document.head != null && document.body != null) {
        clearInterval(key)

        xstylish(window)
    }
})

//
// on ready: DOMContentLoaded
//
import imageExpander from "./on_ready/imageExpander"
((f) => {
    if (document.readyState === "loading") {
        addEventListener("DOMContentLoaded", f, { once: true })
    } else {
        f()
    }
})(() => {
    imageExpander(window)
})

//
// on load
//
import onLoad from "./on_load/onLoad"
addEventListener("load", () => {
    onLoad()
}, { once: true })
