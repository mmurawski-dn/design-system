import { type ASTPath, type Collection, type JSCodeshift, type JSXElement } from 'jscodeshift';

export function findComponentElements(root: Collection, componentName: string): Collection<JSXElement> {
	return root.findJSXElements(componentName);
}

export function updateComponentName(j: JSCodeshift, elementPath: ASTPath<JSXElement>, newName: string): void {
	const elements = [elementPath.node.openingElement, elementPath.node.closingElement];

	for (const element of elements) {
		if (!element?.name) {
			continue;
		}
		element.name = j.jsxIdentifier(newName);
	}
}
