/*
 * @Author: qiuzx
 * @Date: 2025-04-12 19:42:25
 * @LastEditors: qiuzx
 * @Description: Excel文件查看器
 */
import React, { useState } from 'react';
import { Table, Card, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './index.less';
import { excelContent, SheetData } from '@/types/project';

interface IProps {  
  excelContent: excelContent;
}

const ExcelViewer: React.FC<IProps> = ({ excelContent }) => {
  const { content, meta } = excelContent;
  const [activeTab, setActiveTab] = useState('0');

  const renderTable = (sheet: SheetData) => {
    const columns: ColumnsType<unknown> = sheet.headers.map((header, index) => ({
      title: header.value,
      dataIndex: index.toString(),
      key: index.toString(),
      width: Math.min(Math.max(header.width * 15, 100), 300),
    }));

    const tableData = Array.isArray(sheet.rows) 
      ? sheet.rows.map((row, rowIndex) => ({
          key: rowIndex,
          ...row.reduce((acc, cell, cellIndex) => ({
            ...acc,
            [cellIndex.toString()]: cell ?? ''
          }), {})
        }))
      : [];

    return (
      <Table 
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
          showQuickJumper: true
        }}
        size="small"
        bordered
        
      />
    );
  };

  const items = content?.map((sheet, index) => ({
    key: index.toString(),
    label: sheet?.name || `工作表 ${index + 1}`,
    children: renderTable(sheet),
  }));

  return (
    <Card 
      title={ meta?.filename || 'Excel文件'}
      className="excel-viewer"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        type="card"
        className="excel-tabs"
      />
    </Card>
  );
};

export default ExcelViewer;
