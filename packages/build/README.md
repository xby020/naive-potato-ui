# @naive-potato-ui/build

> Build tools for Naive Potato UI

# Generate vite config for child packages

# build process

## generate vite config
> generate common vite config by `generateViteConfig` function, which will be used by all child packages;
### plugins
- @vitejs/plugin-vue: for vue single file component;
- 

## build production code and style file
1. run `pnpm --filter ./packages/** build` to build all packages,which mean run `vite build` in each package, generate `dist` folder which contains 'es' and 'umd' production code and style file;
  
## generate dts file
1. using `vue-tsc` to generate dts file for every vue component and ts file in packages, but those dts file generated in root folder, so we need to move them to each individual package folder's dist folder(need to clean up root dist dir first);
2. move all dts file to each individual package folder's dist folder by vite plugin hook, and cause vite build didn't care about child package's `types` dir(if it has), so we need to move types dir to each individual package folder's dist folder too;


## generate new package.json content and replace it
1. now every package has its own dist folder which contains 'es' and 'umd' production code and style file and dts file;
2. generate new package.json content and replace the old one;
   1. name: `@naive-potato-ui` prefix, get package name by folder name, generate kebab-case 