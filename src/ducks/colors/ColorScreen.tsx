import React from "react";
import ColorList from "./ColorList";
import ColorEditor from "./ColorEditor";
import ColorUsageList from "./ColorUsageList";

const ColorScreen = () => {

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
