// cspell:disable
import { type XstylishConfig, textMatches } from "../XstylishConfigLib"

const xstylish_EyeFriendly: XstylishConfig = { // eslint-disable-line @typescript-eslint/naming-convention
    name: "",
    targetPage: loc => !textMatches(loc.host, [ // 除外リスト (ドメイン)
        "slideshare",
        "goworkship.com",
        "fern",
        ".salesforce",
        ".force.",
        "kojs.sukobuto.com",
        ".codeply.com",
        /^.uo.i\.co\.jp$/,
        /^a\d\d.netlify.com$/,
        /\.nec.(?:d.v|s.g|l.c.)\./,
        /^[a-z]+.azure.com$/,
        /(?<!www)\.google\.com$/,
        /([a-z]+\.)?an.e..a..net$/,
    ]) && !textMatches(loc.href, [ // 除外リスト (URL)
        /\/webssh\/host/ // Azure の WebSSH
    ]),
    style: `
a,address,b,blockquote,body,button,caption,content,details,div,dd,dl,dt,fieldset,figure,h1,h2,h3,h4,h5,h6,input,
label,legend,li,main,option,p,progress,section,select,small,span,strong,summary,sup,sub,tbody,td,th,tr,textarea{
    font-family:
    "BIZ UDPゴシック",
    "mk-icomoon", icomoon, FontAwesome,
    -apple-system, BlinkMacSystemFont, "Lucida Grande", "Segoe UI",
    "Hiragino Maru Gothic ProN",
    "メイリオ", Meiryo, sans-serif, Helvetica, Arial!important;
}
pre, pre *, code, code *, textarea, kbd, samp {
    font-family:
    MeiryoKe_Console, MeiryoKe_Gothic,
    "Source Code Pro", Consolas, Monaco, Menlo, monospace!important;
}
[class^="icon-"], [class*=" icon-"] {
    font-family:
    "mk-icomoon", icomoon, FontAwesome, trellicons
    !important;
}

/*
::-webkit-scrollbar { width: 14px; height: 14px;}
::-webkit-scrollbar-track { background: #f0f0f0 }
::-webkit-scrollbar-thumb { background: #fff; border: 1px solid #888; border-radius: 7px;  }
 */

/*AWS*/ .cwdb-icon, .GJ-DSRBDLK { font-family: aws-console!important }
/*GoogleCalendar*/ content i, content span { font-family: "Material Icons Extended"!important }
/*AzureDevOps*/ .ms-Icon, .ms-Button-icon, .ms-SearchBox-icon, .ms-ContextualMenu-icon, [class^="ms-Icon-"], [class*=" ms-Icon-"], .ms-TitleBar--iconContainer { font-family: AzureDevOpsMDL2Assets, FabricMDL2InsightIcon, FabricMDL2Icons, FabricMDL2Icons-0, FabricMDL2Icons-1, FabricMDL2Icons-2, FabricMDL2Icons-3, FabricMDL2Icons-4, FabricMDL2Icons-5, FabricMDL2Icons-6, FabricMDL2Icons-7, FabricMDL2Icons-8, FabricMDL2Icons-9, FabricMDL2Icons-10, FabricMDL2Icons-11, FabricMDL2Icons-12!important }
.fa, .fab, .far, .fas { font-family: icomoon, "Font Awesome 5 Brands", "Font Awesome 5 Free", FontAwesome!important }
.glyphicons, .glyphicon { font-family: icomoon, "Glyphicons Regular", "Glyphicons Halflings", "Glyphicons Social", "Glyphicons Filetypes"!important }`
}

export default (dest: XstylishConfig[]) => {
    dest.push(xstylish_EyeFriendly)
}
