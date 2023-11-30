import CustomTitleCard from '../CustomTitleCard'

const DetailsMainCardLayout = ({ title, children }) => (
	<div className={'m-3 bg-white p-6 rounded-2xl shadow-md space-y-6'}>
		<CustomTitleCard title={title} isHeaderTitle={true} />
		{children}
	</div>
)

export default DetailsMainCardLayout
