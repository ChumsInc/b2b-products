import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './app/App';
import store from './app/configureStore'
import {HashRouter as Router} from 'react-router-dom';

window.localStorage.setItem('debug', '*');
const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <Router>
            <Provider store={store}>
                <App/>
            </Provider>
        </Router>
    </React.StrictMode>
);
