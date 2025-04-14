/*
 * @Author: qiuzx
 * @Date: 2024-12-19 14:36:34
 * @LastEditors: qiuzx
 * @Description: description
 */
// src/main.tsx
import './styles/main.less';
import './styles/theme.css';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import RouterWaiter from 'react-router-waiter';
import { routes } from '../router';
import { ThemeProvider } from './contexts/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './store';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);

root.render(
    <Provider store={store}>
        <ThemeProvider>
            <HashRouter>
                <RouterWaiter routes={routes} />
            </HashRouter>
        </ThemeProvider>
    </Provider>
);
