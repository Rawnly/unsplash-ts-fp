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



export type Credentials = {
	clientId: string;
	clientSecret?: string
	bearerToken?: string
}

type URL = string;
type Params = Record<string, any>



export function request<R, Params extends Record<string, any> = Record<string, any>>( method: 'GET' | 'get', url: URL ): R.Reader<Params, RTE.ReaderTaskEither<Credentials, Error, R>>
export function request<R, Params extends Record<string, any> = Record<string, any>, Payload = any>( method: Exclude<Method, 'GET' | 'get'>,url: URL, payload?: Payload ): R.Reader<Params, RTE.ReaderTaskEither<Credentials, Error, R>>
export function request<R, Params extends Record<string, any> = Record<string, any>, Payload = any>( method: Method = 'GET',url: URL, payload?: Payload ): R.Reader<Params, RTE.ReaderTaskEither<Credentials, Error, R>> {
	return pipe(
		R.ask<Params>(),
		R.map( ( params ) =>
			pipe(
				RTE.ask<Credentials>(),
				RTE.chainTaskEitherK( credentials =>
					pipe(
						url,
						U.template( params ?? {} ),
						TE.tryCatchK(
							u => api.request<R>( getConfiguration( u, method, credentials, payload ) ),
							E.toError
						),
						TE.map( response => response.data )
					)
				),
			)
		)
	)
}


export const get = <T, U extends Params>( url: URL ) => request<T, U>(  'GET', url )
export const post = <T, U extends Params, P = any>( url: URL, payload?: P ) => request<T, U, P>(  'POST', url, payload )
export const del = <T, U extends Params>( url: URL ) => request<T, U>(  'DELETE', url )
export const put = <T, U extends Params, P = any>( url: URL ) =>
	pipe(
		R.ask<P>(),
		R.map( payload => request<T, U, P>(  'PUT', url, payload ) )
	)



export const getConfiguration = ( url: string, method: Method, credentials: Credentials, payload?: any ): AxiosRequestConfig => ( {
	url,
	data: payload,
	method,
	params: credentials.bearerToken && {
		client_id: credentials.clientId,
	},
	headers: credentials.bearerToken ? ( {
		Authorization: `Client-ID ${credentials.clientId}`,
	} ) : ( {
		Authorization: `Bearer ${credentials.bearerToken}`,
	} ),
} )
