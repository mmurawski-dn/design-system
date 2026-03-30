import { wrap, getImports, updateImportSpecifierName } from '../../../src/utils';
import { DS_IMPORT_PATH } from '../../../src/consts';
import type { TransformationContext } from '../../../types';

const SPECIFIER_RENAMES: Record<string, string> = {
	DsButtonUnifiedProps: 'DsButtonProps',
	DsButtonV3Props: 'DsButtonProps',
	buttonV3Variants: 'buttonVariants',
	buttonV3Colors: 'buttonColors',
	buttonV3Sizes: 'buttonSizes',
	ButtonV3Variant: 'ButtonVariant',
	ButtonV3Color: 'ButtonColor',
	ButtonV3Size: 'ButtonSize',
};

function transform({ j, root }: TransformationContext) {
	const imports = getImports(root, DS_IMPORT_PATH);
	if (!imports.length) {
		return;
	}

	imports.forEach((importPath) => {
		for (const [oldName, newName] of Object.entries(SPECIFIER_RENAMES)) {
			updateImportSpecifierName(j, importPath, oldName, newName);
		}
	});
}

export default wrap(transform);
