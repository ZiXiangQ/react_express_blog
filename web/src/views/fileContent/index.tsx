/*
 * @Author: qiuzx
 * @Date: 2025-01-03 15:02:05
 * @LastEditors: qiuzx
 * @Description: description
 */
// src/components/FileContent.tsx
import ProjectService from '@/services/api/project';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FileContent: React.FC = () => {
    const { projectKey, filePath } = useParams<{ projectKey: string; filePath: string }>();
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        if (!filePath) {
            return;
        }
        const decodedFilePath = decodeURIComponent(filePath);
        console.log('Decoded file path:', projectKey);
        console.log('Fetching file content:', decodedFilePath);
        ProjectService.get_file_content({"file_path": decodedFilePath})
           .then(rsp => setContent(rsp.data.content))
           .catch(error => console.error('Error fetching file content:', error));

    }, [filePath]);

    return (
        <div>
            <h2>文件内容: {filePath}</h2>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default FileContent;
