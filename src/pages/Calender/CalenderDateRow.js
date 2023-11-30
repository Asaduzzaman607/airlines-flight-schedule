import CalenderSingleDate from "./CalenderSingleDate";

export default function CalenderDateRow({ dates }) {


    return (
        <div className="flex ">
            <div className="w-40 h-20 border border-neutral-400 p-1" />
            {
                dates.map((date) => <CalenderSingleDate key={date} date={date} />)
            }
        </div>
    )
}