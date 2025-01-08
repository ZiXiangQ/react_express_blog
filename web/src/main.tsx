// src/main.tsx
import './index.css';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import RouterWaiter from 'react-router-waiter';
import { routes } from '../router';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);

root.render(
    <HashRouter>
        <RouterWaiter routes={routes} />
    </HashRouter>,
);
