import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves project sites from /<repository-name>/.
  // Relative asset URLs keep the build portable to that subpath.
  base: './',
});
