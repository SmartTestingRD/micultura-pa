import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none rounded-lg text-sm p-2.5 transition-colors"
        >
            {isDark ? (
                <span id="theme-toggle-light-icon" className="material-symbols-outlined">light_mode</span>
            ) : (
                <span id="theme-toggle-dark-icon" className="material-symbols-outlined">dark_mode</span>
            )}
        </button>
    );
};
