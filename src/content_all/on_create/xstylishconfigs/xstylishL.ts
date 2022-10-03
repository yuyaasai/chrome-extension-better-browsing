import xstylish from '../xstylish';
import { XstylishConfig, textMatches } from '../XstylishConfigLib';

const xstylish_EyeFriendly: XstylishConfig = {
    name: '',
	// requiredFontFamilies: ['minmoji'],
	targetPage: loc => !textMatches(loc.host, [ // 除外リスト
		'slideshare',
		'goworkship.com',
		'fern',
		'.salesforce',
		'.force.',
		'kojs.sukobuto.com',
		/^.uo.i\.co\.jp$/,
		/^a\d\d.netlify.com$/,
		/\.nec.(?:d.v|s.g|l.c.)\./,
		/^[a-z]+.azure.com$/,
		/(?<!www)\.google\.com$/,
		/([a-z]+\.)?an.e..a..net$/,
	]),
	style: `
a,address,b,blockquote,body,button,caption,content,details,div,dd,dl,dt,fieldset,figure,h1,h2,h3,h4,h5,h6,input,
label,legend,li,main,option,p,progress,section,select,small,span,strong,summary,sup,sub,tbody,td,th,tr,textarea{
	font-family:
'BIZ UDPゴシック', MeiryoKe_Gothic,
'mk-icomoon', icomoon, FontAwesome,
-apple-system, BlinkMacSystemFont, 'Lucida Grande', 'Segoe UI',
'Hiragino Maru Gothic ProN',
'メイリオ', Meiryo, sans-serif, Helvetica, Arial
	!important;
}
pre, pre *, code, code *, textarea, kbd, samp {	
	font-family:
Meiryoke_Console, MeiryoKe_Gothic,
'Source Code Pro', Consolas, Monaco, Menlo, monospace
	!important;
}
/*AWS*/ .cwdb-icon { font-family: aws-console!important }
/*GoogleCalendar*/ content i, content span { font-family: 'Material Icons Extended'!important; }
/*AzureDevOps*/ [class^="ms-Icon-"], [class*=" ms-Icon-"] { font-family: AzureDevOpsMDL2Assets!important }
.fa, .fab, .far, .fas { font-family: icomoon, 'Font Awesome 5 Brands', 'Font Awesome 5 Free', FontAwesome!important; }
.glyphicons, .glyphicon { font-family: icomoon, 'Glyphicons Regular', 'Glyphicons Halflings', 'Glyphicons Social', 'Glyphicons Filetypes'!important; }
`};

export default (dest: XstylishConfig[]) => {
    dest.push(xstylish_EyeFriendly);
};
