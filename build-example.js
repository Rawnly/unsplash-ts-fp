const chalk = require( 'chalk' );
const { build } = require( 'esbuild' );
const { nodeExternalsPlugin } = require( 'esbuild-node-externals' );
const { Generator } = require( 'npm-dts' );


const getFlags = () => {
	const args = process.argv.slice( 1 )
		.filter( arg => arg.startsWith( '--' ) );

	return args.reduce( ( flags, arg ) => ( {
		...flags,
		[arg.replace( /^-+/g, '' ).trim()]: true
	} ), {} );
};

const isDev = process.env.NODE_ENV !== 'production';
const isWatching = getFlags().watch === true;
const isProductionBuild = !isWatching && !isDev;

const sharedConfiguration = {
	entryPoints: ['./example/example.ts'],
	bundle: true,
	sourcemap: true,
	color: true,
	minify: true,
	platform: 'node',
	target: 'node14',
	watch: isWatching,
	plugins: [nodeExternalsPlugin()],
};


async function main() {
	try {
		await build( {
			...sharedConfiguration,
			outfile: 'example/build/index.js',
		} );
	} catch ( error ) {
		console.error( error );
	}
}

main();
