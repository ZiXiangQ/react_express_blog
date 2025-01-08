/*
 * @Author: qiuzx
 * @Date: 2025-01-03 15:02:05
 * @LastEditors: qiuzx
 * @Description: description
 */
// src/components/FileContent.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FileContent: React.FC = () => {
    const { filePath } = useParams<{ filePath: string }>();
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        if (filePath) {
            fetch(`/api/files/${filePath}/`)
                .then(response => response.json())
                .then(data => setContent(data.content))
                .catch(error => console.error('Error fetching file content:', error));
        }
    }, [filePath]);

    return (
        <div>
            <h2>文件内容: {filePath}</h2>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default FileContent;
