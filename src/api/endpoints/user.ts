import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as t from 'io-ts'


import { Portfolio, User } from '../../entities/User'
import { Photo } from '../../entities/Photo'

import { Credentials, get } from '../client'
import { OrderBy, Orientation } from '../../types/params'
import { formatParamKeys } from '../../utils/url'
import { decodeWith } from '../../utils/schema-util'

export const getUser = ( username: string ): RTE.ReaderTaskEither<Credentials, Error, User> => pipe(
	RTE.ask<Credentials>(),
	RTE.chainTaskEitherK(
		pipe(
			{ username },
			get<User, { username: string }>( '/users/:username' )
		)
	),
	RTE.chainTaskEitherK(
		decodeWith(
			User
		)
	)
)


export const getPortfolio = ( username: string ): RTE.ReaderTaskEither<Credentials, Error, Portfolio> => pipe(
	RTE.ask<Credentials>(),
	RTE.chainTaskEitherK(
		pipe(
			{ username },
			get<Portfolio, { username: string }>( '/users/:username/portfolio' )
		)
	),
	RTE.chainTaskEitherK(
		decodeWith(
			Portfolio
		)
	)
)


type Options = {
	page?: number
	perPage?: number
	orderBy?: OrderBy
	stats?: boolean
	resolution?: 'days'
	quantity?: number
	orientation?: Orientation
}

export const getPhotos = ( username: string, options: Options = { perPage: 30, orderBy: 'latest' } ): RTE.ReaderTaskEither<Credentials, Error, Photo[]> => pipe(
	RTE.ask<Credentials>(),
	RTE.chainTaskEitherK(
		pipe(
			{ username, ...options},
			formatParamKeys,
			get<Photo[], Options & { username: string }>( '/users/:username/photos' )
		)
	),
	RTE.chainTaskEitherK(
		decodeWith(
			t.array( Photo )
		)
	)
)
