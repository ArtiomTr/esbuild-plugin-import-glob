interface ImportMeta {
	glob: ImportGlobFunction;
}

type ImportGlobOptions<TEager extends boolean> = {
	eager?: TEager;
	import?: string;
};

interface ImportGlobFunction {
	<TEager extends boolean = false>(
		pattern: string | string[],
		options?: ImportGlobOptions<TEager>,
	): TEager extends true ? Record<string, unknown> : Record<string, () => Promise<unknown>>;
}
