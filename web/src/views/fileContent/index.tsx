import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import axios from 'axios';
import './index.less';

const FileContent: React.FC = () => {
    const { projectKey, filePath } = useParams<{ projectKey: string; filePath: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');
    const [contentType, setContentType] = useState<string>('');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!filePath || !projectKey) {
            setError('Invalid file path or project key.');
            setLoading(false);
            return;
        }
        const fetchFileContent = async () => {
            try {
                const requestData = {
                    file_path: `${projectKey}/${filePath}`,
                };

                const response = await axios.post('http://127.0.0.1:11055/file_handle/file_read', requestData, {
                    responseType: filePath.endsWith('.pdf') ? 'blob' : 'json', // 对 PDF 文件设置为二进制流
                });
                if (filePath.endsWith('.pdf')) {
                    // 处理 PDF 文件，生成 Blob URL
                    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                    const url = URL.createObjectURL(pdfBlob);
                    setPdfUrl(url);
                } else {
                    // 处理其他文件内容
                    const { content, type } = response.data;
                    setContent(content);
                    setContentType(type || 'text');
                }
            } catch (err) {
                console.error('Error fetching file content:', err);
                setError('Failed to fetch file content.');
            } finally {
                setLoading(false);
            }
        };

        fetchFileContent();
    }, [projectKey, filePath]);

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div className='file-content'>
            <h2>文件内容: {filePath}</h2>
            {contentType === 'html' && (
                    <div
                        className='html-content'
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}
                {contentType === 'text' && (
                    <pre
                        className='text-content'
                    >
                        {content}
                    </pre>
                )}
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
                    title="PDF Viewer"
                />
            )}
        </div>
    );
};

export default FileContent;
