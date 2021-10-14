import { pipe } from 'fp-ts/lib/function'
import * as R from 'fp-ts/Reader'
import * as TE from 'fp-ts/TaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'


import User, { User as UserV } from '../../entities/User'

import { Credentials, get } from '@api/client'


export const getUser = ( username: string ): RTE.ReaderTaskEither<Credentials, Error, User> =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				{ username },
				get<User, { username: string }>( '/users/:username' )
			)
		),
		R.chainFirst(
			TE.map(
				UserV.decode,
			)
		)
	)
