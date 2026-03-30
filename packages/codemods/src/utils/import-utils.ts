import {
	type ASTPath,
	type Collection,
	ImportDeclaration,
	ImportSpecifier,
	type JSCodeshift,
} from 'jscodeshift';

export function getImports(root: Collection, path: string): Collection<ImportDeclaration> {
	return root.find(ImportDeclaration, { source: { value: path } });
}

export function getComponentNameOrAliasFromImports(
	j: JSCodeshift,
	paths: Collection<ImportDeclaration>,
	componentName: string,
): string | null {
	let result: string | null = null;

	paths.forEach((path) => {
		const specifiers: ImportSpecifier[] = [];
		j(path)
			.find(ImportSpecifier)
			.forEach((s) => specifiers.push(s.node));

		const match = specifiers.find((s) => s.imported.name === componentName);
		if (match) {
			result = match.local?.name ?? componentName;
		}
	});

	return result;
}

export function updateImportSpecifierName(
	j: JSCodeshift,
	importPath: ASTPath<ImportDeclaration>,
	oldName: string,
	newName: string,
): void {
	j(importPath)
		.find(ImportSpecifier, { imported: { name: oldName } })
		.replaceWith((path) => {
			const alias = path.node.local?.name;
			const hasAlias = alias && alias !== oldName;
			return j.importSpecifier(j.identifier(newName), j.identifier(hasAlias ? alias : newName));
		});
}

export function removeSpecifierFromImport(
	j: JSCodeshift,
	path: ASTPath<ImportDeclaration>,
	specifierName: string,
): void {
	j(path)
		.find(ImportSpecifier, { imported: { name: specifierName } })
		.remove();

	if (!path.node.specifiers?.length) {
		j(path).remove();
	}
}
