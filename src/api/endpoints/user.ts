import { pipe } from 'fp-ts/lib/function'
import * as R from 'fp-ts/Reader'
import * as TE from 'fp-ts/TaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as t from 'io-ts'


import IUser, { User as UserV, IPortfolio, Portfolio as PortfolioV } from '../../entities/User'

import { Credentials, get } from '../client'
import { OrderBy, Orientation } from '../../types/params'
import { formatParamKeys } from '../../utils/url'
import IPhoto, { Photo as PhotoV } from '../../entities/Photo'

export const getUser = ( username: string ): RTE.ReaderTaskEither<Credentials, Error, IUser> => pipe(
	RTE.ask<Credentials>(),
	RTE.chainTaskEitherK(
		pipe(
			{ username },
			get<IUser, { username: string }>( '/users/:username' )
		)
	),
	R.chainFirst(
		TE.map(
			UserV.decode,
		)
	)
)


export const getPortfolio = ( username: string ): RTE.ReaderTaskEither<Credentials, Error, IPortfolio> => pipe(
	RTE.ask<Credentials>(),
	RTE.chainTaskEitherK(
		pipe(
			{ username },
			get<IPortfolio, { username: string }>( '/users/:username/portfolio' )
		)
	),
	R.chainFirst(
		TE.map(
			PortfolioV.decode,
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

export const getPhotos = ( username: string, options: Options = { perPage: 30, orderBy: 'latest' } ): RTE.ReaderTaskEither<Credentials, Error, IPhoto[]> => pipe(
	RTE.ask<Credentials>(),
	RTE.chainTaskEitherK(
		pipe(
			{ username, ...options},
			formatParamKeys,
			get<IPhoto[], Options & { username: string }>( '/users/:username/photos' )
		)
	),
	R.chainFirst(
		TE.map(
			t.array( PhotoV ).decode,
		)
	)
)
