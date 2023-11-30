import { useState } from 'react'
import axios from 'axios'

const useAxiosPost = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	const doPost = async (url, requestBody) => {
		setIsLoading(true)

		try {
			const response = await axios.post(url, requestBody)
			setError(null)
			return response.data
		} catch (error) {
			setError(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return { isLoading, error, doPost }
}

export default useAxiosPost
