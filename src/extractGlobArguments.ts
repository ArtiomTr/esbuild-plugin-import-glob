import { NodePath, Node, types } from '@babel/core';
import { CodeError } from './CodeError';
import { ImportGlobOptions, isImportGlobOptions } from './ImportGlobOptions';

const evaluateConfidently = (nodePath: NodePath<Node>, argumentName: string): unknown => {
	const evaluation = nodePath.evaluate();

	if (!evaluation.confident) {
		throw new CodeError(`${argumentName} should be known at compile time.`, nodePath);
	}

	return evaluation.value;
};

const isArrayOfElements = <T>(value: unknown, predicate: (value: unknown) => value is T): value is T[] =>
	Array.isArray(value) && value.every(predicate);

export const extractGlobArguments = (nodePath: NodePath<types.CallExpression>) => {
	const globArguments = nodePath.get('arguments');
	const globPatterns = evaluateConfidently(globArguments[0], 'import.meta.glob first argument');

	if (
		typeof globPatterns !== 'string' &&
		!isArrayOfElements(globPatterns, (value): value is string => typeof value === 'string')
	) {
		throw new CodeError(
			'import.meta.glob first argument should be a string or array of strings.',
			globArguments[0],
		);
	}

	let globOptions: ImportGlobOptions = {};

	if (globArguments[1]) {
		const receivedOptions = evaluateConfidently(globArguments[1], 'import.meta.glob second argument');

		if (!isImportGlobOptions(receivedOptions)) {
			throw new CodeError(
				'import.meta.glob second argument should be an object of type `ImportGlobOptions`',
				globArguments[1],
			);
		}

		globOptions = receivedOptions;
	}

	return { patterns: globPatterns, options: globOptions };
};
