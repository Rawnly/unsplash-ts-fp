import { replace, template } from '../../src/utils/string'
import { pipe } from 'fp-ts/function'

describe( 'Template String', () => {
	describe( 'replace', () => {
		it( 'Should replace a value', () => {
			const result = pipe(
				'federico',
				replace( /(^f|d|r|c)/g, ( _, k ) => k.toUpperCase() )
			)

			expect( result )
				.toEqual( 'FeDeRiCo' )
		} )
	} )

	describe( 'template', () => {
		it( 'Should fill url template', () => {
			const result = pipe(
				'/photos/:id',
				template( { id: 1, orientation: 'landscape' } )
			)

			expect( result )
				.toEqual( '/photos/1' )
		} )
	} )
} )
