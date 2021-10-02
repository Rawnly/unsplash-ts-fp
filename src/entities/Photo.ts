import { DateFromString } from '@src/types/common-codecs'
import * as t from 'io-ts'
import * as G from './generic'

export const Exif = t.type( {
	make: t.string,
	model: t.string,
	exposure_time: t.string,
	aperture: t.string,
	focal_length: t.string,
	iso: t.number,
} )

export const Location = t.type( {
	city: t.string,
	country: t.string,
	position: t.type( {
		latitude: t.number,
		longitude: t.number,
	} ),
} )

export const CurrentUserCollection = t.type( {
	id: t.number,
	title: t.string,
	published_at: t.string,
	last_collected_at: t.string,
	updated_at: t.string,
	cover_photo: t.null,
	user: t.null,
} )

export const User = t.type( {
	id: t.string,
	username: t.string,
	name: t.string,
	portfolio_url: t.union( [t.string, t.null] ),
	bio: t.string,
	location: t.string,
	total_likes: t.number,
	total_photos: t.number,
	total_collections: t.number,
	instagram_username: t.union( [t.string, t.null] ),
	twitter_username: t.union( [t.string, t.null] ),
	profile_image: t.type( {
		small: t.string,
		medium: t.string,
		large: t.string,
	} ),
	links: t.intersection( [G.Links, t.type( {
		photos: t.string,
		likes: t.string,
		portfolio: t.string,
	} )] ),
} )

export const Photo = t.type( {
	id: t.string,
	created_at: DateFromString,
	updated_at: DateFromString,
	width: t.number,
	height: t.number,
	color: t.string,
	blur_hash: t.string,
	downloads: t.number,
	likes: t.number,
	liked_by_user: t.boolean,
	description: t.union( [t.string, t.null] ),
	exif: Exif,
	location: Location,
	tags: t.array( G.Tag ),
	current_user_collections: t.array( CurrentUserCollection ),
	urls: t.type( {
		raw: t.string,
		full: t.string,
		regular: t.string,
		small: t.string,
		thumb: t.string,
	} ),
	links: t.intersection( [G.Links, t.type( {
		download: t.string,
		download_location: t.string,
	} )] ),
	user: User,
} )


type TPhoto = t.TypeOf<typeof Photo>
export default TPhoto;
