import {
	wrap,
	getImports,
	getComponentNameOrAliasFromImports,
	findComponentElements,
	isPropExists,
	findProps,
	getPropValue,
	getFirstPropNode,
	removeProp,
	addNewProp,
	addTodoComment,
} from '../../../src/utils';
import { DS_IMPORT_PATH } from '../../../src/consts';
import type { TransformationContext } from '../../../types';

const BUTTON_TYPE_TO_VARIANT: Record<string, string> = {
	primary: 'primary',
	secondary: 'secondary',
	'secondary-light': 'secondary',
	tertiary: 'tertiary',
};

function transform({ j, root }: TransformationContext) {
	const imports = getImports(root, DS_IMPORT_PATH);
	const componentName = getComponentNameOrAliasFromImports(j, imports, 'DsButton');
	if (!componentName) {
		return;
	}

	const elements = findComponentElements(root, componentName);
	if (!elements.length) {
		return;
	}

	elements.forEach((elementPath) => {
		if (!isPropExists(j, elementPath, 'design')) {
			return;
		}

		const designNode = getFirstPropNode(findProps(j, elementPath, 'design'));
		const designValue = designNode ? getPropValue(j, designNode) : undefined;
		if (designValue !== 'v1.2') {
			return;
		}

		removeProp(j, elementPath, 'design');

		let resolvedVariant: string | undefined;

		if (isPropExists(j, elementPath, 'buttonType')) {
			const btNode = getFirstPropNode(findProps(j, elementPath, 'buttonType'));
			const btValue = btNode ? String(getPropValue(j, btNode)) : undefined;

			removeProp(j, elementPath, 'buttonType');

			if (btValue && BUTTON_TYPE_TO_VARIANT[btValue]) {
				resolvedVariant = BUTTON_TYPE_TO_VARIANT[btValue];

				if (btValue === 'secondary-light') {
					addTodoComment(j, elementPath, '"secondary-light" mapped to "secondary" — verify visual parity');
				}
			}
		}

		if (isPropExists(j, elementPath, 'variant')) {
			const variantNode = getFirstPropNode(findProps(j, elementPath, 'variant'));
			const variantValue = variantNode ? String(getPropValue(j, variantNode)) : undefined;

			removeProp(j, elementPath, 'variant');

			if (variantValue === 'ghost') {
				resolvedVariant = 'tertiary';
			} else if (variantValue === 'danger') {
				addNewProp(j, elementPath, 'color', 'negative');
			} else if (variantValue === 'dark') {
				addNewProp(j, elementPath, 'onDark');
			}
		}

		if (resolvedVariant && resolvedVariant !== 'primary') {
			addNewProp(j, elementPath, 'variant', resolvedVariant);
		}

		if (isPropExists(j, elementPath, 'contentClassName')) {
			removeProp(j, elementPath, 'contentClassName');
			addTodoComment(
				j,
				elementPath,
				'"contentClassName" removed — no v3 equivalent, use className or slotProps',
			);
		}
	});
}

export default wrap(transform);
