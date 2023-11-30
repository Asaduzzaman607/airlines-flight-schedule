import { useState, useEffect } from 'react'
import axios from 'axios'
import { getErrorMsg, showAlert } from '../actions/commonActions'

const useFetch = (url, params) => {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	// fetch data
	useEffect(() => {
		// check if url not available
		if (!url) return

		;(async () => {
			// set loader to true
			setIsLoading(true)
			try {
				const { data } = await axios.get(url, { params })
				setData(data)
			} catch (err) {
				console.error(err)

				// get error msg and show error alert
				const errMsg = getErrorMsg(err)
				showAlert('error', errMsg)
			} finally {
				// set loader to false
				setIsLoading(false)
			}
		})()

		return () => {}
	}, [url])

	return { data, isLoading }
}

export default useFetch
