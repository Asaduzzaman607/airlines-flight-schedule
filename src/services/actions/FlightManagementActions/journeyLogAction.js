import axios from 'axios'

// import api config
import { JOURNEYLOG } from '../../../config'

// import actions and reducers
import {
	setIsLoading,
	setJourneyLogList,
	setSuccess,
	setIsEditable,
} from '../../reducers/JourneyLog/journeyLogReducer'
import { getErrorMsg, showAlert } from '../commonActions'
import dayjs from 'dayjs'

// get JourneyLog list
const getJourneyLogList = (payload) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))
		try {
			// get JourneyLog
			const { data } = await axios.post(JOURNEYLOG.GET_JOURNEY_LOG, payload)
			dispatch(setJourneyLogList(data))

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

const saveJourneyLog = (params) => {
	return async (dispatch) => {
		const currentDate = dayjs().format('YYYY-MM-DD')
		// Set isLoading to true
		dispatch(setIsLoading(true), setIsEditable(true))
		try {
			// add JourneyLog api call
			const { data } = await axios.post(JOURNEYLOG.SAVE_JOURNEY_LOG, params)
			dispatch(setSuccess(true))
			dispatch(getJourneyLogList({ fromDate: params?.date ?? currentDate, toDate: params?.date ?? currentDate }))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
			dispatch(setIsLoading(false))
		} catch (err) {
			dispatch(setSuccess(false))
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// download journey log
const downloadFile = (params) => {
	return async (dispatch) => {
		try {
			// set loading status true
			dispatch(params.loadingAction(true))

			let url = params.API;
			if (params?.fromDate && params?.toDate) {
				url += `?fromDate=${params.fromDate}&toDate=${params.toDate}`;
			}

			const response = await axios.post(url, params.TableData, {
				responseType: 'blob',
			})

			// set file type
			let blob = new Blob([response.data], {
				type: 'application/msword',
			})

			// set file download
			let link = document.createElement('a')
			link.href = blob
			link.href = window.URL.createObjectURL(blob)
			link.download = (params?.date ?? 'Flying-Time') + '.xlsx'
			link.click()
		} catch (err) {
			console.error(err)
			const errMsg = getErrorMsg(err)

			// show error msg
			showAlert('error', errMsg)
		} finally {
			// set loading status false
			dispatch(params.loadingAction(false))
		}
	}
}

// export actions
export { getJourneyLogList, saveJourneyLog, downloadFile }
