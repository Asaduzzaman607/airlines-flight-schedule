// import components
import { Link } from 'react-router-dom'
import { DailyFlightList, DailyFlightSortAndDate, SelectedFlightsToAssign } from './index'
import { Breadcrumb } from 'antd'
import SearchList from '../../commonComponents/SearchList'

// import icons
import { HomeFilled } from '@ant-design/icons'

const FlightAssign = () => (
	<div className={'relative'}>
		<div className={'p-2 sticky top-[52px]'}>
			<div className={'px-4 py-2 bg-white rounded shadow grid grid-cols-1 md:grid-cols-2'}>
				<div className={'flex items-center'}>
					<Breadcrumb>
						<span className={'font-bold'}>
							<Link to={'/'}>
								<HomeFilled />
							</Link>
							<span className='mx-1'>/</span>
						</span>
						<Breadcrumb.Item className={'font-bold'}>
							{'Daily Aircraft Assign'}
						</Breadcrumb.Item>
					</Breadcrumb>
				</div>
				<div className={'place-self-end border border-solid border-red-50 w-full'}>
					<SearchList />
				</div>
			</div>
		</div>
		<div className={'p-2 space-y-1.5 relative'}>
			<div className={'grid grid-cols-1 md:grid-cols-2 gap-2 sticky top-[302px]'}>
				<DailyFlightContainer />
				<SelectedFlightsToAssign />
			</div>
		</div>
	</div>
)

const DailyFlightContainer = () => (
	<div className={'relative'}>
		<div className={'space-y-1.5'}>
			<DailyFlightSortAndDate />
			<DailyFlightList />
		</div>
	</div>
)

export default FlightAssign
