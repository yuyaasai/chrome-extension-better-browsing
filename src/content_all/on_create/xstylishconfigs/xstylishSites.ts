import { XstylishConfig, textMatches } from '../XstylishConfigLib';

const xstylish_BacklogJp:XstylishConfig = {
	name: 'backlog.jp',
	targetPage: loc => loc.href.indexOf('.backlog.jp/') !== -1,
	style: `.project-nav { opacity: 0.5 }
`};

export default (dest: XstylishConfig[]) => {
    dest.push(xstylish_BacklogJp);
};
