import * as t from 'io-ts'
import * as E from 'fp-ts/Either'

import { pipe } from 'fp-ts/lib/function'

export const StringFromArray = new t.Type<string, string[]>(
	'StringFromArray',
	( s ): s is string => typeof s === 'string',
	( s,c ) =>
		pipe(
			t.array( t.string )
				.validate( s,c ),
			E.chain( s2 => {
				const joinedString = s2.join( ',' )

				if ( joinedString.length > 1 ) {
					return t.success( joinedString )
				}

				return t.failure( s2, c )
			} )
		)
	,
	s => s.split( ',' )
)

export const ArrayFromString = new t.Type<string[], string>(
	'ArrayFromString',
	( s ): s is string[] => t.array( t.string )
		.is( s ),
	( s,c ) =>
		pipe(
			t.string
				.validate( s,c ),
			E.chain( s2 => {
				const splittedString = s2.split( ',' )

				if ( splittedString.length > 1 ) {
					return t.success( splittedString )
				}

				return t.failure( s2, c )
			} )
		)
	,
	s => s.join( ',' )
)

export const PhotosCount = new t.Type<number, number>(
	'PhotosCount',
	t.number.is,
	( s, c ) =>
		pipe(
			t.number.validate( s,c ),
			E.chain( n => n >= 1 && n <= 30
				? t.success( n )
				: t.failure( n,c )
			)
		)
	,
	t.number.encode
)


export const DateFromString = new t.Type<Date, string>(
	'DateFromString',
	( d ): d is Date => d instanceof Date,
	( d, c ) => pipe(
		t.string.validate( d, c ),
		E.chain( s => {
			const date = new Date( s )

			if ( date.toString() === 'Invalid Date' ) {
				return t.failure( s, c )
			}

			return t.success( date )
		} )
	),
	d => d.toLocaleString()
)

export const FloatFromString = new t.Type<number, string>(
	'FloatFromString',
	t.number.is,
	( i ,c ) => pipe(
		t.string.validate( i, c ),
		E.chain( s => {
			const  n =parseFloat( s )

			return isNaN( n ) ? t.failure( s, c ) : t.success( n )
		} )
	),
	n => n.toString()
)
