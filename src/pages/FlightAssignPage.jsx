// import components
import { FlightAssign } from '../components/flightManagements/FlightAssign'
import CustomTitleCard from '../components/commonComponents/CustomTitleCard'

// import icons
import { FaAppStoreIos } from 'react-icons/fa6'

const FlightAssignPage = () => (
	<>
		<FlightAssign />
		{/* <div
			className={
				'mt-1 border border-solid border-blue-300 flex justify-center flex-col space-y-2 items-center p-3'
			}
		>
			<CustomTitleCard title={'Detail Employee'} isHeaderTitle={true} />
			<CustomTitleCard
				title={'Natashia Khaleira'}
				isCard={true}
				icon={<FaAppStoreIos />}
				subText={'Total Attendance'}
			/>
			<CustomTitleCard title={'March 7, 2023'} icon={<FaAppStoreIos />} size={'small'} />
			<CustomTitleCard
				title={'Natashia Khaleira'}
				subText={'Total Attendance'}
				isTitleReveresed={true}
			/>
		</div>
		<EmployeeProfileCard>
			<div className={'grid grid-cols-4 gap-6'}>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
			</div>
		</EmployeeProfileCard>

		<div className={'m-3 bg-white p-6 rounded-2xl shadow-md space-y-6'}>
			<CustomTitleCard title={'Flying Hours'} isHeaderTitle={true} />
			<div className={'grid grid-cols-3 gap-6'}>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
				<div className={'p-4 rounded-2xl bg-slate-200 shadow space-y-3'}>
					<CustomTitleCard
						title={'March 7, 2023'}
						icon={<FaAppStoreIos />}
						size={'small'}
					/>
					<div className={'flex justify-between '}>
						<CustomTitleCard title={'Natashia Khaleira'} subText={'Total Attendance'} />
						<CustomTitleCard title={'Natashia Khaleira'} subText={'Total Attendance'} />
					</div>
				</div>
				<CustomTitleCard
					title={'Natashia Khaleira'}
					isCard={true}
					icon={<FaAppStoreIos />}
					subText={'Total Attendance'}
				/>
			</div>
		</div> */}
	</>
)

const EmployeeProfileCard = ({ children }) => {
	return (
		<div className={'m-3 bg-white p-6 rounded-2xl shadow-md space-y-6'}>
			<header>
				<CustomTitleCard title={'Detail Employee'} isHeaderTitle={true} />
			</header>
			<div className={'flex items-center space-x-8 w-full'}>
				<div
					className={
						'p-4 h-24 w-24 bg-green-200 border-2 border-solid border-green-300 rounded-full animate-pulse'
					}
				></div>
				<div className={'space-y-4 w-full'}>
					<CustomTitleCard
						title={'Mohammad Tareq Hosain'}
						subText={'Captain - Boeing'}
						isTitleReveresed={true}
					/>
					<div className={'grid grid-cols-3 w-full'}>
						<CustomTitleCard title={'USBA 12345'} subText={'ID'} />
						<CustomTitleCard title={'(+880) 1749322249'} subText={'Phone Number'} />
						<CustomTitleCard title={'mtareqhosain@gmail.com'} subText={'Email'} />
					</div>
				</div>
			</div>
			{children}
		</div>
	)
}

export default FlightAssignPage
