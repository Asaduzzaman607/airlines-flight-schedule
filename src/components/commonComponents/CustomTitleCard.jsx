const CustomTitleCard = ({
	title,
	isHeaderTitle,
	isCard,
	icon,
	isTitleReveresed,
	subText,
	size,
	titleSize,
}) => {
	return (
		<div
			className={`flex items-center ${isCard && 'p-4 rounded-2xl bg-slate-200 shadow'} ${
				size === 'small' ? 'space-x-1' : 'space-x-3'
			}`}
		>
			{isHeaderTitle && <div className={'h-6 w-2 bg-blue-400 rounded'}></div>}
			{icon && (
				<div
					className={`  text-gray-500 flex justify-center items-center ${
						isCard && 'bg-slate-300 rounded-full p-3'
					} ${size === 'small' ? 'text-lg' : 'text-4xl'} `}
				>
					{icon}
				</div>
			)}
			<div
				className={`flex justify-start ${
					isTitleReveresed ? 'flex-col-reverse' : 'flex-col'
				}`}
			>
				{subText && (
					<div
						className={
							'text-xs text-gray-600 font-notoSansDisplay font-normal tracking-wide'
						}
					>
						{subText}
					</div>
				)}
				<div
					className={`${
						size === 'small' ? 'text-sm' : titleSize === 'lg' ? 'text-3xl' : 'text-xl'
					} font-medium font-notoSansDisplay text-gray-800`}
				>
					{title}
				</div>
			</div>
		</div>
	)
}

export default CustomTitleCard
