import * as t from 'io-ts'
import * as G from './generic'
import { DateFromString, optional } from '../types/common-codecs'

const Exif = t.type( {
	make: t.string,
	model: t.string,
	exposure_time: t.string,
	aperture: t.string,
	focal_length: t.string,
	iso: t.number,
} )

type Exif = t.TypeOf<typeof Exif>

const Location = t.type( {
	city: t.string,
	country: t.string,
	position: t.type( {
		latitude: t.number,
		longitude: t.number,
	} ),
} )

type Location = t.TypeOf<typeof Location>

const CurrentUserCollection = t.type( {
	id: t.number,
	title: t.string,
	published_at: t.string,
	last_collected_at: t.string,
	updated_at: t.string,
	cover_photo: t.null,
	user: t.null,
} )

type CurrentUserCollection = t.TypeOf<typeof CurrentUserCollection>

const User = t.type( {
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

type User = t.TypeOf<typeof User>

const Photo = t.type( {
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

type Photo = t.TypeOf<typeof Photo>

const PhotoStats = t.type( {
	id: t.string,
	downloads: t.type( {
		total: t.number,
		historical: t.type( {
			resolution: t.string,
			quantity: t.number,
			values: t.array( t.type( {
				date: DateFromString,
				value: t.number,
			} ) ),
		} ),
	} ),
	views: t.type( {
		total: t.number,
		historical: t.type( {
			resolution: t.string,
			quantity: t.number,
			values: t.array( t.type( {
				date: DateFromString,
				value: t.number,
			} ) ),
		} ),
	} ),
	likes: t.type( {
		total: t.number,
		historical: t.type( {
			resolution: t.string,
			quantity: t.number,
			values: t.array( t.type( {
				date: DateFromString,
				value: t.number,
			} ) ),
		} ),
	} ),
} )

type PhotoStats = t.TypeOf<typeof PhotoStats>




const UpdatePhotoPayload = t.type( {
	description: optional( t.string ),
	show_on_priofile: optional( t.boolean ),
	location: optional( t.partial( {
		latitude: t.number,
		longitude: t.number,
		city: t.string,
		country: t.string,
	} ) ),
	exif: optional( t.partial( {
		make: t.string,
		model: t.string,
		exposure_time: t.string,
		aperture_value: t.string,
		focal_length: t.string,
		iso_speed_ratings: t.string,
	} ) ),
} )

type UpdatePhotoPayload = t.TypeOf<typeof UpdatePhotoPayload>

const IdObj = t.type( { id: t.string } )

type IdObj = t.TypeOf<typeof IdObj>


const GetPhotosParams = t.partial( {
	page: t.number,
	per_page: t.number,
	order_by: t.number,
} )

type GetPhotosParams = t.TypeOf<typeof GetPhotosParams>

export {
	Photo,
	User,
	Exif,
	PhotoStats,
	CurrentUserCollection,
	Location,
	UpdatePhotoPayload,
	GetPhotosParams,
	IdObj,
}
