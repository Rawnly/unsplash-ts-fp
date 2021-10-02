import * as R from 'fp-ts/Reader'
import { pipe } from 'fp-ts/function'

type FunctionalReplace = ( searchValue: string | RegExp, replaceValue: ( ( substring: string, ...params: any[] ) => string ) ) => ( string: string ) => string

export const replace: FunctionalReplace = ( searchValue: string | RegExp, replaceValue: ( ( substring: string, ...params: any[] ) => string ) ) => ( string: string ) => string.replace( searchValue, replaceValue )

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
