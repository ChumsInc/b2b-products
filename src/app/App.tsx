import React, {useEffect} from 'react';
import AppTabs, {appTabs, tabKey} from "./AppTabs";
import {AlertList, selectCurrentTab} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";
import ProductScreen from "../ducks/products/components/ProductScreen";
import ColorScreen from "./ColorScreen";
import {loadColorsAction} from "../ducks/colors/actions";
import {loadProductListAction} from "../ducks/products/actions";

const App: React.FC = () => {
    const dispatch = useDispatch();
    const tab = useSelector(selectCurrentTab(tabKey));
    useEffect(() => {
        dispatch(loadColorsAction());
        dispatch(loadProductListAction())
    }, [])
    return (
        <div>
            <AppTabs/>
            <AlertList/>
            <div>
                {tab === appTabs.products.id && <ProductScreen/>}
                {tab === appTabs.colors.id && <ColorScreen/>}
            </div>
        </div>
    )
}

export default App;
