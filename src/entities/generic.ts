import * as t from 'io-ts'

/** Tags */
export const Tag = t.type( {
	title: t.string,
} )

/**
 * Generic links interface
 */
export const Links = t.type( {
	self: t.string,
	html: t.string,
} )
