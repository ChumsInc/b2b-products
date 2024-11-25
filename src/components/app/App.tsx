import React, {useEffect} from 'react';
import ProductScreen from "../products/ProductScreen";
import ColorScreen from "../colors/ColorScreen";
import {loadColors} from "../../ducks/colors/actions";
import {loadProductsList} from "../../ducks/products/list/actions";
import {useAppDispatch} from "./hooks";
import {loadSeasons} from "../../ducks/seasons/actions";
import {Route, Routes} from "react-router";
import AppContent from "./AppContent";
import WhereUsedPage from "../where-used/WhereUsedPage";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from "@mui/material/useMediaQuery";
import MainEditForm from "../products/product/MainEditForm";
import ProductDetailsTab from "../products/product/ProductDetailsTab";
import VariantsTabContent from "../products/variant/VariantsTabContent";
import ProductColorsTab from "../products/color/ProductColorsTab";
import ProductMixTab from "../products/mix/ProductMixTab";
import ProductImagesTab from "../products/images/ProductImagesTab";
import ProductJSON from "../products/product/ProductJSON";
import ProductEditor from "./ProductEditor";
import IndexRedirector from "./IndexRedirector";
import {Alert} from "react-bootstrap";


export default function App() {
    const dispatch = useAppDispatch();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    useEffect(() => {
        dispatch(loadColors());
        dispatch(loadProductsList())
        dispatch(loadSeasons())
    }, []);

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Routes>
                <Route element={<AppContent/>}>
                    <Route index element={<IndexRedirector to="/products"/>} />
                    <Route path="/products" element={<ProductScreen/>}>
                        <Route index element={<ProductEditor><MainEditForm/></ProductEditor>}/>
                        <Route path=":keyword" element={<ProductEditor/>}>
                            <Route index element={<MainEditForm/>}/>
                            <Route path="main" element={<MainEditForm/>}/>
                            <Route path="details" element={<ProductDetailsTab/>}/>
                            <Route path="variant" element={<VariantsTabContent/>}/>
                            <Route path="variants" element={<VariantsTabContent/>}/>
                            <Route path="colors" element={<ProductColorsTab/>}/>
                            <Route path="mix" element={<ProductMixTab/>}/>
                            <Route path="images" element={<ProductImagesTab/>}/>
                            <Route path="json" element={<ProductJSON/>}/>
                        </Route>
                    </Route>
                    <Route path="/colors" element={<ColorScreen/>}>
                        <Route path=":code" element={<ColorScreen/>}/>
                    </Route>
                    <Route path="/where-used" element={<WhereUsedPage/>}/>
                    <Route path="*" element={<Alert variant="danger">Page not found</Alert>} />
                </Route>
            </Routes>
        </ThemeProvider>
    )
}
