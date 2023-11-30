import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// import components
import { Button, Form, Modal } from 'antd'
import { setIsCrewAssignModalOpen, setViolatedRuelsForCockpitCrew } from '../../../services/reducers/CrewManagementReducers/crewAssignReducer'

// import action and reducers

export default function CockpitCrewModal({onFinish}) {
    
    const {
        isLoadingAddUser, 
        crewAssignViolatedRuels,
        isCrewAssignModalOpen
    } = useSelector(state => state.crewassign)

    const [isModalOpen, setIsModalOpen] = useState(isCrewAssignModalOpen)

    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // close modal
    const handleCancel = () => {
        setIsModalOpen(false)
        dispatch(setIsCrewAssignModalOpen(false))
        dispatch(setViolatedRuelsForCockpitCrew([]))
    }
    
    return (
        <div>
            <Modal 
                confirmLoading={isLoadingAddUser} 
                maskClosable={false} 
                title={'Cockpit Crew Assign'} 
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={'60%'}
            >
                <div className={'max-h-[450px] overflow-y-auto border border-gray-200 rounded-lg shadow-inner gap-5 p-4'}>
                    <table className={'w-full'}>
                        <thead>
                            <tr className={'border-b-2'}>
                                <th className={'py-2 px-4 text-left font-bold'}>Seat</th>
                                <th className={'py-2 px-4 text-left font-bold'}>Employee</th>
                                <th className={'py-2 px-4 text-left font-bold'}>Violated Rules</th>
                            </tr>
                        </thead>
                        <tbody>
                            {crewAssignViolatedRuels.map((item, index) => (
                                <tr key={index} className={'border-b'}>
                                    <td className={'py-2 px-4'}>{`P${index + 1}`}</td>
                                    <td className={'py-2 px-4'}>{`${item?.employeeName} (${item?.employeeId})`}</td>
                                    <td className={'py-2 pr-2 bg-yellow-200 font-bold rounded-md'}>
                                        { item?.violatedRules?.length ? item?.violatedRules.map((item, index) => (
                                            <div key={index} className={'pl-4 pt-2'}>
                                                <span className={'text-black-400 '}> { item?.rule }. </span>
                                                <span className={'pl-2 text-zinc-500 font-semibold italic'}> --- { item?.description } </span>
                                            </div>
                                        )) : <div className={'pl-4 pt-2'}>Not Found</div>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Button 
                    className={'mr-4'} 
                    loading={isLoadingAddUser} 
                    type={'primary'}
                    onClick={() => onFinish()}
                >
                    { 'Submit With Warning' }
                </Button>
                <Button onClick={handleCancel}>{'Cancel'}</Button>
            </Modal>
        
        </div>
    )
}
