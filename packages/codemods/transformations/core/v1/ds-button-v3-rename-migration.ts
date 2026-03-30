import {
	wrap,
	getImports,
	getComponentNameOrAliasFromImports,
	findComponentElements,
	updateComponentName,
	updateImportSpecifierName,
} from '../../../src/utils';
import { DS_IMPORT_PATH } from '../../../src/consts';
import type { TransformationContext } from '../../../types';

function transform({ j, root }: TransformationContext) {
	const imports = getImports(root, DS_IMPORT_PATH);
	const componentName = getComponentNameOrAliasFromImports(j, imports, 'DsButtonV3');
	if (!componentName) {
		return;
	}

	const isAliased = componentName !== 'DsButtonV3';

	if (!isAliased) {
		const elements = findComponentElements(root, componentName);
		elements.forEach((elementPath) => {
			updateComponentName(j, elementPath, 'DsButton');
		});
	}

	imports.forEach((importPath) => {
		updateImportSpecifierName(j, importPath, 'DsButtonV3', 'DsButton');
	});
}

export default wrap(transform);
