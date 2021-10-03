import { pipe } from 'fp-ts/lib/function'
import * as R from 'fp-ts/Reader'
import * as TE from 'fp-ts/TaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as t from 'io-ts'

import { Credentials, del, get, post, put, request } from '@api/client'
import Photo, { Photo as PhotoV, TPhotoStats } from '@src/entities/Photo'

import { ArrayFromString, PhotosCount } from '@src/types/common-codecs'

const optional = <T extends t.Mixed>( type: T ) => t.union( [type, t.undefined, t.null] )

const RandomPhotoParams = t.partial( {
	collections: ArrayFromString,
	topics: ArrayFromString,
	username: t.string,
	orientation: t.union( [t.literal( 'landscape' ), t.literal( 'portrait' ), t.literal( 'squarish' )] ),
	content_filter: t.union( [t.literal( 'low' ), t.literal( 'high' )] ),
	count: PhotosCount,
} )

export type RandomPhotoParams = t.TypeOf<typeof RandomPhotoParams>

type StringedPhotoParams = Omit<RandomPhotoParams, 'collections' | 'topics'> & {
	collections?: string
	topics?: string
}


const PhotosListParams = t.partial( {
	page: t.number,
	per_page: t.number,
	order_by: t.number,
} )

export type PhotosListParams = t.TypeOf<typeof PhotosListParams>

export const getPhotos = ( params: PhotosListParams = { } ): RTE.ReaderTaskEither<Credentials, Error, Photo[]> =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				params,
				get<Photo[], PhotosListParams>( '/photos' ),
			),
		),
		R.chainFirst(
			TE.map( t.array( PhotoV ).decode )
		)
	)

/**
 * Get photo by ID
 *
 * @param {Credentials} credentials
 * @returns {P.TPhoto}
 */


export const getPhoto = ( id: string ): RTE.ReaderTaskEither<Credentials, Error, Photo> =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				{ id },
				get<Photo, { id: string }>( '/photos/:id' ),
			)
		),
		R.chainFirst( te =>
			pipe(
				te,
				TE.map( data => PhotoV.decode( data ) )
			)
		)
	)

/**
 * Get a random photo
 * @param {Credentials} credentials
 * @returns {P.TPhoto[]}
 */

export const getRandom = ( params: RandomPhotoParams = { count: 1 } ): RTE.ReaderTaskEither<Credentials, Error, Photo[]> =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				params,
				RandomPhotoParams.encode,
				get<Photo[], StringedPhotoParams>( '/photos/random' ),
			)
		),
		R.chainFirst(
			TE.map( t.array( PhotoV ).decode )
		)
	)


const StatisticsParams = t.type( {
	id: t.string,
	resolution: t.union( [t.literal( 'days' ), t.null, t.undefined] ),
	quantity: t.union( [t.number, t.undefined, t.null] ),
} )

export type StatisticsParams = t.TypeOf<typeof StatisticsParams>

/**
 * @description Returns photo's statistics
 * @param {StatisticsParams} params
 */
export const getStatistics = ( params: StatisticsParams ): RTE.ReaderTaskEither<Credentials, Error, TPhotoStats> =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				params,
				StatisticsParams.encode,
				get<TPhotoStats, StatisticsParams>( '/photos/:id/statistics' )
			),
		),
		R.chainFirst(
			TE.map( t.array( PhotoV ).decode )
		)
	)


/**
 * @description
 *  To abide by the API guidelines, you need to trigger a GET request
 * 	to this endpoint every time your application performs a download of a photo.
 * 	To understand what constitutes a download, please refer to the ‘Triggering a download’ guideline.
 *
 *  This is purely an event endpoint used to increment the number of downloads a photo has.
 *  You can think of it very similarly to the pageview event in Google Analytics—where you’re incrementing
 *  a counter on the backend. This endpoint is not to be used to embed the photo
 *  (use the photo.urls.* properties instead) or to direct the user
 * 	to the downloaded photo (use the photo.urls.full instead), it is for tracking purposes only.
 * @param {String} id
 */
export const trackDownload = ( id: string ): RTE.ReaderTaskEither<Credentials, Error, { url: string }> =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				{ id },
				get<{ url: string }, { id: string }>( '/photos/:id/download' ),
			)
		)
	)


export const like = ( id: string ) =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				{ id },
				post<{ photo: Photo }, { id: string }>( '/photos/:id/like' ),
			)
		)
	)

export const unlike = ( id: string ) =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				{ id },
				del<{ photo: Photo }, { id: string }>( '/photos/:id/like' ),
			)
		)
	)



const UpdatePayload = t.type( {
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

export type UpdatePayload = t.TypeOf<typeof UpdatePayload>


export const update = ( id: string, payload: UpdatePayload ): RTE.ReaderTaskEither<Credentials, Error, Photo> =>
	pipe(
		R.ask<Credentials>(),
		R.map(
			pipe(
				{ id },
				pipe(
					payload,
					UpdatePayload.encode,
					put<Photo, { id: string }, UpdatePayload>( '/photos/:id' ),
				)
			)
		),
		R.chainFirst( te =>
			pipe(
				te,
				TE.map( data => data )
			)
		)
	)
