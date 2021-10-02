import {
	ArrayFromString,
	FloatFromString,
	DateFromString,
} from '../src/types/common-codecs'
import * as E from 'fp-ts/Either'


describe( 'ArrayFromString Codec', () => {
	it( 'Should deserialize a string into an array', () => {
		const result = ArrayFromString.decode( 'a,b' )


		expect( E.isRight( result ) )
			.toBeTruthy()

		expect( result )
			.toEqual( E.right( ['a', 'b'] ) )
	} )

	it( 'Should serialize an array into a string (joined by comma)', () => {
		const result = ArrayFromString.encode( ['a', 'b'] )

		expect( result )
			.toEqual( 'a,b' )
	} )
} )

describe( 'DateFromString Codec', () => {
	it( 'Should deserialize a string into a Date', () => {
		const result = DateFromString.decode( '1999-06-18 16:00' )

		expect( E.isRight( result ) )
			.toBeTruthy()

		expect( result )
			.toEqual( E.right( new Date( '1999-06-18 16:00' ) ) )
	} )

	it( 'Should serialize a Date into a LocaleString', () => {
		const date = new Date( '1999-06-18 16:00' )
		const result = DateFromString.encode( date )

		expect( result )
			.toEqual( date.toLocaleString() )
	} )
} )

describe( 'FloatFromString Codeec', () => {
	it( 'Should deserialzie a string into a Float', () => {
		const result = FloatFromString.decode( '1.2' )

		expect( E.isRight( result ) )
			.toBeTruthy()

		expect( result )
			.toEqual( E.right( 1.2 ) )
	} )

	it( 'Should serialize a Float into a string', () => {
		const result = FloatFromString.encode( 1.2 )

		expect( result )
			.toEqual( '1.2' )
	} )
} )
