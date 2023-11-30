import dayjs from "dayjs";
import {useMemo} from "react";

export default function CalenderSingleDate(props) {
    const dayjsDate = useMemo(() => !props.date ? null : dayjs(props.date, "YYYY-MM-DD"), [props.date]);

    const isSame = useMemo(() => dayjsDate.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'), [dayjsDate])
    const dateElm = isSame ?
        <span className="text-black text-sm p-1 rounded-full" style={{ backgroundColor: '#4F46E5', color: '#fff'}}>{dayjsDate.format('D')}</span> :
        <span className="text-black text-sm">{dayjsDate.format('D')}</span>;


    return <>
        <span className="text-gray-500 text-sm">{dayjsDate.format('ddd')}</span> &nbsp;
        {dateElm}
    </>
}