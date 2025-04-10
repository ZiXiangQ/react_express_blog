/*
 * @Author: qiuzx
 * @Date: 2025-04-10 13:35:39
 * @LastEditors: qiuzx
 * @Description: description
 */
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

// 定义主题类型
export type ThemeType = 'light' | 'dark';

// 定义主题上下文类型
interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从本地存储获取主题设置，默认为浅色主题
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'light';
  });

  // 切换主题
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 设置主题
  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  // 根据主题类型获取 Ant Design 主题配置
  const getAntdTheme = () => {
    if (currentTheme === 'dark') {
      return {
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      };
    }
    return {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1890ff',
        borderRadius: 4,
      },
    };
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, setTheme }}>
      <ConfigProvider theme={getAntdTheme()}>
        <div className={`app-container ${currentTheme}`}>
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// 自定义钩子，用于在组件中使用主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
