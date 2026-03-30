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

const SCHEMA_TO_VARIANT: Record<string, string> = {
	primary: 'primary',
	secondary: 'secondary',
};

const VARIANT_MAP: Record<string, string> = {
	ghost: 'tertiary',
	borderless: 'tertiary',
};

const UNMAPPABLE_VARIANTS = ['round', 'dashed'];

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
		if (isPropExists(j, elementPath, 'design')) {
			const designNode = getFirstPropNode(findProps(j, elementPath, 'design'));
			const designValue = designNode ? getPropValue(j, designNode) : undefined;

			if (designValue === 'v1.2') {
				return;
			}

			removeProp(j, elementPath, 'design');
		}

		if (isPropExists(j, elementPath, 'schema')) {
			const schemaNode = getFirstPropNode(findProps(j, elementPath, 'schema'));
			const schemaValue = schemaNode ? String(getPropValue(j, schemaNode)) : undefined;

			removeProp(j, elementPath, 'schema');

			if (schemaValue === 'error') {
				addNewProp(j, elementPath, 'color', 'negative');
			} else if (schemaValue && SCHEMA_TO_VARIANT[schemaValue]) {
				const mapped = SCHEMA_TO_VARIANT[schemaValue];
				if (mapped !== 'primary') {
					addNewProp(j, elementPath, 'variant', mapped);
				}
			}
		}

		if (isPropExists(j, elementPath, 'variant')) {
			const variantNode = getFirstPropNode(findProps(j, elementPath, 'variant'));
			const variantValue = variantNode ? String(getPropValue(j, variantNode)) : undefined;

			if (variantValue === 'filled') {
				removeProp(j, elementPath, 'variant');
			} else if (variantValue && VARIANT_MAP[variantValue]) {
				removeProp(j, elementPath, 'variant');
				addNewProp(j, elementPath, 'variant', VARIANT_MAP[variantValue]);

				if (variantValue === 'borderless') {
					addTodoComment(j, elementPath, '"borderless" mapped to "tertiary" — verify visual parity');
				}
			} else if (variantValue && UNMAPPABLE_VARIANTS.includes(variantValue)) {
				removeProp(j, elementPath, 'variant');
				addTodoComment(j, elementPath, `"${variantValue}" variant has no v3 equivalent — manual fix needed`);
			}
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
