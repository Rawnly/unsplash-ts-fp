import { pipe } from 'fp-ts/function'

import qs from 'querystring'

import * as R from 'fp-ts/Reader'
import * as A from 'fp-ts/lib/Array'
import * as RE from 'fp-ts/lib/Record'
import { replace } from './string'

export const addQuery = ( query: string ) => ( url: string ): string =>
	query
		? url + '?' + query
		: url


export const template = ( params: Record<string, any> ): R.Reader<string, string> =>  {
	const usedParams: Record<string, boolean> = {}

	return pipe(
		R.ask<string>(),
		R.map( template =>
			pipe(
				pipe(
					template,
					replace( /:(\w+)/g, ( _, k ) => {
						usedParams[k] = true

						return params[k]
					} ),
				),
				pipe(
					params,
					RE.keys,
					A.filter( k => params[k] !== undefined && !usedParams[k] ),
					A.reduce( {}, ( query, key ) => ( { ...query, [key]: params[key] } ) ),
					qs.stringify,
					addQuery
				)
			)
		)
	)
}
