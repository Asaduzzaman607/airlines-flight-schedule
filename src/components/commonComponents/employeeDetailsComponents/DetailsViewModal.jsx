import { useState } from 'react'

// import component
import { Modal } from 'antd'
import DetailsModalTableView from './DetailsModalTableView'
import DetailsViewModalUserInfo from './DetailsViewModalUserInfo'

export default function DetailsViewModal({ items, setModalOpen }) {
	const [isModalOpen, setIsModalOpen] = useState(true)

	// Modal handle ok
	const handleOk = () => {
		setIsModalOpen(false)
		setModalOpen(false)
	}

	// Modal handle cancel
	const handleCancel = () => {
		setIsModalOpen(false)
		setModalOpen(false)
	}

	return (
		<div>
			<Modal
				title={<div className=' text-blue-700'> {items?.user_info?.header} </div>}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				width='80%'
				style={{
					top: 10,
				}}
				footer={false}
			>
				<div className={''}>
					<DetailsViewModalUserInfo userInfo={items?.user_info} />
					<DetailsModalTableView tableInfo={items?.table_info} />
				</div>
			</Modal>
		</div>
	)
}
