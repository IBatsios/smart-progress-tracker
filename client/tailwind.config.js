/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom dark theme colors
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                dark: {
                    100: '#ccd6f6',
                    200: '#8892b0',
                    300: '#233554',
                    400: '#112240',
                    500: '#0a192f',
                    600: '#020c1b',
                },
                accent: {
                    green: '#64ffda',
                    blue: '#57cbff',
                    orange: '#ff9f43',
                    red: '#ff6b6b',
                    purple: '#a78bfa',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
};