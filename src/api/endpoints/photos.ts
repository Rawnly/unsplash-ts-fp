import { pipe } from 'fp-ts/lib/function'
import * as R from 'fp-ts/Reader'
import * as TE from 'fp-ts/TaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as t from 'io-ts'

import { Credentials, request } from '@api/client'
import Photo, { Photo as PhotoV } from '@src/entities/Photo'

import { ArrayFromString, PhotosCount } from '@src/types/common-codecs'

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
				request<Photo[], PhotosListParams>( '/photos' ),
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
				request<Photo, { id: string }>( '/photos/:id' ),
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
				request<Photo[], StringedPhotoParams>( '/photos/random' ),
			)
		),
		R.chainFirst(
			TE.map( t.array( PhotoV ).decode )
		)
	)
