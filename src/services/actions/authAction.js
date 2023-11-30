import axios from 'axios'

// import API config
import { AUTH } from '../../config'
import cookies from './authHelpers/cookies'

// import reducer actions
import {
	setIsLoading,
	setIsAuthenticated,
	setUser,
	setErrorMsg,
	setIsAuthValidating,
} from '../reducers/authReducer'
import { getErrorMsg } from './commonActions'

// user login
const userLogin = (params, isRemember) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			const paramData = {
				password: params.password.trim(),
				username: params.username.trim(),
			}
			const { data } = await axios.post(AUTH.SIGN_IN, paramData)

			// Set axios default token
			const { token } = data
			axios.defaults.headers.common.Authorization = `Bearer ${token}`

			// set token to cookies
			cookies.setCookie('token', token, isRemember ? 7 : 0)
			if (isRemember) {
				cookies.setCookie('isRemember', isRemember, 7)
			}

			dispatch(setUser(data))

			// Set isLoading to false
			dispatch(setIsLoading(false))

			// Set isAuthenticated to true
			dispatch(setIsAuthenticated(true))
		} catch (err) {
			console.error(err)

			// get error msg and dispatch
			const errMsg = getErrorMsg(err)
			dispatch(setErrorMsg(errMsg))

			// Set isAuthenticated to false
			dispatch(setIsAuthenticated(false))

			// Set isLoading to false
			dispatch(setIsLoading(false))
		}
	}
}

// validate token
const validateToken = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsAuthValidating(true))
		try {
			const { data } = await axios.post(AUTH.TOKEN_VERIFY, params)

			// Set axios default token from params=token
			const { token } = params
			axios.defaults.headers.common.Authorization = `Bearer ${token}`

			dispatch(setUser(data))

			setTimeout(() => {
				// Set isLoading to false
				dispatch(setIsAuthValidating(false))

				// Set isAuthenticated to true
				dispatch(setIsAuthenticated(true))
			}, 800)
		} catch (err) {
			console.error(err)

			// get error msg and dispatch
			const errMsg = getErrorMsg(err)
			dispatch(setErrorMsg(errMsg))

			// Set isAuthenticated to false
			dispatch(setIsAuthenticated(false))

			// Set isLoading to false
			dispatch(setIsAuthValidating(false))

			// clear local storage
			cookies.deleteAllCookies()
		}
	}
}

export { userLogin, validateToken }
