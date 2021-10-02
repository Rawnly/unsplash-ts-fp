import { Credentials } from './api/client'
import * as P from './api/endpoints/photos'

class Unsplash {
	constructor( private clientId: string ) {}

	get credentials(): Credentials {
		return {
			clientId: this.clientId,
		}
	}

	photos = {
		all: ( params?: P.PhotosListParams ) => P.getPhotos( params )( this.credentials ),
		random: ( params?: P.RandomPhotoParams ) => P.getRandom( params )( this.credentials ),
		get: ( id: string ) => P.getPhoto( id )( this.credentials ),
	}
}

export default Unsplash
