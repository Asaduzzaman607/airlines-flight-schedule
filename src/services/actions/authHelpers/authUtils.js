const _b64decode = (str) => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	let output = ''

	str = String(str).replace(/=+$/, '')

	if (str.length % 4 === 1) {
		throw new Error("'atob' failed: The string to be decoded is not correctly encoded.")
	}

	/* tslint:disable */
	for (
		// initialize result and counters
		let bc = 0, bs, buffer, idx = 0;
		// get next character
		(buffer = str.charAt(idx++));
		// character found in table? initialize bit storage and add its ascii value;
		~buffer &&
		((bs = bc % 4 ? bs * 64 + buffer : buffer),
		// and if not first of each 4 characters,
		// convert the first 8 bits to one ascii character
		bc++ % 4)
			? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
			: 0
	) {
		// try to find character in table (0-63, not found => -1)
		buffer = chars.indexOf(buffer)
	}
	/* tslint:enable */
	return output
}

const _b64DecodeUnicode = (str) => {
	return decodeURIComponent(
		Array.prototype.map
			.call(_b64decode(str), (c) => {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join('')
	)
}

const _urlBase64Decode = (str) => {
	let output = str.replace(/-/g, '+').replace(/_/g, '/')
	switch (output.length % 4) {
		case 0: {
			break
		}
		case 2: {
			output += '=='
			break
		}
		case 3: {
			output += '='
			break
		}
		default: {
			throw Error('Illegal base64url string!')
		}
	}
	return _b64DecodeUnicode(output)
}

const _decodeToken = (token) => {
	// Return if there is no token
	if (!token) {
		return null
	}

	// Split the token
	const parts = token.split('.')

	if (parts.length !== 3) {
		throw new Error(
			"The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more."
		)
	}

	// Decode the token using the Base64 decoder
	const decoded = _urlBase64Decode(parts[1])

	if (!decoded) {
		throw new Error('Cannot decode the token.')
	}

	return JSON.parse(decoded)
}

const _getTokenExpirationDate = (token) => {
	// Get the decoded token
	const decodedToken = _decodeToken(token)

	// Return if the decodedToken doesn't have an 'exp' field
	if (!decodedToken.hasOwnProperty('exp')) {
		return null
	}

	// Convert the expiration date
	const date = new Date(0)
	date.setUTCSeconds(decodedToken.exp)

	return date
}

const isTokenExpired = (token, offsetSeconds) => {
	// Return if there is no token
	if (!token || token === '') {
		return true
	}

	// Get the expiration date
	const date = _getTokenExpirationDate(token)

	offsetSeconds = offsetSeconds || 0

	if (date === null) {
		return true
	}
	//console.log(!(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000))

	// Check if the token is expired
	return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000)
}

const check = (token) => {
	// Check the access token availability
	if (!token) {
		return false
	}

	// Check the access token expire date
	if (isTokenExpired(token)) {
		return false
	}

	// If the access token exists and it didn't expire, sign in using it
	return true
}

const parseJwt = (token) => {
	var base64Url = token.split('.')[1]
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join('')
	)

	return JSON.parse(jsonPayload)
}

const tokenCheck = {
	check,
	parseJwt,
}

export default tokenCheck
