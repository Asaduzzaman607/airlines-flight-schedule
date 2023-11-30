import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'

// import component
import { Button } from 'antd'

// import actions
import { downloadOccDayPlan } from '../../services/actions/dashboardAction'

const HeaderTitleOccDashboard = () => {
    const { submittedDate, occData, isDownloading } = useSelector(state => state.dashboard)
    const dispatch = useDispatch()

    // check if submitted date is invalid and return null
    if(!submittedDate) return null

    // handle download
    const _handleDownload = () => {
        const _submittedDate = dayjs(submittedDate).format('DD_MMM_YY_dddd')
        dispatch(downloadOccDayPlan(occData, _submittedDate))
    }

    return (
        <div className={'flex justify-between items-center'}>
            <div className={'font-medium'}>{submittedDate ? dayjs(submittedDate).format('dddd, DD MMM YYYY') : 'N/A'}</div>
            {
                occData?.length > 0 && (
                    <Button
                        type={'primary'}
                        onClick={_handleDownload}
                        loading={isDownloading}
                    >
                        {'Download'}
                    </Button>
                )
            }
        </div>
    )
}

export default HeaderTitleOccDashboard