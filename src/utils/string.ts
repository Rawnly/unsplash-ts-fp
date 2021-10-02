import qs from 'querystring'

import * as A from 'fp-ts/lib/Array'
import * as RE from 'fp-ts/lib/Record'
import * as R from 'fp-ts/Reader'
import { pipe } from 'fp-ts/function'
import { addQuery } from './url'

type FunctionalReplace = ( searchValue: string | RegExp, replaceValue: ( ( substring: string, ...params: any[] ) => string ) ) => ( string: string ) => string

export const replace: FunctionalReplace = ( searchValue: string | RegExp, replaceValue: ( ( substring: string, ...params: any[] ) => string ) ) => ( string: string ) => string.replace( searchValue, replaceValue )

export const template = ( params: Record<string, any> ): R.Reader<string, string> =>  {
	const usedParams: Record<string, boolean> = {}

	return pipe(
		R.ask<string>(),
		R.map( template =>
			pipe(
				template,
				replace( /:(\w+)/g, ( _, k ) => {
					usedParams[k] = true

					return params[k]
				} ),
				pipe(
					params,
					RE.keys,
					A.filter( k => !usedParams[k] && params[k] !== undefined ),
					A.reduce( {}, ( query, key ) => ( { ...query, [key]: params[key] } ) ),
					qs.stringify,
					addQuery
				)
			)
		)
	)
}
