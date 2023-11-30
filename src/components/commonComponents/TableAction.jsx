import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

// import components
import { Space, Button, Dropdown, Menu } from 'antd'
import RemarksModal from './RemarksModal'
import ApprovalModal from '../simTrainingManagements/SimPlanModule/ApprovalModal'

// import icons
import {
	EditOutlined,
	DeleteOutlined,
	ArrowUpOutlined,
	DeliveredProcedureOutlined,
	FileDoneOutlined,
	CloseSquareOutlined,
	EyeOutlined,
	MoreOutlined,
	RestOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons'

// import actions
import { ShowDeleteAlert } from '../../services/actions/commonActions'
import {
	addApproved,
	addReview,
	addReviewRequest,
	Rejected,
	getApprovalHistory,
	cancelFlightItem,
} from '../../services/actions/SimTrainingManagementActions/simPlanAction'

import { updateStatus } from '../../services/actions/SimTrainingManagementActions/caabAction'
import { resetUserPassword } from '../../services/actions/UserManagementActions/userAction'

// api config
import { API_MAP_CONFIG } from '../../config'

const TableAction = ({ rowInfo, deleteAction, pagination, getTableDataAction = null }) => {
	const [isOpenRemarksModal, setIsOpenRemarksModal] = useState(false)
	const [requestBody, setRequestBody] = useState({})

	// redux dispatch action
	const dispatch = useDispatch()

	const { routePermissions } = useSelector((state) => state.auth)
	const { stored_SearchBlock_Value } = useSelector((state) => state.employeeLeave)
	const { approvalHistoryModalOpen } = useSelector((state) => state.simPlan)

	const { actions, _module_id, _menu_id, _sub_menu, key } = routePermissions

	const { id, isPassResetRequested, approvalStatus, isActive } = rowInfo

	// map action list
	const checkAction = {
		Approve: addApproved,
		Submit: addReviewRequest,
		Review: addReview,
		Reject: Rejected,
	}

	// if the user has permisson for specific action
	const _hasPermission = (action) => {
		// check if action array doesn't exist
		if (!actions || actions?.length === 0) {
			return false
		}

		return actions.some((item) => item === action)
	}

	const reqBody = {
		ids: [id],
		menuId: _menu_id,
		moduleId: _module_id,
	}

	// handle onclick
	const handleOnclick = (title, action) => {
		const fullPath = key + `/${action}`
		const approvalMenuId = _sub_menu.find((item) => item.key === fullPath)?.menu_id ?? null

		setRequestBody({
			moduleId: _module_id,
			menuId: _menu_id,
			ids: [id],
			API: API_MAP_CONFIG[key] + action,
			approvalMenuId,
		})

		setIsOpenRemarksModal(title)
	}

	// construct menu list
	const menu = () => (
		<Menu>
			{
				<>
					{_hasPermission('/review-request') && (
						<Menu.Item key='submit'>
							<Button
								title='Submit'
								className={'bg-green-500 text-white'}
								icon={<ArrowUpOutlined className={'text-white'} />}
								onClick={() => handleOnclick('Submit', 'review-request')}
								type={'text'}
								style={{ width: '110px' }}
							>
								Submit
							</Button>
						</Menu.Item>
					)}
					{_hasPermission('/review') && (
						<Menu.Item key='review'>
							<Button
								title='Review'
								className={'bg-[#43cc99] text-white'}
								icon={<DeliveredProcedureOutlined className={'text-white'} />}
								onClick={() => handleOnclick('Review', 'review')}
								type={'text'}
								style={{ width: '110px' }}
							>
								Review
							</Button>
						</Menu.Item>
					)}
					{_hasPermission('/approved') && (
						<Menu.Item key='approve'>
							<Button
								style={{ width: '110px' }}
								title='Approve'
								className={'bg-[#17a2b8] text-white'}
								icon={<FileDoneOutlined className={'text-white'} />}
								onClick={() => handleOnclick('Approve', 'approved')}
								type={'text'}
							>
								Approve
							</Button>
						</Menu.Item>
					)}
					{_hasPermission('/rejected') && (
						<Menu.Item key='reject'>
							<Button
								title='Reject'
								className={'bg-[#b85717] text-white'}
								icon={<CloseSquareOutlined className={'text-white'} />}
								onClick={() => handleOnclick('Reject', 'rejected')}
								type={'text'}
								style={{ width: '110px' }}
							>
								Reject
							</Button>
						</Menu.Item>
					)}
					{_hasPermission('/cancel') && (
						<Menu.Item key='cancel'>
							<Button
								title='Cancel'
								className={'bg-[#b85717] text-white'}
								icon={<CloseSquareOutlined className={'text-white'} />}
								onClick={() =>
									ShowDeleteAlert(
										cancelFlightItem,
										id,
										dispatch,
										pagination,
										stored_SearchBlock_Value,
										'Are you sure cancel this item?'
									)
								}
								type={'text'}
								style={{ width: '110px' }}
							>
								Cancel
							</Button>
						</Menu.Item>
					)}
					{_hasPermission('/status') && (
						<Menu.Item key='status'>
							<Button
								style={{ width: '110px' }}
								title='Change Status'
								type={'text'}
								className={'bg-red-900 text-white pl-2'}
								icon={<CheckCircleOutlined />}
								onClick={() => dispatch(updateStatus({ id, isActive }))}
							>
								{isActive ? 'Active' : 'In-Active'}
							</Button>
						</Menu.Item>
					)}
				</>
			}
			{_hasPermission('/view') && (
				<Menu.Item key='view'>
					<Button
						title='View this record'
						type={'text'}
						className={'bg-[#555555] text-white w-[92px]'}
						icon={<EyeOutlined />}
						onClick={() => dispatch(getApprovalHistory(reqBody))}
						style={{ width: '110px' }}
					>
						View
					</Button>
				</Menu.Item>
			)}
			{_hasPermission('/delete') && (
				<Menu.Item key='delete'>
					<Button
						style={{ width: '110px' }}
						title='Delete this record'
						type={'text'}
						className={'bg-red-600 text-white'}
						icon={<DeleteOutlined />}
						onClick={() =>
							ShowDeleteAlert(
								deleteAction,
								id,
								dispatch,
								pagination,
								stored_SearchBlock_Value
							)
						}
					>
						Delete
					</Button>
				</Menu.Item>
			)}
			{_hasPermission('/reset') && isPassResetRequested && (
				<Menu.Item key='reset'>
					<Button
						style={{ width: '110px' }}
						title='Reset password'
						type={'text'}
						className={'bg-slate-500 text-white pl-2'}
						icon={<RestOutlined />}
						onClick={() =>
							dispatch(resetUserPassword(id, pagination, stored_SearchBlock_Value))
						}
					>
						Reset Pass
					</Button>
				</Menu.Item>
			)}
		</Menu>
	)

	return (
		<>
			<Space size={'small'}>
				{(_hasPermission('/update') && approvalStatus !== 'APPROVED') && (
					<Link to={'update/' + id}>
						<Button title='Edit this record' type={'primary'} icon={<EditOutlined />} />
					</Link>
				)}
				<Dropdown trigger={['click']} overlay={menu}>
					<Button icon={<MoreOutlined />} />
				</Dropdown>
			</Space>
			{isOpenRemarksModal && (
				<RemarksModal
					reqBody={requestBody}
					title={isOpenRemarksModal}
					setIsOpenRemarksModal={setIsOpenRemarksModal}
					action={checkAction[isOpenRemarksModal]}
					getTableDataAction={getTableDataAction}
				/>
			)}

			{approvalHistoryModalOpen && <ApprovalModal />}
		</>
	)
}

export default TableAction
