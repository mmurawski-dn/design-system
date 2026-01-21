declare module '*.module.scss' {
	const classNames: { [key: string]: string };
	export = classNames;
}

declare module '*.scss';

declare module '*.svg' {
	const content: string;
	export default content;
}

declare module '*.svg?react' {
	import type { FC, SVGProps } from 'react';
	const ReactComponent: FC<SVGProps<SVGSVGElement>>;
	export default ReactComponent;
}
