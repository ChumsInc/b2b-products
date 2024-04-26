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
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from "@mui/material/useMediaQuery";


const App: React.FC = () => {
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
                    <Route index element={<ProductScreen/>}/>
                    <Route path="/products" element={<ProductScreen/>}>
                        <Route path=":keyword" element={<ProductScreen/>}/>
                    </Route>
                    <Route path="/colors" element={<ColorScreen/>}>
                        <Route path=":code" element={<ColorScreen/>}/>
                    </Route>
                    <Route path="/where-used" element={<WhereUsedPage/>}/>
                </Route>
            </Routes>
        </ThemeProvider>
    )
}

export default App;
