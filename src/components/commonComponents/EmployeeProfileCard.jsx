// import components
import CustomTitleCard from './CustomTitleCard'

const EmployeeProfileCard = ({ employee, children }) => {
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
						title={employee?.name}
						subText={`${employee?.designation} - ${employee?.rated}`}
						isTitleReveresed={true}
					/>
					<div className={'grid grid-cols-3 w-full'}>
						<CustomTitleCard title={employee?.id} subText={'ID'} />
						<CustomTitleCard title={employee?.phone} subText={'Phone Number'} />
						<CustomTitleCard title={employee?.email} subText={'Email'} />
					</div>
				</div>
			</div>
			{children}
		</div>
	)
}

export default EmployeeProfileCard
