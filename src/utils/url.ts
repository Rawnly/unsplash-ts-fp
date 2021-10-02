export const addQuery = ( query: string ) => ( url: string ): string =>
	query
		? url + '?' + query
		: url
