import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either'

import Unsplash from '../src';

const unsplash = new Unsplash( process.env.UNSPLASH_ACCES_TOKEN! )

const program = pipe(
	{ count: 1 },
	unsplash.photos.random,
)

;( async () => {
	const result = await program()

	if ( E.isRight( result ) ) {
		const { right: photos } = result

		console.log( `${photos.length} Photos` )

		for ( const photo of photos ) {
			console.log( `${photo.id} by @${photo.user.username}` );

		}
	} else {
		console.log( 'Error', result.left )
	}
} )()
