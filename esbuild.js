const esbuild = require('esbuild');
const { exec } = require('child_process');
esbuild
  .build({
    entryPoints: ['src/command/code.ts'],
    bundle: true,
    logLevel: "info",
    // platform: 'node',
    // target: ['node16'],
    outfile: 'dist/code.js',
    minifyWhitespace: true,
    watch: process.argv.includes('--watch') ? {
        onRebuild(error, result) {
          if (error) console.error('watch build failed:', error)
          else { 
            // console.log('watch build succeeded:', result.stop)
            exec('sh ./run-plugin.sh');
            // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
          }
        },
      } : false,
  }).catch((e) => console.error(e.message));