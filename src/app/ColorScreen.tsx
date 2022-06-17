import React from "react";
import ColorList from "../ducks/colors/ColorList";
import ColorFilterBar from "../ducks/colors/ColorFilterBar";
import ColorEditor from "../ducks/colors/ColorEditor";
import ColorUsageList from "../ducks/colors/ColorUsageList";

const ColorScreen:React.FC = () => {

    return (
        <div className="container">
            <div className="row g-3">
                <div className="col-6">
                    <ColorFilterBar />
                    <ColorList />
                </div>
                <div className="col-6">
                    <h2>Color Editor</h2>
                    <ColorEditor />
                    <ColorUsageList />
                </div>
            </div>
        </div>
    )
}

export default ColorScreen;
