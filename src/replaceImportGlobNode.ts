import { NodePath, types } from '@babel/core';
import { ImportGlobOptions } from './ImportGlobOptions';

const createEagerIdentifier = (globIndex: number, pathIndex: number) =>
	types.identifier(`__glob_${globIndex}_${pathIndex}`);

const createValue = (globIndex: number, path: string, pathIndex: number, options: ImportGlobOptions) => {
	if (options.eager) {
		return createEagerIdentifier(globIndex, pathIndex);
	}

	const importExpression = types.callExpression(types.import(), [types.stringLiteral(path)]);

	if (!options.import) {
		return types.arrowFunctionExpression([], importExpression);
	}

	return types.arrowFunctionExpression(
		[],
		types.callExpression(types.memberExpression(importExpression, types.identifier('then')), [
			types.arrowFunctionExpression(
				[types.identifier('m')],
				types.memberExpression(types.identifier('m'), types.identifier(options.import)),
			),
		]),
	);
};

const generateImportStatement = (globIndex: number, path: string, pathIndex: number, options: ImportGlobOptions) => {
	const imported =
		options.import === undefined
			? types.importNamespaceSpecifier(createEagerIdentifier(globIndex, pathIndex))
			: types.importSpecifier(createEagerIdentifier(globIndex, pathIndex), types.identifier(options.import));

	return types.importDeclaration([imported], types.stringLiteral(path));
};

const generateImports = (
	nodePath: NodePath<types.CallExpression>,
	globIndex: number,
	paths: string[],
	options: ImportGlobOptions,
) => {
	const root = nodePath.findParent((path) => path.isProgram());

	if (root === null) {
		throw new Error('Cannot find program root.');
	}

	const importStatements = paths.map((path, pathIndex) =>
		generateImportStatement(globIndex, path, pathIndex, options),
	);

	(root as NodePath<types.Program>).unshiftContainer('body', importStatements);
};

export const replaceImportGlobNode = (
	nodePath: NodePath<types.CallExpression>,
	globIndex: number,
	paths: string[],
	options: ImportGlobOptions,
): void => {
	const replacement = types.objectExpression(
		paths.map((path, pathIndex) =>
			types.objectProperty(types.stringLiteral(path), createValue(globIndex, path, pathIndex, options)),
		),
	);

	nodePath.replaceWith(replacement);

	if (options.eager) {
		generateImports(nodePath, globIndex, paths, options);
	}
};
