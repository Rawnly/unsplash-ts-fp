# Unsplash FP
> Functional Unasplash api client


## Playground
You can build the example via the `build:example` NPM script.
Then run via `node example/build`


## Example Snippet
> View more in the [examples](/example/example.ts) folder
```ts
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'

import Unsplash from '@rawnly/unsplash-fp-ts';

const unsplash = new Unsplash( '<access-token>' )

const getRandomIds = pipe(
	{ count: 5 },
	unsplash.photos.random,
	TE.map(A.map(photo => photo.id))
)

;(async () => {
	const result = await getRandomIds();

	if ( E.isRight(result) ) {
		const { right: ids } = result;

		console.log(ids) // => string[]
	} else {
		console.error('Error', result.left)
	}
})()
```
