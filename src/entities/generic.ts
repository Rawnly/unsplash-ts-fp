import * as t from 'io-ts'

/** Tags */
const Tag = t.type( {
	title: t.string,
} )

type Tag = t.TypeOf<typeof Tag>

/**
 * Generic links interface
 */
const Links = t.type( {
	self: t.string,
	html: t.string,
} )

type Links = t.TypeOf<typeof Links>

export { Tag, Links }
