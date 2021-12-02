import * as R from 'fp-ts/Reader'
import { pipe } from 'fp-ts/function'

export const template = ( params: Record<string, any> ): R.Reader<string, string> =>  {
	return pipe(
		R.ask<string>(),
		R.map( template =>
			pipe(
				template,
				replace( /:(\w+)/g, ( _, k ) => params[k] ),
			),
		)
	)
}

type SearchValue = string | RegExp
type ReplaceValueFn = ( ( substring: string, ...params: any[] ) => string )


export function replace( searchValue: SearchValue, replaceValue: string ): ( str: string ) => string
export function replace( searchValue: SearchValue, replaceValue: ReplaceValueFn ): ( str: string ) => string

export function replace( searchValue: SearchValue, replaceValue: string | ReplaceValueFn ): ( str: string ) => string {
	return ( str: string ) => {
		if ( typeof replaceValue === 'string' ) {
			return str.replace( searchValue, replaceValue )
		}

		return str.replace( searchValue, replaceValue )
	}
}
