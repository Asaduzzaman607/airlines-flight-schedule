import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

// Conponents
import { Avatar, Tag } from 'antd'

// import icons
import { FieldTimeOutlined, UserOutlined } from '@ant-design/icons'
import { CiAirportSign1 } from 'react-icons/ci'

const MultipleEmployeeView = ({ items, dataIndex = "name", Icon = UserOutlined, size = 25 }) => {
	return (
		items && items.length ? items.map(item => (
			<div className='text-left p-1 flex' key={item.id}>
				<Avatar
					size={size}
					style={{
						backgroundColor: 'purple',
						marginRight: '5px',
						minWidth: '25px'
					}}
					icon={<Icon style={{ verticalAlign: 'middle', marginBottom: '5px' }} />}
				/>
				<span className={'pl-2'}>{item?.[dataIndex] ?? 'N/A'}</span>
			</div>
		)) : ''
	)
}

const SingleItemView = ({ item, Icon = UserOutlined, size = 25, isClickable, fullPath=null }) => {
    const { routePermissions } = useSelector((state) => state.auth)
    const { parent, actions } = routePermissions

    // if the user has permisson for specific action
    const _hasPermission = (action) => {
		// check if action array doesn't exist
		if (!actions || actions?.length === 0) {
			return false
		}

		return actions.some((item) => item === action)
	}

    console.log(_hasPermission('/details'), actions)

	return (
        <Link to={_hasPermission('/details') ? `${parent + '/details/' + fullPath?.id}` : '#'}>
            <div className={'text-left flex p-1'}>
                <Avatar
                    size={size}
                    style={{
                        backgroundColor: 'purple',
                        marginRight: '5px',
                        minWidth: '25px'
                    }}
                    icon={<Icon style={{ verticalAlign: 'middle', marginBottom: '5px' }} />}
                    />
                <div> {item ?? 'N/A'} </div>
            </div>
        </Link>
	)
}

const TimeIconComponent = ({ item }) => {
	return item ? (
		<span>
			<FieldTimeOutlined style={{ paddingRight: '2px', color: 'green', fontSize: '' }} />
			{item}
		</span>
	) : (
		'N/A'
	)
}

const sliceTextWithEllipsis = (text, numChars) => {
	if (text?.length > numChars) {
		return text.slice(0, numChars) + '...'
	}

	return text
}

// Name and Icon handler
const IconHandler = ({ item, ICON = CiAirportSign1, SIZE = 20 }) => (
	item ? <div className={'float-left text-left'}>
		<ICON
			size={SIZE}
			style={{ verticalAlign: 'middle', marginRight: '4px', color: "blueviolet" }}
		/>
		{item}
	</div> : 'N/A'
)

const CustomTag = ({ color, children, ...rest }) => (
	<Tag color={color} {...rest}>
		{children}
	</Tag>
)

const SetTableDataAlign = ({ text }) => (
	text ? <span className={'float-left text-left'}> { text } </span> : 'N/A'
)

// date formater
const MonthYearDateFormater = ({ inputDate }) => (
    inputDate ? dayjs(inputDate).format('DD-MMM-YYYY') : 'N/A'
)

// set some default color
const setColor = {
    0: '#6554AF',
    1: '#2E8A99',
    2: '#F29727',
    3: '#66347F',
    4: '#884A39',
    5: '#5C8984',
    6: '#8D7B68',
    7: '#1B9C85',
    8: '#643843',
    9: '#B71375',
    10: '#557153',
    11: '#576CBC',
    12: '#002B5B',
    13: '#DF7857',
}

export {
	CustomTag, IconHandler, MultipleEmployeeView,
	SingleItemView,
	TimeIconComponent,
	sliceTextWithEllipsis,
    setColor,
    SetTableDataAlign,
    MonthYearDateFormater
}

