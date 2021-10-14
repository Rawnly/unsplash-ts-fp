import axios, { AxiosRequestConfig, Method } from 'axios'


import * as R from 'fp-ts/Reader'
import * as E from 'fp-ts/Either'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import * as U from '../utils/url'


import { pipe } from 'fp-ts/lib/function';


const api = axios.create( {
	baseURL: 'https://api.unsplash.com',
} )



export type Credentials = { clientId: string; clientSecret?: string }

type URL = string;
type Params = Record<string, any>



export const request = <T, U extends Params = any, P = any>( url: URL, method: Method = 'GET', payload?: P ): R.Reader<U, RTE.ReaderTaskEither<Credentials, Error, T>> => pipe(
	R.ask<U>(),
	R.map( ( params ) =>
		pipe(
			R.ask<Credentials>(),
			R.map( credentials =>
				pipe(
					url,
					U.template( params ?? {} ),
					TE.tryCatchK(
						u => api.request<T>( getConfiguration( u, method, credentials, payload ) ),
						E.toError
					),
					TE.map( response => response.data )
				)
			),
		)
	)
)


export const get = <T, U extends Params>( url: URL ) => request<T, U>( url, 'GET' )
export const post = <T, U extends Params, P = any>( url: URL, payload?: P ) => request<T, U, P>( url, 'POST', payload )
export const del = <T, U extends Params>( url: URL ) => request<T, U>( url, 'DELETE' )
export const put = <T, U extends Params, P = any>( url: URL ) =>
	pipe(
		R.ask<P>(),
		R.map( payload => request<T, U, P>( url, 'PUT', payload ) )
	)



export const getConfiguration = ( url: string, method: Method, credentials: Credentials, payload?: any ): AxiosRequestConfig => ( {
	url,
	data: payload,
	method,
	headers: {
		Authorization: `Client-ID ${credentials.clientId}`,
	},
} )
