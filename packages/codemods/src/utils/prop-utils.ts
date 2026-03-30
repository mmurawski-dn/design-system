import {
	type ASTPath,
	type Collection,
	type JSCodeshift,
	JSXAttribute,
	type JSXElement,
	JSXOpeningElement,
} from 'jscodeshift';

export function findProps(
	j: JSCodeshift,
	elementPath: ASTPath<JSXElement>,
	...propNames: string[]
): Collection<JSXAttribute> {
	return j(elementPath)
		.find(JSXOpeningElement)
		.at(0)
		.find(JSXAttribute)
		.filter((attr) => {
			const attrName = attr.node.name.type === 'JSXIdentifier' ? attr.node.name.name : '';
			return propNames.includes(attrName);
		});
}

export function isPropExists(j: JSCodeshift, elementPath: ASTPath<JSXElement>, propName: string): boolean {
	return findProps(j, elementPath, propName).length > 0;
}

export function getFirstPropNode(props: Collection<JSXAttribute>): JSXAttribute | undefined {
	if (!props.length) {
		return undefined;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- jscodeshift .get() returns loosely typed path
	return props.get().node as JSXAttribute;
}

export function removeProp(j: JSCodeshift, elementPath: ASTPath<JSXElement>, ...propNames: string[]): void {
	findProps(j, elementPath, ...propNames).remove();
}

export function getPropValue(j: JSCodeshift, prop: JSXAttribute): unknown {
	const value = prop.value;

	if (value === null) {
		return true;
	}

	if (value?.type === 'StringLiteral') {
		return value.value;
	}

	if (value?.type === 'JSXExpressionContainer') {
		const expr = value.expression;
		if (expr.type === 'StringLiteral' || expr.type === 'NumericLiteral' || expr.type === 'BooleanLiteral') {
			return expr.value;
		}
	}

	return value ? j(value).toSource() : undefined;
}

export function setPropValue(j: JSCodeshift, attributePath: ASTPath<JSXAttribute>, newValue: string): void {
	attributePath.node.value = j.literal(newValue);
}

export function addNewProp(
	j: JSCodeshift,
	elementPath: ASTPath<JSXElement>,
	propName: string,
	propValue?: string | boolean,
): void {
	if (isPropExists(j, elementPath, propName)) {
		return;
	}

	let valueNode;
	if (propValue === undefined || propValue === true) {
		valueNode = null;
	} else if (typeof propValue === 'boolean') {
		valueNode = j.jsxExpressionContainer(j.literal(propValue));
	} else {
		valueNode = j.literal(propValue);
	}

	const newProp = j.jsxAttribute(j.jsxIdentifier(propName), valueNode);
	elementPath.node.openingElement.attributes?.push(newProp);
}

export function addTodoComment(j: JSCodeshift, elementPath: ASTPath<JSXElement>, message: string): void {
	const comment = j.commentLine(` TODO(codemod): ${message}`, true, false);

	/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment -- jscodeshift parent traversal is untyped */
	let target: ASTPath = elementPath;
	while (
		target.parent &&
		target.parent.node.type !== 'Program' &&
		target.parent.node.type !== 'BlockStatement'
	) {
		target = target.parent;
	}

	const node = target.node as unknown as Record<string, unknown>;
	if (!node.comments) {
		node.comments = [];
	}
	comment.leading = true;
	(node.comments as unknown[]).push(comment);
	/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
}
