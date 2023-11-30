import {useEffect, useState} from "react";
import API from "../../services/api";

export default function useUserTypes() {
    const [userTypes, setUserTypes] = useState([])

    useEffect(() => {
        (async () => {
            const res = await API.get('aircraft-type');
            setUserTypes([...res.data?.model?.map(type => ({ label: type.name, value: type.id}))])
        })();
    }, [])

    return {
        userTypes
    }
}