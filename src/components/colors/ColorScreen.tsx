import React, {useEffect} from "react";
import ColorList from "./ColorList";
import ColorEditor from "./ColorEditor";
import ColorUsageList from "./ColorUsageList";
import {useParams} from "react-router";
import {setCurrentColorByCode} from "@/ducks/colors/actions";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentColorCode} from "@/ducks/colors/selectors";

const ColorScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const colorCode = useAppSelector(selectCurrentColorCode);
    const params = useParams<{ code: string }>();

    useEffect(() => {
        if (params.code !== colorCode) {
            dispatch(setCurrentColorByCode(params.code));
        }
    }, [params.code, colorCode]);

    return (
        <div className="container">
            <div className="row g-3">
                <div className="col-6">
                    <ColorList/>
                </div>
                <div className="col-6">
                    <h2>Color Editor</h2>
                    <ColorEditor/>
                    <ColorUsageList/>
                </div>
            </div>
        </div>
    )
}

export default ColorScreen;
