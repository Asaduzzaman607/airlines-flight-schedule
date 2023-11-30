import DetailsMainCardLayout from '../../commonComponents/detailsSecondLayerComponents/DetailsMainCardLayout'
import BasicInfoCard from '../../commonComponents/detailsSecondLayerComponents/BasicInfoCard'
import EmployeeProfileCard from '../../commonComponents/detailsSecondLayerComponents/EmployeeProfileCard'
import CommonCard from '../../commonComponents/detailsSecondLayerComponents/CommonCard'

const FlightDashboard = () => (
	<>
		{data?.map((item, index) => (
			<DetailsMainCardLayout title={item?.label} key={index}>
				<BasicInfoCard items={item?.basicInfo} titleKey='flightNo' />
				{item?.label === 'Coockpit Crew Info' || item?.label === 'Cabin Crew Info' ? (
					<EmployeeProfileCard data={item?.items} />
				) : (
					<CommonCard data={item?.items} />
				)}
			</DetailsMainCardLayout>
		))}
	</>
)
const data = [
	{
		id: 1,
		label: 'Flight Details',
		basicInfo: [
			{ label: 'Flight No.', value: 'BS 101', name: 'flightNo' },
			{ label: 'Flight Date', value: '03-Dec-23' },
			{ label: 'Flight Status', value: 'PENDING' },
			{ label: 'Flight Type', value: 'DOMESTIC' },
			{ label: 'Duration', value: '07:30' },
			{ label: 'Aircraft Name', value: 'Not Assigned' },
			{ label: 'Aircraft No.', value: 'ATR-G100' },
			{ label: 'Airport Leg', value: 'MCT - DAC' },
			{ label: 'Layover', value: 'No' },
		],
		items: [
			{
				id: 1,
				label: 'Standard Departure',
				items: [
					{ label: 'Date', value: '03-Jul-23' },
					{ label: 'Time', value: '10:02' },
				],
			},
			{
				id: 2,
				label: 'Standard Arrival',
				items: [
					{ label: 'Date', value: '03-Jul-23' },
					{ label: 'Time', value: '10:02' },
				],
			},
			{
				id: 3,
				label: 'Actual Departure',
				items: [
					{ label: 'Date', value: '03-Jul-23' },
					{ label: 'Time', value: '10:02' },
				],
			},
			{
				id: 2,
				label: 'Actual Arrival',
				items: [
					{ label: 'Date', value: '03-Jul-23' },
					{ label: 'Time', value: '10:02' },
				],
			},
		],
	},
	{
		id: 1,
		label: 'On Flight Info',
		items: [
			{
				id: 2,
				label: 'BLOCK TIME',
				items: [
					{ label: 'BLOCK OFF', value: '10:02' },
					{ label: 'BLOCK ON', value: '03:22' },
				],
			},
			{
				id: 3,
				label: 'Flight TIME',
				items: [
					{ label: 'BLOCK OFF', value: '10:02' },
					{ label: 'BLOCK ON', value: '03:22' },
				],
			},
			{
				id: 1,
				label: 'Status',
				items: [
					{ label: 'Departure (Early)', value: '11:02 h' },
					{ label: 'Arival (Delay)', value: '09:22 h' },
				],
			},
		],
	},
	{
		id: 2,
		label: 'Coockpit Crew Info',
		items: [
			{
				id: 1,
				imgSrc: '',
				role: 'Captain',
				name: 'Shahinur Rahman',
				type: 'Booing',
				commandType: 'PIC',
			},
			{
				id: 2,
				imgSrc: '',
				role: 'Captain',
				name: 'Shahinur Rahman',
				type: 'ATR',
				commandType: 'PIC',
			},
			{
				id: 3,
				imgSrc: '',
				role: 'Captain',
				name: 'Shahinur Rahman',
				type: 'Booing',
				commandType: 'PIC',
			},
		],
	},
	{
		id: 2,
		label: 'Cabin Crew Info',
		items: [
			{
				id: 1,
				imgSrc: '',
				role: 'Purser',
				name: 'Shahinur Rahman',
				type: 'Booing',
				commandType: 'Genaral Crew',
			},
			{
				id: 2,
				imgSrc: '',
				role: 'Captain',
				name: 'Shahinur Rahman',
				type: 'Booing',
				commandType: 'PIC',
			},
		],
	},
]

export default FlightDashboard
