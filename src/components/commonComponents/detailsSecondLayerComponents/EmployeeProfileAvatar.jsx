import { Image } from 'antd'
import defaultImage from '../../../assets/images/default_pilot.jpg'

const EmployeeProfileAvatar = ({ url, size }) => (
	<div
		className={
			'bg-white min-h-[100px] min-w-[100px] border border-solid border-gray-500 rounded-full overflow-hidden'
		}
	>
		<Image
			width={100}
			height={100}
			className={'rounded-full'}
			src={url === 'N/A' || !url ? defaultImage : url}
		/>
	</div>
)

export default EmployeeProfileAvatar
