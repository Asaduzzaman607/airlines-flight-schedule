import axios from 'axios'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { DETAILS_DASHBOARD } from '../../../config'

// import components
import CustomTitleCard from '../CustomTitleCard'
import DetailsViewModal from '../employeeDetailsComponents/DetailsViewModal.jsx'

const CommonCard = ({ data }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [modalData, setModalData] = useState({})

	let gridSizeRange = data?.length < 4 && data?.length > 1 ? data?.length : undefined
	// fake data for modal view
	// const modalData = {
	//     user_info: {
	//       name: 'A.R Rahman',
	//       email: 'A@gmail.com',
	//       id: 'USB-99023',
	//       designation: 'CAPTAIN - BOEING',
	//       profile: '#',
	//       phone: '01913345345'
	//     },
	//     card_info: [{}],
	//     table_info: [
	//       {
	//         title: 'Role 1',
	//         columns: [
	//           {
	//             title: 'Name',
	//             dataIndex: 'name',
	//             key: 'name',
	//           },
	//           {
	//             title: 'Age',
	//             dataIndex: 'age',
	//             key: 'age',
	//           },
	//           {
	//             title: 'Address',
	//             dataIndex: 'address',
	//             key: 'address',
	//           },
	//         ],
	//         dataSource: [
	//           {
	//             key: '1',
	//             name: 'Mike',
	//             age: 32,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '2',
	//             name: 'John',
	//             age: 42,
	//             address: '10 Downing Street',
	//           },
	//         ]
	//       },
	//       {
	//         title: 'Role 2',
	//         columns: [
	//           {
	//             title: 'Name',
	//             dataIndex: 'name',
	//             key: 'name',
	//           },
	//           {
	//             title: 'Age',
	//             dataIndex: 'age',
	//             key: 'age',
	//           },
	//           {
	//             title: 'Address',
	//             dataIndex: 'address',
	//             key: 'address',
	//           },
	//         ],
	//         dataSource: [
	//           {
	//             key: '1',
	//             name: 'Mike',
	//             age: 32,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '2',
	//             name: 'John',
	//             age: 42,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '3',
	//             name: 'John',
	//             age: 432,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '4',
	//             name: 'John',
	//             age: 424,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '5',
	//             name: 'John',
	//             age: 452,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '6',
	//             name: 'John',
	//             age: 462,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '7',
	//             name: 'John',
	//             age: 472,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '8',
	//             name: 'John',
	//             age: 482,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '9',
	//             name: 'John',
	//             age: 492,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '10',
	//             name: 'John',
	//             age: 4102,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '11',
	//             name: 'John',
	//             age: 4112,
	//             address: '10 Downing Street',
	//           },
	//           {
	//             key: '12',
	//             name: 'John',
	//             age: 412,
	//             address: '10 Downing Street',
	//           },
	//         ]
	//       },
	//     ]
	// }
	// const modalData = {
	// 	user_info: {
	// 		name: 'Mohammad Eliash Malik',
	// 		designation: 'Captain',
	// 		email: 'mailto:meliashmalik@gmail.com',
	// 		id: 'USBA-21247',
	// 		profile: null,
	// 		phone: '01713338083',
	// 	},
	// 	card_info: [],
	// 	table_info: [
	// 		{
	// 			title: 'ATR 72',
	// 			columns: [
	// 				{
	// 					title: 'Captain',
	// 					dataIndex: 'captain',
	// 					key: 'captain',
	// 				},
	// 				{
	// 					title: 'First Officer',
	// 					dataIndex: 'first_Officer',
	// 					key: 'first_Officer',
	// 				},
	// 				{
	// 					title: 'Instructor',
	// 					dataIndex: 'instructor',
	// 					key: 'instructor',
	// 				},
	// 				{
	// 					title: 'Route Training',
	// 					dataIndex: 'route_Training',
	// 					key: 'route_Training',
	// 				},
	// 				{
	// 					title: 'Route Check',
	// 					dataIndex: 'route_Check',
	// 					key: 'route_Check',
	// 				},
	// 				{
	// 					title: 'Irc',
	// 					dataIndex: 'irc',
	// 					key: 'irc',
	// 				},
	// 				{
	// 					title: 'Eve',
	// 					dataIndex: 'eve',
	// 					key: 'eve',
	// 				},
	// 				{
	// 					title: 'Safety',
	// 					dataIndex: 'safety',
	// 					key: 'safety',
	// 				},
	// 				{
	// 					title: 'Command Type',
	// 					dataIndex: 'command_Type',
	// 					key: 'command_Type',
	// 				},
	// 				{
	// 					title: 'Present Airlines',
	// 					dataIndex: 'present_Airlines',
	// 					key: 'present_Airlines',
	// 				},
	// 			],
	// 			dataSource: [
	// 				{
	// 					key: '1',
	// 					captain: '210.67',
	// 					first_Officer: 'N/A',
	// 					instructor: 'N/A',
	// 					route_Training: 'N/A',
	// 					route_Check: 'N/A',
	// 					irc: 'N/A',
	// 					eve: 'N/A',
	// 					safety: 'N/A',
	// 					command_Type: 'PIC',
	// 					present_Airlines: 'FALSE',
	// 				},
	// 				{
	// 					key: '2',
	// 					captain: '80.3',
	// 					first_Officer: 'N/A',
	// 					instructor: 'N/A',
	// 					route_Training: 'N/A',
	// 					route_Check: 'N/A',
	// 					irc: 'N/A',
	// 					eve: 'N/A',
	// 					safety: 'N/A',
	// 					command_Type: 'PIC',
	// 					present_Airlines: 'TRUE',
	// 				},
	// 				{
	// 					key: '3',
	// 					captain: 'N/A',
	// 					first_Officer: '90.42',
	// 					instructor: 'N/A',
	// 					route_Training: 'N/A',
	// 					route_Check: 'N/A',
	// 					irc: 'N/A',
	// 					eve: 'N/A',
	// 					safety: 'N/A',
	// 					command_Type: 'SIC',
	// 					present_Airlines: 'TRUE',
	// 				},
	// 			],
	// 		},
	// 	],
	// }

	const _fetchDetailsModalData = async (item) => {
		console.log(item, data)
		setModalOpen(item?.isClickable)
		try {
			const params = {
				empId: item?.empId,
				aircraftTypeId: item?.aircraftTypeId,
				atUSBA: item?.atUSBA,
			}
			const { data } = await axios.get(DETAILS_DASHBOARD.GET_FLYING_DASH_MODAL_DETAILS, {
				params,
			})
			setModalData(data ?? {})
			console.log({ data })
		} catch (err) {
			console.error(err)

			// show error msg
			// const errMsg = getErrorMsg(err)
			// showAlert('error', errMsg)
		}
	}

	return (
		<>
			<div className={`grid grid-cols-${gridSizeRange ?? 4} w-full gap-4`}>
				{data?.length ? (
					data?.map((item) => (
						<div
							className={`p-4 transition duration-300 ease-in-out bg-[#f1f4ff] hover:bg-[#e1e4ff] ${
								item?.isClickable && 'cursor-pointer'
							} shadow-slate-100 drop-shadow-lg flex ${
								item?.label
									? 'flex-col space-y-2'
									: 'flex-row space-x-4 items-center'
							} `}
							onClick={() => _fetchDetailsModalData(item)}
						>
							{item?.label && <CustomTitleCard title={item?.label} />}
							<div
								className={`grid grid-cols-${
									item?.items?.length ?? 3
								} w-full space-y-2`}
							>
								{item?.items?.length &&
									item?.items?.map((card) => (
										<CustomTitleCard
											subText={card?.label}
											title={card?.value}
											isClickable={card?.isClickable}
										/>
									))}
							</div>
						</div>
					))
				) : (
					<div>No Data Available</div>
				)}
			</div>
			{modalOpen && <DetailsViewModal items={modalData} setModalOpen={setModalOpen} />}
		</>
	)
}

// Specifies the default values for props:
CommonCard.defaultProps = {
	data: [],
}

// props types
CommonCard.propTypes = {
	data: PropTypes.array,
}

export default CommonCard
