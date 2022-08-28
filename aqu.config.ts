export default {
	input: './src/index.ts',
	format: ['cjs'],
	outfile: './dist/index.js',
	cjsMode: 'development',
	buildOptions: {
		platform: 'node',
	},
	dtsBundleGeneratorOptions: {
		libraries: {
			importedLibraries: ['node', 'esbuild'],
			allowedTypesLibraries: [],
		},
	},
};
