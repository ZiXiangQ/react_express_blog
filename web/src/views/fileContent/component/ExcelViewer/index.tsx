import React, { useState } from 'react';
import { Table, Card, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

interface SheetData {
  name: string;
  headers: Array<{
    value: string;
    width: number;
  }>;
  rows: string[][];
}

interface ExcelViewerProps {
  data: {
    content: SheetData[];
    meta: {
      sheets_count: number;
      filename: string;
    };
  };
}

const ExcelViewer: React.FC<ExcelViewerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('0');
  console.log(data,'data');

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

  const items = data.content?.map((sheet, index) => ({
    key: index.toString(),
    label: sheet?.name || `工作表 ${index + 1}`,
    children: renderTable(sheet),
  }));

  return (
    <Card 
      title={data?.meta?.filename || 'Excel文件'}
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
