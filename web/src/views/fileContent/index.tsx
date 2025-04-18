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
import { mdContent, excelContent, mdDataType, excelDataType } from '@/types/project';

const FileContent: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [fileType, setFileType] = useState<string>('');//文件类型
  const [mdContent, setMdContent] = useState<mdContent>();//md  
  const [fileContent, setFileContent] = useState<string>('');//pdf url
  const [excelContent, setExcelContent] = useState<excelContent>();//excel
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchFileContent = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const filePath = params.get('path');
        if (!filePath) {
          message.error('文件路径不存在');
          return;
        }
        const extension = filePath.split('.').pop()?.toLowerCase() || '';
        setFileType(extension);
        const response = await ProjectService.get_file_content({ file_path: filePath });
        if (typeof response === 'string') {
          setFileContent(response);
        }else if (response.data.type === 'md') {
          const mdResponse = response as mdDataType;
          setMdContent({ content: mdResponse.data.content, meta: mdResponse.data.meta });
          setFileType('md');
        }else if (response.data.type === 'xlsx' || response.data.type === 'xls') {
          const excelResponse = response as excelDataType;
          setExcelContent({ content: excelResponse.data.content, meta: excelResponse.data.meta });
          setFileType('xlsx');
        }else{
          // setFileContent(response);
          setFileType(extension);
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
    switch (fileType) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'ppt':
      case 'pptx': 
        return renderPdf();
      case 'md':
        return <MarkdownRenderer content={mdContent?.content || ''} meta={mdContent?.meta || {}} />;
      case 'xlsx':
      case 'xls':
        return (
          <div>
            { excelContent && <ExcelViewer excelContent={excelContent}/>}
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
