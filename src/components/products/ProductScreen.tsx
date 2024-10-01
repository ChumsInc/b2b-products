import React from "react";
import ProductTable from "./list/ProductTable";
import {Outlet} from "react-router";

const ProductScreen = () => {
    return (
        <div className="row g-3">
            <div className="col-7">
                <h2>Product List</h2>
                <ProductTable/>
            </div>
            <div className="col-5">
                <Outlet/>
            </div>
        </div>
    )
}

export default ProductScreen;
