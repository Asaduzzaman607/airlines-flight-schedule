// import components
import { Space } from 'antd'

const DashboardTableFooter = () => (
	<div className={'flex justify-center items-center'}>
		<Space align={'center'} size={'large'}>
			{statusOptions?.length > 0 &&
				statusOptions?.map((item) => (
					<Space key={item?.id}>
						<Dot type={item?.type} />
						<div>{item?.label}</div>
					</Space>
				))}
		</Space>
	</div>
)

const Dot = ({ type }) => {
	const colors = {
		cancelled: 'bg-red-600 border border-solid border-slate-200',
		delayed: 'bg-yellow-400 border border-solid border-slate-200',
		pending: 'bg-white border border-solid border-slate-200',
		completed: 'bg-green-600 border border-solid border-slate-200',
	}
	return <div className={`h-4 w-4 rounded-full drop-shadow-md ${colors[type]}`} />
}

const statusOptions = [
	{
		id: 1,
		label: 'Completed',
		type: 'completed',
	},
	{
		id: 2,
		label: 'Delayed',
		type: 'delayed',
	},
	{
		id: 3,
		label: 'Pending',
		type: 'pending',
	},
	{
		id: 4,
		label: 'Cancelled',
		type: 'cancelled',
	},
]

export default DashboardTableFooter
