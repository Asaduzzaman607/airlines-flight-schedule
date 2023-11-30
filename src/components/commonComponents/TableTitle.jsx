import { Divider } from 'antd'
import React from 'react'

function TableTitle({ title }) {
	return (
		<div className={'font-bold text-lg -mt-2 border border-l-4 border-gray-600'}>
			<Divider type='vertical' />
			{title ?? ''}
		</div>
	)
}

export default TableTitle
