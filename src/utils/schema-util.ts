import { flow } from 'fp-ts/lib/function'
import * as t from 'io-ts'
import { failure } from 'io-ts/PathReporter'
import * as E from 'fp-ts/Either'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'

export const decodeWith = <A>( decoder: t.Decoder<unknown, A> ): RTE.ReaderTaskEither<unknown, Error, A> => flow(
	decoder.decode,
	E.mapLeft( errors => new Error( failure( errors )
		.join( '\n' ) ) ),
	TE.fromEither
)
