# esbuild-plugin-import-glob

## Installation

In your esbuild start script:

```js
import { build } from 'esbuild';
import importGlobPlugin from '@sirse-dev/esbuild-plugin-import-glob';

build({
    plugins: [importGlobPlugin()],
})
```

To install TypeScript types, add to your tsconfig.json file:

```jsonc
{
    "compilerOptions": {
        /* ... */
    },
    "include": [/* ... */, "@sirse-dev/esbuild-plugin-import-glob/client.d.ts"]
}
```