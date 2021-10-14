import { Credentials } from './api/client'
import * as TE from 'fp-ts/TaskEither'
import * as P from '@api/endpoints/photos'
import * as U from '@api/endpoints/user'

import Photo, { TPhotoStats } from './entities/Photo'
import User from './entities/User'



class Unsplash {
	constructor( private clientId: string ) {}

	get credentials(): Credentials {
		return {
			clientId: this.clientId,
		}
	}

	/**
	 * Photos Methods
	 */
	photos = {
		all: ( params?: P.PhotosListParams ): TE.TaskEither<Error, Photo[]> => P.getPhotos( params )( this.credentials ),
		random: ( params?: P.RandomPhotoParams ): TE.TaskEither<Error, Photo[]> => P.getRandom( params )( this.credentials ),
		get: ( id: string ): TE.TaskEither<Error, Photo> => P.getPhoto( id )( this.credentials ),
		stats: ( params: P.StatisticsParams ): TE.TaskEither<Error, TPhotoStats> => P.getStatistics( params )( this.credentials ),
		trackDownload: ( id: string ): TE.TaskEither<Error, { url: string }> => P.trackDownload( id )( this.credentials ),
		like: ( id: string ): TE.TaskEither<Error, { photo: Photo }> => P.like( id )( this.credentials ),
		unlike: ( id: string ): TE.TaskEither<Error, { photo: Photo }> => P.unlike( id )( this.credentials ),
		update: ( id: string, payload: P.UpdatePayload ): TE.TaskEither<Error, Photo> => P.update( id, payload )( this.credentials ),
	}

	/**
	 * User Methods
	 */
	user = {
		get: ( username: string ): TE.TaskEither<Error, User> => U.getUser( username )( this.credentials ),
	}

	/**
	 * Search Methods
	 */
	search = {
		photos: Promise.resolve,
		users: Promise.resolve,
		collections: Promise.resolve,
	}


	/**
	 * Collections Methods
	 */
	collections = {}

	/**
	 * Topics Methods
	 */
	topics = {}

	/**
	 * Stats Methods
	 */
	stats = {}
}

export default Unsplash
