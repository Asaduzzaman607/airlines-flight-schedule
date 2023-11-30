import dayjs from 'dayjs'

//import icons
import { SlClock, SlCalender } from 'react-icons/sl'

// table's date & time view component
const DateTimeFilter = ({ value }) => {
	const timeFormat = 'HH:mm'
	const dateFormat = 'DD-MMM-YYYY'

	if (!value) {
		return null
	}

	return (
		<div className={'grid gap-1'}>
			{value && (value?.length === 10 || value?.length === 16) && (
				<div className={'flex justify-start items-center gap-1 ml-1'}>
					<SlCalender />
					{value && dayjs(value)?.format(dateFormat)}
				</div>
			)}
			{value && (value?.length === 5 || value?.length === 16) && (
				<div className={'flex justify-start items-center gap-1'}>
					<SlClock className={'w-5'} />
					{value && dayjs(value)?.format(timeFormat)}
				</div>
			)}
		</div>
	)
}

export default DateTimeFilter
