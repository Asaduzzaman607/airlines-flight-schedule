import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { Select } from 'antd'

// import icons
import { SearchOutlined } from '@ant-design/icons'

// import actions
import { dailyFlights } from '../../services/reducers/aircraftAssignReducer'

const SearchList = () => {
	const [options, setOptions] = useState([])
	const { rawFlights } = useSelector((state) => state.aircraftAssign)

	const inputRef = useRef()

	const dispatch = useDispatch()

	useEffect(() => {
		// Add event listener when the component mounts
		window.addEventListener('keydown', handleKeyDown)

		// Remove event listener when the component unmounts
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	// handle search
	const _handleSearch = (value) => {
		const keys = rawFlights?.length && Object.keys(rawFlights[0])

		// check if keys are not empty
		if (keys?.length) {
			const filteredFlights = rawFlights.filter(
				(item) =>
					keys.filter(
						(key) =>
							item[key] &&
							item[key]
								.toString()
								.toLowerCase()
								.includes(value.toString().toLowerCase())
					).length > 0
			)

			setOptions(
				filteredFlights.map((item) => ({
					value: item?.id,
					label: (
						<div>
							<div>{`${item?.flightNo} (${item?.departureLegName} - ${item?.arrivalLegName})`}</div>
							<div className={'text-[12px] flex space-x-2'}>
								<div>{`${item?.departureTime} - ${item?.arrivalTime}`}</div>
							</div>
						</div>
					),
				}))
			)
		} else setOptions([])
	}

	const _handleOnSelect = (value) => {
		scrollToDiv(value)
		setOptions([])

		// set selected id
		dispatch(dailyFlights.setSearchedId(value))

		// clear search id after 2000ms or 2 sec
		setTimeout(() => {
			dispatch(dailyFlights.setSearchedId(null))
		}, 2000)
	}

	const scrollToDiv = (divId) => {
		const element = document.getElementById(divId)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			})
		}
	}

	const handleKeyDown = (event) => {
		// Check if both "Ctrl" key and "Space" key are pressed (event.ctrlKey and event.keyCode === 32)
		if (event.ctrlKey && event.keyCode === 32 && inputRef) {
			event.preventDefault() // Prevent any default browser behavior, if necessary
			inputRef.current.focus()
		}
	}

	return (
		<Select
			ref={inputRef}
			style={{ width: '100%' }}
			options={options}
			showSearch
			filterOption={(input, option) =>
				(option?.label?.props?.children[0]?.props?.children ?? '')
					.toLowerCase()
					.includes(input.toLowerCase())
			}
			onSearch={_handleSearch}
			onSelect={_handleOnSelect}
			placeholder={'Select flights'}
			allowClear
			autoFocus
			suffixIcon={<SearchOutlined />}
		/>
	)
}

export default SearchList
