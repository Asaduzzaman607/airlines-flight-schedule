import {useState} from 'react'

// import component
import { Modal } from 'antd'
import { showAlert } from '../../../services/actions/commonActions'
import { SingleItemView, TimeIconComponent } from '../../commonComponents/CommonItems'

export default function FlyingTimeViewModal ({ items, setFlyingModalOpen }) {
    const [isModalOpen, setIsModalOpen] = useState(true)

    // modal handle ok
    const handleOk = () => {
        setIsModalOpen(false)
        setFlyingModalOpen(false)
    }

    // modal handle cancel
    const handleCancel = () => {
        setIsModalOpen(false)
        setFlyingModalOpen(false)
    }
 
    if(!items?.flyingTimes?.length) {
        showAlert('warning', 'No Flying Time Record Found.')
        setFlyingModalOpen(false)
        return; 
    }
    else return (
        <div>
            <Modal 
                title={<div>Total Flying Time: <span className={'text-blue-600'}>{items?.totalFlyingHour} Hours</span></div>} 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                width="70%"
            >
                <div className={'max-h-[450px] overflow-y-auto border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 p-4'}>
                    <table className={'w-full'}>
                        <thead>
                            <tr className={'border-b-2 bg-green-400'}>
                                <th className={'py-2 px-4 text-left font-bold'}>Employee Name</th>
                                <th className={'py-2 px-4 text-left font-bold'}>Crew Type</th>
                                <th className={'py-2 px-4 text-left font-bold'}>Crew Role Type</th>
                                <th className={'py-2 px-4 text-left font-bold'}>Aircraft Type</th>
                                <th className={'py-2 px-4 text-left font-bold'}>Hour</th>
                                <th className={'py-2 px-4 text-left font-bold'}>Minutes</th>
                                <th className={'py-2 px-4 text-left font-bold'}>Present Airlines</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.flyingTimes.map((item) => (
                                <tr key={item.id} className={`odd:bg-white even:bg-slate-100 hover:bg-gray-300`}>
                                    <td className={'py-2 px-4'}> <SingleItemView item={item?.employeeName} /></td>
                                    <td className={'py-2 px-4'}>{item?.crewType}</td>
                                    <td className={'py-2 px-4'}>{item?.cockpitCrewFlightRoleType ?? item?.cabinCrewType}</td>
                                    <td className={'py-2 px-4'}>{item?.aircraftType?.name}</td>
                                    <td className={'py-2 px-4'}><TimeIconComponent item={item?.hour}/></td>
                                    <td className={'py-2 px-4'}><TimeIconComponent item={item?.min}/></td>
                                    <td className={'py-2 px-4'}>{item?.isPresent ? 'YES' : 'NO'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    )
}
