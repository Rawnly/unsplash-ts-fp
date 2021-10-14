import * as t from 'io-ts'
import { optional, DateFromString } from '@src/types/common-codecs'
import { Links } from './generic'


export const User = t.type( {
	id: t.string,
	updated_at: DateFromString,
	username: t.string,
	name: t.string,
	first_name: t.string,
	last_name: t.string,
	instagram_username: optional( t.string ),
	twitter_username: optional( t.string ),
	portfolio_url: optional( t.string ),
	bio: optional( t.string ),
	location: optional( t.string ),
	total_likes: t.number,
	total_photos: t.number,
	total_collections: t.number,
	followed_by_user: t.boolean,
	followers_count: t.number,
	following_count: t.number,
	downloads: t.number,
	profile_image: t.type( {
		small: t.string,
		medium: t.string,
		large: t.string,
	} ),
	badge: optional( t.partial( {
		title: t.string,
		primary: t.boolean,
		slug: t.string,
		link: t.string,
	} ) ),
	links: t.intersection( [Links, t.type( {
		likes: t.string,
		photos: t.string,
		portfolio: t.string,
	} )] ),
} )

type TUser = t.TypeOf<typeof User>
export default TUser
