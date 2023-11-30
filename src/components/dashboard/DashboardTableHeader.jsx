import { useMemo, useCallback } from 'react'
import dayjs from 'dayjs'

const DashboardTableHeader = ({ title }) => {
    // check if title is not valid or empty
    if(!title) {
        return null
    }

    // generate human readable date
    const _generateDate = () => useMemo(() => {
        if (!title) {
            return null
        }
 
        return dayjs(title).format('ddd, D-MMM-YY')
    }, [title])

    // check if the date is current date or not
    const _isCurrentDate = () => useMemo(() => {

        const date = dayjs(title, 'YYYY-MM-DD')
        return date.isSame(dayjs(), 'day')
    }, [])

    return (
        <div className={'py-3 px-2 flex justify-center items-center'}>
            {
                title && <div className={`${ _isCurrentDate() && 'border-b-2 border-blue-300 px-2' }`}>{ _generateDate() }</div>
            }
        </div>
    )
}

export default DashboardTableHeader