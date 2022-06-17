import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './app/App';
import store from './app/configureStore'

window.localStorage.setItem('debug', '*');

render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
    , document.getElementById('app')
);
