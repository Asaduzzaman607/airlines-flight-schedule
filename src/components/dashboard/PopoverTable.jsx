//import component
import { Popover } from 'antd'

function PopoverTable({
	title,
	titleColor,
	tableData,
	children,
	disableTitle,
	tableHeader = [],
	contentChildren,
	...restProps
}) {
	return (
		<Popover
			{...restProps}
			overlayInnerStyle={{
				padding: '0px',
				overflow: 'hidden',
			}}
			content={
				<Content
					title={title}
					tableData={tableData}
					tableHeader={tableHeader}
					titleColor={titleColor}
				>
					{contentChildren}
				</Content>
			}
			className={
				disableTitle
					? 'w-full h-full'
					: `h-[25px] w-full flex justify-start px-2 items-center ${
							titleColor ?? 'bg-sky-600'
					  } text-white text-xs font-bold rounded`
			}
		>
			{!disableTitle && (title ?? 'N/A')}
			{disableTitle && children}
		</Popover>
	)
}
const Content = ({ title, tableData, tableHeader, titleColor, children }) => (
	<div className={'min-w-sm max-w-lg shadow-2xl text-xs font-semibold'}>
		<div className={`-mt-[2px] py-1 px-2 ${titleColor ?? 'bg-sky-600'}  text-white`}>
			{title ?? ''}
		</div>
		<table className='w-full p-1'>
			{tableHeader?.length ? (
				<thead>
					<tr>
						<td className={'font-bold'}>{tableHeader[0] ?? 'N/A'}</td>
						<td></td>
						<td className={'font-bold'}>{tableHeader[1] ?? 'N/A'}</td>
					</tr>
				</thead>
			) : (
				<span></span>
			)}
			<tbody>
				{tableData?.length ? (
					tableData?.map((item, idx) => (
						<tr key={idx}>
							<td>{item?.title ?? 'N/A'}</td>
							<td>:</td>
							<td>{item?.value ?? 'N/A'}</td>
						</tr>
					))
				) : (
					<tr>No Data Available</tr>
				)}
			</tbody>
			{children}
		</table>
	</div>
)
export default PopoverTable
