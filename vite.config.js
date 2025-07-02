import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/neutraltoken.css', dest: '.' },
        { src: 'src/logo.png', dest: '.' }
      ]
    }),
    rollupNodePolyFill()
  ],
  resolve: {
    alias: {
      util: 'util',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      assert: 'assert',
      events: 'events'
    }
  },
  define: {
    global: {},
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  optimizeDeps: {
    include: ['buffer', 'util', 'crypto-browserify', 'stream-browserify']
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'NeutralToken',
      fileName: () => 'neutraltoken.min.js',
      formats: ['umd']
    },
    outDir: 'dist',
    minify: true
  }
});