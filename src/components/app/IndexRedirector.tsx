import {useEffect} from 'react';
import {useNavigate} from "react-router";

export default function IndexRedirector({to}:{to: string}) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to);
    }, []);
    return null;
}
