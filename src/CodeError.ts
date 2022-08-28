import { NodePath, Node } from '@babel/core';

export class CodeError extends Error {
	public constructor(message: string, public readonly nodePath: NodePath<Node>) {
		super(message);
	}
}
