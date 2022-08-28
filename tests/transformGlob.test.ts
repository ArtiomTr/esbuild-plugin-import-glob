import { transformGlob } from '../src/transformGlob';
import { Volume, createFsFromVolume } from 'memfs';
import { type FileSystemAdapter } from 'fast-glob';
import { readFile } from 'fs/promises';
import { resolve, parse } from 'path';

const getTestData = async (testName: string) => {
	const input = await readFile(resolve(__dirname, 'data', testName));
	const { name, ext } = parse(testName);
	const output = await readFile(resolve(__dirname, 'data', `${name}.res${ext}`));

	return { input: input.toString(), output: output.toString().replace(/\r/g, '') };
};

describe('transformGlob', () => {
	// Memory file system definitions
	const volume = Volume.fromJSON({
		'/test/hello.ts': '',
		'/test/hello.tsx': '',
		'/test/bye.ts': '',
		'/test/bye.js': '',
		'/asdf/a.ts': '',
		'/test/asdf/hello.ts': '',
	});
	const fs = createFsFromVolume(volume) as FileSystemAdapter;
	const rootPath = '/test/hello.ts';

	it('should transform glob inside js file to dynamic imports', async () => {
		const { input, output } = await getTestData('dynamic.js');

		const result = await transformGlob(input, { path: rootPath, fs });

		expect(result.contents).toBe(output);
		expect(result.errors).toBeUndefined();
	});

	it('should transform glob inside js file to named dynamic imports', async () => {
		const { input, output } = await getTestData('named-dynamic.js');

		const result = await transformGlob(input, { path: rootPath, fs });

		expect(result.errors).toBeUndefined();
		expect(result.contents).toBe(output);
	});

	it('should transform glob inside js file to namespace imports', async () => {
		const { input, output } = await getTestData('namespace.js');

		const result = await transformGlob(input, { path: rootPath, fs });

		expect(result.errors).toBeUndefined();
		expect(result.contents).toBe(output);
	});

	it('should transform glob inside js file to named imports', async () => {
		const { input, output } = await getTestData('named.js');

		const result = await transformGlob(input, { path: rootPath, fs });

		expect(result.errors).toBeUndefined();
		expect(result.contents).toBe(output);
	});
	
	it('should avoid naming collision when transforming 2 namespace imports', async () => {
		const { input, output } = await getTestData('2namespaces.js');

		const result = await transformGlob(input, { path: rootPath, fs });

		expect(result.errors).toBeUndefined();
		expect(result.contents).toBe(output);
	});
});
