import axios from 'axios'


import * as R from 'fp-ts/Reader'
import * as E from 'fp-ts/Either'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import * as U from '@utils/url'


import { pipe } from 'fp-ts/lib/function';


const api = axios.create( {
	baseURL: 'https://api.unsplash.com',
} )



export type Credentials = { clientId: string; clientSecret?: string }

type URL = string;
type Params = Record<string, any>

export const request = <T, U extends Params = any>( url: URL ): R.Reader<U, RTE.ReaderTaskEither<Credentials, Error, T>> => pipe(
	R.ask<U>(),
	R.map( ( params ) =>
		pipe(
			R.ask<Credentials>(),
			R.map( credentials =>
				pipe(
					url,
					U.template( params ?? {} ),
					TE.tryCatchK(
						u => api.get<T>( u, getConfiguration( credentials ) ),
						E.toError
					),
					TE.map( response => response.data )
				)
			)
		)
	)
)


export const getConfiguration = ( credentials: Credentials ): { headers: Record<string, string> } => ( {
	headers: {
		Authorization: `Client-ID ${credentials.clientId}`,
	},
} )
