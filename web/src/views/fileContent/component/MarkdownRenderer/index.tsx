/*
 * @Author: qiuzx
 * @Date: 2025-04-12 12:07:55
 * @LastEditors: qiuzx
 * @Description: description
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';
import './index.less';

interface MarkdownRendererProps {
  content: string;
  meta?: Record<string, string>;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, meta }) => {
  const markdownContent = typeof content === 'string' ? content : '';

  return (
    <div className="markdown-container">
      {meta && Object.keys(meta).length > 0 && (
        <div className="markdown-meta">
          <h2>文档信息</h2>
          <ul>
            {Object.entries(meta).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight,  [rehypeKatex, { 
          strict: false, // 关闭严格模式
          trust: true,
          throwOnError: false, // 遇到错误时不抛出异常
          macros: { // 自定义宏
            "\\RR": "\\mathbb{R}"
          }
        }]]}
        components={{
          img: ({ ...props }) => (
            <img {...props} loading="lazy" style={{ maxWidth: '100%' }} />
          ),
          table: ({ ...props }) => (
            <div className="table-container">
              <table {...props} />
            </div>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return  match ? (
              <div className="code-block">
                <div className="code-language">{match[1]}</div>
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 
