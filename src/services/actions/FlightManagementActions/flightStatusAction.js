import axios from 'axios'

// import api config
import { FLIGHTSTATUS } from '../../../config'

// import actions and reducers
import {
	setIsLoading,
	setFlightStatusList,
	setSuccess,
	setIsEditable,
} from '../../reducers/FlightManagementReducers/flightStatusReducer'
import { getErrorMsg, showAlert } from '../commonActions'
import dayjs from 'dayjs'

// get FlightStatus list
const getFlightStatusList = (payload) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get FlightStatus
			const { data } = await axios.post(FLIGHTSTATUS.GET_FLIGHT_STATUS, payload)
			dispatch(setFlightStatusList(data))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false), setIsEditable(false))
		} catch (error) {
			console.error(error)

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

const saveFlightStatus = (params) => {
	return async (dispatch) => {
		const currentDate = dayjs().format('YYYY-MM-DD')
		// Set isLoading to true
		dispatch(setIsLoading(true), setIsEditable(true))
		try {
			// add FlightStatus api call
			const { data } = await axios.post(FLIGHTSTATUS.SAVE_FLIGHT_STATUS, params)
			dispatch(setSuccess(true))
			dispatch(getFlightStatusList({ fromDate: params?.date ?? currentDate, toDate: params?.date ?? currentDate }))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
			dispatch(setIsLoading(false))
		} catch (err) {
			console.error(err)
			dispatch(setSuccess(false))
			const errMsg = getErrorMsg(err)

			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// export actions
export { getFlightStatusList, saveFlightStatus }
