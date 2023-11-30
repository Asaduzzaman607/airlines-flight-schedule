// Tooltips text handler
export const HoverHandler = (item) => {
	return (
		<div className={'grid max-h-[400px] overflow-y-auto'}>
            { item?.crewRecencyInfoResponseDtoList?.length ? 
                <table className={"table-fixed w-full"}>
                    <thead>
                        <tr>
                            <th className={'border-solid border-0 border-b-[4px] border-white-900'}>Recency Name</th>
                            <th className={'border-solid border-0 border-b-[4px] border-white-900'}>Expired On</th>
                        </tr>
                    </thead>
                    <tbody>
                        { item?.crewRecencyInfoResponseDtoList?.map((value,index) => (
                            <tr key={index} className={`${!value.expiredDate && 'bg-red-600'}`}>
                                <td className={'border-solid border-0 border-b-[2px] border-white-900'}>{ value.recencyName }</td>
                                <td className={'border-solid border-0 border-b-[2px] border-white-900'}>{ value.expiredDate ?? `${value.possibleCompletionDate} (Possible Exam Date.)` }</td>
                            </tr>
                        )) }
                    </tbody>
                </table> : <div>Recency Not Found</div>
            }
		</div>
	)
}