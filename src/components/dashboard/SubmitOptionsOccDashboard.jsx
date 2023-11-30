import { memo } from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import { DatePicker, Button, Space } from 'antd'

// import custom hooks
import { useOccDashboard } from '../customHooks'

const SubmitOptionsOccDashboard = () => {
	const { selectedDate, handleDateChange, handleSubmit } = useOccDashboard()
	const { isOccDataLoading } = useSelector((state) => state.dashboard)

	return (
		<div className={'flex justify-end items-center drop-shadow'}>
			<Space.Compact direction={'horizontal'}>
				<DatePicker
					onChange={handleDateChange}
					format={'DD-MMM-YY'}
					allowClear={false}
					value={dayjs(selectedDate)}
				/>
				<Button type={'primary'} onClick={handleSubmit} loading={isOccDataLoading}>
					{'Search'}
				</Button>
			</Space.Compact>
		</div>
	)
}

export default memo(SubmitOptionsOccDashboard)
