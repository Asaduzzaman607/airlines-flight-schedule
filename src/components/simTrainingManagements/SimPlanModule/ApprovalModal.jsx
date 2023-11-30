import {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'

// import component
import { Modal } from 'antd'

// import reducer
import { setApprovalHistoryModalOpen } from '../../../services/reducers/SimTrainingManagementReducers/simPlanReducer'

export default function ApprovalModal () {
    
    const { simPlanHistory, approvalHistoryModalOpen } = useSelector(state => state.simPlan)
    
    const [isModalOpen, setIsModalOpen] = useState(approvalHistoryModalOpen)

    const dispatch = useDispatch()

    // modal handle ok
    const handleOk = () => {
        setIsModalOpen(false)
        dispatch(setApprovalHistoryModalOpen(false))
    }

    // modal handle cancel
    const handleCancel = () => {
        setIsModalOpen(false)
        dispatch(setApprovalHistoryModalOpen(false))
    }

    return (
        <div>
            <Modal 
                title="Approval History" 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                width="70%"
            >
                <div className={'max-h-[450px] overflow-y-auto border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 p-4'}>
                    <table className={'w-full'}>
                        <thead>
                        <tr className={'border-b-2 bg-green-400'}>
                            <th className={'py-2 px-4 text-left font-bold'}>Date & Time</th>
                            <th className={'py-2 px-4 text-left font-bold'}>Action By</th>
                            <th className={'py-2 px-4 text-left font-bold'}>Action Type</th>
                            <th className={'py-2 px-4 text-left font-bold'}>Status</th>
                            <th className={'py-2 px-4 text-left font-bold'}>Remarks</th>
                        </tr>
                        </thead>
                        <tbody>
                            {simPlanHistory?.map((item) => (
                                <tr key={item.id} className={`odd:bg-white even:bg-slate-100 hover:bg-gray-300`}>
                                    <td className={'py-2 px-4'}>{item?.createdAt}</td>
                                    <td className={'py-2 px-4'}>{item?.actionBy}</td>
                                    <td className={'py-2 px-4'}>{item?.actionType}</td>
                                    <td className={'py-2 px-4'}>{item?.statusMessage}</td>
                                    <td className={'py-2 px-4'}>{item?.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    )
}
