import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Spin, message } from 'antd';
import ProjectService from '@/services/api/project';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './index.less';
import MarkdownRenderer from './component/MarkdownRenderer';
import ExcelViewer from './component/ExcelViewer';


interface FileResponse {
  code: number;
  data: {
    content: string;
    type: string;
    meta?: Record<string, string>;
  };
  message?: string;
}

const FileContent: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState<any>(null);
  const [fileType, setFileType] = useState<string>('');
  const [fileMeta, setFileMeta] = useState<Record<string, string>>({});
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const filePath = params.get('path');
        if (!filePath) {
          message.error('文件路径不存在');
          return;
        }
        // 获取文件扩展名
        const extension = filePath.split('.').pop()?.toLowerCase() || '';
        setFileType(extension);
        const response = await ProjectService.get_file_content({ file_path: filePath });
        if (typeof response === 'string') {
          // PDF 文件直接返回 URL
          setFileContent(response);
        } else {
          const fileResponse = response as FileResponse;
          if (fileResponse.code === 0 && fileResponse.data) {
            setFileContent(fileResponse.data.content);
            setFileType(fileResponse.data.type || extension);
            if (fileResponse.data.meta) {
              setFileMeta(fileResponse.data.meta);
            }
          } else {
            message.error(fileResponse.message || '获取文件内容失败');
          }
        }
      } catch (error) {
        console.error('Error fetching file content:', error);
        message.error('获取文件内容失败');
      } finally {
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [location]);

  const renderPdf = () => (
    <div className="pdf-viewer-container">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileContent || ''}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1}
        />
      </Worker>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <Spin size="large" />;
    }
    if (!fileContent) {
      return <div className="empty-content">暂无内容</div>;
    }
    console.log(fileType);
    switch (fileType) {
      case 'md':
      case 'markdown':
        return MarkdownRenderer({ content: fileContent, meta: fileMeta });
      case 'pdf':
      case 'doc':
      case 'docx': // Word文件会被后端转换为PDF
        return renderPdf();
      case 'xlsx':
      case 'excel':
        return (
          <div>
            <ExcelViewer data={{
              content: fileContent,
              meta: {
                sheets_count: Number(fileMeta?.sheets_count || 1),
                filename: fileMeta?.filename || ''
              }
            }} />
          </div>
        );
      default:
        return <div className="unsupported-type">不支持的文件类型: {fileType}</div>;
    }
  };

  return (
    <div className="file-content-container">
      {renderContent()}
    </div>
  );
};

export default FileContent;
