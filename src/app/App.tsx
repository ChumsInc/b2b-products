import React, {useEffect} from 'react';
import AppTabs, {appTabs, tabKey} from "./AppTabs";
import {AlertList, selectCurrentTab} from "chums-connected-components";
import {useSelector} from "react-redux";
import ProductScreen from "../ducks/products/components/ProductScreen";
import ColorScreen from "./ColorScreen";
import {loadColorsAction} from "../ducks/colors/actions";
import {loadProductListAction} from "../ducks/products/actions";
import {useAppDispatch} from "./hooks";

const App: React.FC = () => {
    const dispatch = useAppDispatch();
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
