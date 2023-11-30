import { memo } from 'react'

// addSeat props only available for p3/optional seat
const SelectedCockpitCrewOptions = memo(({ setSelectedOptionId, selectedOptionId, addSeat=undefined, from }) => {
    const updateState = (id)=> {
        if(addSeat) {
            const values = [...addSeat]
            values[0].statusId = id
            setSelectedOptionId(values)
        } else {
            setSelectedOptionId(id)
        }
    }
   
    // employee status handler
    const StatusHandler = (selectedOptionId, position) => {
        return (
            <div 
                onClick={()=> updateState(position)} 
                className={`min-h-[25px] min-w-[25px] cursor-pointer ${selectedOptionId === position ? 'bg-green-600' : 'bg-[#e5e7eb]' } mr-2`}
            ></div>
        )
    }
    
    return (
        <div className={'pl-4 pt-4'} style={{ width: '40%', float: 'right'}}> 
            <div className={'italic font-bold'}>Select Role</div>
            <div className='flex p-1'>
                { StatusHandler(selectedOptionId, 0) }
                <span >Captain</span>
            </div>
            { from !== 'p1' &&
                <div className={'flex p-1'}>
                    { StatusHandler(selectedOptionId, 1) }
                    <span >First Officer</span>
                </div>
            }
            
            <div className={'flex p-1'}>
                { StatusHandler(selectedOptionId, 2) }
                <span >Instructor</span>
            </div>
            { from !== 'p3' &&
                <>
                    <div className={'flex p-1'}>
                        { StatusHandler(selectedOptionId, 3) }
                        <span >Route Training</span>
                    </div>
                    <div className={'flex p-1'}>
                        { StatusHandler(selectedOptionId, 4) }
                        <span >Route Check</span>
                    </div>
                    <div className={'flex p-1'}>
                        { StatusHandler(selectedOptionId, 5) }
                        <span >IRC</span>
                    </div>
                </>
            }
            { from === 'p2' &&
                <div className={'flex p-1'}>
                    { StatusHandler(selectedOptionId, 6) }
                    <span >EV</span>
                </div>
            }
            { from === 'p3' &&
                <>
                    <div className={'flex p-1'}>
                        { StatusHandler(selectedOptionId, 7) }
                        <span >Safety</span>
                    </div>
                    <div className={'flex p-1'}>
                        { StatusHandler(selectedOptionId, 8) }
                        <span >OBS</span>
                    </div>
                </>
            }
        </div>
    )
})

export default SelectedCockpitCrewOptions;
