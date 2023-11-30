import React, { useState, useEffect } from 'react'

// import components
import { Result, Button } from 'antd'

const ErrorBoundary = ({ children }) => {
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		const errorHandler = (error, errorInfo) => {
			setHasError(true)
			console.error(error)
		}

		// Cleanup function to reset the error boundary state
		const resetErrorBoundary = () => {
			setHasError(false)
		}

		window.addEventListener('error', errorHandler)
		window.addEventListener('unhandledrejection', errorHandler)

		return () => {
			window.removeEventListener('error', errorHandler)
			window.removeEventListener('unhandledrejection', errorHandler)
			resetErrorBoundary()
		}
	}, [])

	if (hasError) {
		return (
			<div className={'flex justify-center items-center h-screen'}>
				<Result
					status={'500'}
					title={'500'}
					subTitle={'Sorry, something went wrong.'}
					extra={
						<a href={'/'}>
							<Button type={'primary'}>Back Home</Button>
						</a>
					}
				/>
			</div>
		)
	}

	return children
}

export default ErrorBoundary
