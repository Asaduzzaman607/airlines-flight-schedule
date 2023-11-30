import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

// import components
import {
	DetailsMainCardLayout,
	BasicInfoCard,
	CommonCard,
} from '../../commonComponents/detailsSecondLayerComponents'
import dayjs from 'dayjs'

// import actions
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import config
import { DETAILS_DASHBOARD } from '../../../config'

export default function EmployeeDetailsSecondLayer() {
	const [detailsData, setDetailsData] = useState(null)

	// get employee id
	const { id } = useParams()

	// Get the current date
	const currentDate = dayjs()

	// Calculate the first date of the current year
	const firstDateOfYear = currentDate.startOf('year')

	// Calculate the last date of the current year
	const lastDateOfYear = currentDate.endOf('year')

	// Format the dates
	const fromDate = firstDateOfYear.format('YYYY-MM-DD')
	const toDate = lastDateOfYear.format('YYYY-MM-DD')

	// fake data for modal view
	const data = {
		user_info: {
			name: 'A.R Rahman',
			email: 'A@gmail.com',
			id: 'USB-99023',
			designation: 'CAPTAIN - BOEING',
			profile: '#',
			phone: '01913345345',
		},
		card_info: [{}],
		table_info: [
			{
				title: 'Role 1',
				columns: [
					{
						title: 'Name',
						dataIndex: 'name',
						key: 'name',
					},
					{
						title: 'Age',
						dataIndex: 'age',
						key: 'age',
					},
					{
						title: 'Address',
						dataIndex: 'address',
						key: 'address',
					},
				],
				dataSource: [
					{
						key: '1',
						name: 'Mike',
						age: 32,
						address: '10 Downing Street',
					},
					{
						key: '2',
						name: 'John',
						age: 42,
						address: '10 Downing Street',
					},
				],
			},
			{
				title: 'Role 2',
				columns: [
					{
						title: 'Name',
						dataIndex: 'name',
						key: 'name',
					},
					{
						title: 'Age',
						dataIndex: 'age',
						key: 'age',
					},
					{
						title: 'Address',
						dataIndex: 'address',
						key: 'address',
					},
				],
				dataSource: [
					{
						key: '1',
						name: 'Mike',
						age: 32,
						address: '10 Downing Street',
					},
					{
						key: '2',
						name: 'John',
						age: 42,
						address: '10 Downing Street',
					},
					{
						key: '3',
						name: 'John',
						age: 432,
						address: '10 Downing Street',
					},
					{
						key: '4',
						name: 'John',
						age: 424,
						address: '10 Downing Street',
					},
					{
						key: '5',
						name: 'John',
						age: 452,
						address: '10 Downing Street',
					},
					{
						key: '6',
						name: 'John',
						age: 462,
						address: '10 Downing Street',
					},
					{
						key: '7',
						name: 'John',
						age: 472,
						address: '10 Downing Street',
					},
					{
						key: '8',
						name: 'John',
						age: 482,
						address: '10 Downing Street',
					},
					{
						key: '9',
						name: 'John',
						age: 492,
						address: '10 Downing Street',
					},
					{
						key: '10',
						name: 'John',
						age: 4102,
						address: '10 Downing Street',
					},
					{
						key: '11',
						name: 'John',
						age: 4112,
						address: '10 Downing Street',
					},
					{
						key: '12',
						name: 'John',
						age: 412,
						address: '10 Downing Street',
					},
				],
			},
		],
	}

	// for second layer
	const data1 = [
		{
			label: 'Flying Time Details',
			id: 1,
			basicInfo: [
				{
					value: 'A A M M Shamsuzzahan',
				},
				{
					label: 'Aircraft',
					value: 'BOEING',
					id: 2,
				},
				{
					label: 'Designation',
					value: 'Captain',
				},
				{
					label: 'Phone Number',
					value: '01749622344',
				},
				{
					label: 'Email Address',
					value: 'mailto:shams.zahan@usbair.com',
				},
			],
			items: [
				{
					label: 'Total Flights',
					id: 1,
					items: [
						{
							value: 0,
						},
					],
				},
				{
					label: 'At USBA',
					id: 2,
					items: [
						{
							value: 667.03,
						},
					],
				},
				{
					label: 'Before USBA',
					id: 3,
					items: [
						{
							value: 30.5,
						},
					],
				},
				{
					label: 'Grand Total',
					id: 4,
					items: [
						{
							value: 697.53,
						},
					],
				},
			],
		},
		{
			label: 'At USBA',
			id: 1,
			items: [
				{
					label: 'ATR 72',
					id: 1,
					items: [
						{
							label: 'First Officer',
							value: 80.5,
							id: 1,
							isClickable: true,
						},
						{
							label: 'Captain',
							value: 20.33,
							id: 2,
							isClickable: true,
						},
					],
					isClickable: true,
				},
				{
					label: 'BOEING',
					id: 2,
					items: [
						{
							label: 'First Officer',
							value: 500.03,
							id: 2,
							isClickable: true,
						},
						{
							label: 'Captain',
							value: 45.67,
							id: 3,
							isClickable: true,
						},
					],
					isClickable: true,
				},
				{
					label: 'DASH_8',
					id: 3,
					items: [
						{
							label: 'Captain',
							value: 20.5,
							id: 3,
							isClickable: true,
						},
					],
					isClickable: true,
				},
			],
			isClickable: true,
		},
		{
			label: 'Before USBA',
			id: 2,
			items: [
				{
					label: 'ATR 72',
					id: 1,
					items: [
						{
							label: 'First Officer',
							value: 30.5,
							id: 1,
							isClickable: true,
						},
					],
					isClickable: true,
				},
			],
			isClickable: true,
		},
	]

	useEffect(() => {
		const _fetchDetailsData = async () => {
			try {
				const params = {
					empId: id,
					fromDate: fromDate,
					toDate: toDate,
				}
				const { data } = await axios.get(DETAILS_DASHBOARD.GET_FLYING_DASH_DETAILS, {
					params,
				})
				setDetailsData(data)
			} catch (err) {
				console.error(err)
				const errMsg = getErrorMsg(err)

				// show error msgf
				showAlert('error', errMsg)
			}
		}

		_fetchDetailsData()
	}, [])

	return (
		<div>
			{detailsData?.length > 0
				? detailsData.map((item, index) => (
						<DetailsMainCardLayout title={item?.label} key={index}>
							<BasicInfoCard items={item} titleKey='' />
							<CommonCard data={item?.items} />
						</DetailsMainCardLayout>
				  ))
				: 'No Data Found.'}
		</div>
	)
}
