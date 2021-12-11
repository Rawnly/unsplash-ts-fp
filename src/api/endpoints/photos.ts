import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as t from 'io-ts'

import { Credentials, request } from '../client'
import { IdObj, Photo, GetPhotosParams, PhotoStats, UpdatePhotoPayload } from '../../entities/Photo'

import { ArrayFromString, PhotosCount } from '../../types/common-codecs'
import { decodeWith } from '../../utils/schema-util'


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


export const getPhotos = ( params: GetPhotosParams = {} ): RTE.ReaderTaskEither<Credentials, Error, Photo[]> =>
	pipe(
		RTE.ask<Credentials>(),
		RTE.chainTaskEitherK(
			pipe(
				params,
				request<Photo[], GetPhotosParams>(  'GET', '/photos' ),
			),
		),
		RTE.chainTaskEitherK(
			decodeWith(
				t.array( Photo )
			)
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
		RTE.ask<Credentials>(),
		RTE.chainTaskEitherK(
			pipe(
				{ id },
				request<Photo, { id: string }>( 'GET', '/photos/:id' ),
			)
		),
		RTE.chainTaskEitherK(
			decodeWith(
				Photo
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
		RTE.ask<Credentials>(),
		RTE.chainTaskEitherK(
			pipe(
				params,
				RandomPhotoParams.encode,
				request<Photo[], StringedPhotoParams>( 'GET', '/photos/random' ),
			)
		),
		RTE.chainTaskEitherK(
			decodeWith(
				t.array( Photo )
			)
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
export const getStatistics = ( params: StatisticsParams ): RTE.ReaderTaskEither<Credentials, Error, PhotoStats> =>
	pipe(
		RTE.ask<Credentials>(),
		RTE.chainTaskEitherK(
			pipe(
				params,
				StatisticsParams.encode,
				request<PhotoStats, StatisticsParams>( 'GET',  '/photos/:id/statistics' )
			),
		),
		RTE.chainTaskEitherK(
			decodeWith(
				PhotoStats,
			)
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
		RTE.ask<Credentials>(),
		RTE.chainTaskEitherK(
			pipe(
				{ id },
				IdObj.encode,
				request<{ url: string }, IdObj>( 'GET', '/photos/:id/download' ),
			)
		)
	)


export const like = ( id: string ): RTE.ReaderTaskEither<Credentials, Error, { photo: Photo }> =>
	pipe(
		RTE.ask<Credentials>(),
		RTE.chainTaskEitherK(
			pipe(
				{ id },
				IdObj.encode,
				request<{ photo: Photo }, IdObj>( 'POST', '/photos/:id/like' ),
			)
		)
	)

export const unlike = ( id: string ): RTE.ReaderTaskEither<Credentials, Error, { photo: Photo }> =>
	pipe(
		RTE.ask<Credentials>(),
		RTE.chainTaskEitherK(
			pipe(
				{ id },
				IdObj.encode,
				request<{ photo: Photo }, IdObj>( 'DELETE', '/photos/:id/like' ),
			)
		)
	)



export const update = ( id: string, payload: UpdatePhotoPayload ): RTE.ReaderTaskEither<Credentials, Error, Photo> =>
	pipe(
		RTE.ask<Credentials>(),
		RTE.chainTaskEitherK(
			pipe(
				{ id },
				IdObj.encode,
				request<Photo, IdObj, UpdatePhotoPayload>( 'PUT',  '/photos/:id/statistics', UpdatePhotoPayload.encode( payload ) )
			),
		),
		RTE.chainTaskEitherK(
			decodeWith(
				Photo,
			)
		)
	)
