import React, {useEffect} from 'react';
import ProductScreen from "../ducks/products/ProductScreen";
import ColorScreen from "../ducks/colors/ColorScreen";
import {loadColors} from "../ducks/colors/actions";
import {loadProductsList} from "../ducks/products/list/actions";
import {useAppDispatch} from "./hooks";
import {loadSeasons} from "../ducks/seasons";
import {Route, Routes} from "react-router";
import AppContent from "./AppContent";
import WhereUsedPage from "../ducks/where-used/WhereUsedPage";


const App: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadColors());
        dispatch(loadProductsList())
        dispatch(loadSeasons())
    }, []);

    return (
        <Routes>
            <Route element={<AppContent/>}>
                <Route index element={<ProductScreen/>}/>
                <Route path="/products" element={<ProductScreen/>}>
                    <Route path=":keyword" element={<ProductScreen/>} />
                </Route>
                <Route path="/colors" element={<ColorScreen/>}>
                    <Route path=":code" element={<ColorScreen/>}/>
                </Route>
                <Route path="/where-used" element={<WhereUsedPage/>}/>
            </Route>
        </Routes>
    )
}

export default App;
