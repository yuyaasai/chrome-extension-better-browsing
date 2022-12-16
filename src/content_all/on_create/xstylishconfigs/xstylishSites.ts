import { XstylishConfig } from "../XstylishConfigLib"

const xstylish_BacklogJp: XstylishConfig = { // eslint-disable-line @typescript-eslint/naming-convention
    name: "backlog.jp",
    targetPage: loc => loc.href.includes(".backlog.jp/"),
    style: ".project-nav { opacity: 0.5 }"
}

export default (dest: XstylishConfig[]) => {
    dest.push(xstylish_BacklogJp)
}
