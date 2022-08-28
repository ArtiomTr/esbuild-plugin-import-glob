import { readFile } from 'fs/promises';
import { TransformConfig, transformGlob } from './transformGlob';
import type { Loader, Plugin, PluginBuild } from 'esbuild';

export type PluginOptions = {
	jsFileRe: RegExp;
	jsxFileRe: RegExp;
	tsFileRe: RegExp;
	tsxFileRe: RegExp;
};

const defaultPluginOptions: PluginOptions = {
	tsFileRe: /\.ts$/,
	tsxFileRe: /\.tsx$/,
	jsFileRe: /\.js$/,
	jsxFileRe: /\.jsx$/,
};

const setBuilderLoader = (
	build: PluginBuild,
	filter: RegExp,
	loader: Loader,
	config: Omit<TransformConfig, 'path'>,
) => {
	build.onLoad({ filter }, async (parameters) => {
		const contentBuffer = await readFile(parameters.path);
		const content = contentBuffer.toString();

		const output = await transformGlob(content, {
			...config,
			path: parameters.path,
		});

		return {
			...output,
			loader,
		};
	});
};

const createPlugin = (options?: Partial<PluginOptions>): Plugin => {
	const { jsFileRe, jsxFileRe, tsFileRe, tsxFileRe } = Object.assign(options ?? {}, defaultPluginOptions);
	return {
		name: 'esbuild-plugin-import-glob',
		setup(build) {
			setBuilderLoader(build, jsFileRe, 'js', { ts: false, jsx: false });
			setBuilderLoader(build, jsxFileRe, 'jsx', { ts: false, jsx: true });
			setBuilderLoader(build, tsFileRe, 'ts', { ts: true, jsx: false });
			setBuilderLoader(build, tsxFileRe, 'tsx', { ts: true, jsx: true });
		},
	};
};

export default createPlugin;
