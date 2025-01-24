import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import ProjectService from '@/services/api/project';

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
                const response = await ProjectService.get_file_content({ file_path: `${projectKey}/${filePath}` });
                console.log('response:', response);
                if (response && response.data) {
                    setContent(response.data.content);
                    if (typeof response.data.type === 'string') {
                        setContentType(response.data.type);
                    }
                } else {
                    setError('Invalid response from server.');
                }
            } catch (err) {
                console.error('Error fetching file content:', err);
                setError('Failed to fetch file content.');
            } finally {
                setLoading(false);
            }
        };

        const fetchPdf = async () => {
            try {
                const url = await ProjectService.get_pdf_content( { file_path: `${projectKey}/${filePath}` });
                console.log('pdf url:', url);
                setPdfUrl(url);
            } catch (err) {
                console.error("Error fetching PDF:", err);
                setError("Failed to fetch PDF file.");
            } finally {
                setLoading(false);
            }
        };

        if (filePath.endsWith('.pdf')) {
            fetchPdf();
        } else {
            fetchFileContent();
        }
    }, [projectKey, filePath]);

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <h2>文件内容: {filePath}</h2>
            {contentType === 'html' && <div dangerouslySetInnerHTML={{ __html: content }} />}
            {contentType === 'text' && <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>}
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    style={{ width: '100%', height: '80vh', border: 'none' }}
                    title="PDF Viewer"
                />
            )}
        </div>
    );
};

export default FileContent;
