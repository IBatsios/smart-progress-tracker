import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#112240',
                            color: '#ccd6f6',
                            border: '1px solid #233554',
                        },
                        success: {
                            iconTheme: {
                                primary: '#64ffda',
                                secondary: '#112240',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ff6b6b',
                                secondary: '#112240',
                            },
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);