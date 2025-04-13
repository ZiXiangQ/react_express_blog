/*
 * @Author: qiuzx
 * @Date: 2025-04-12 08:43:01
 * @LastEditors: qiuzx
 * @Description: description
 */
// components/FileIcon.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFilePdf,
  faFile,
  faFolder
} from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'

interface FileIconProps {
  type: string
  className?: string
}

const FileIcon = ({ type, className = '' }: FileIconProps) => {
  // 获取文件类型对应的图标和颜色
  const getIconConfig = () => {
    const config = {
      icon: faFile,
      color: '#6b7280',
      bgColor: '#f3f4f6'
    }

    switch (type.toLowerCase()) {
      case 'doc':
      case 'docx':
        return {
          icon: faFileWord,
          color: '#2563eb',
          bgColor: '#dbeafe'
        }
      case 'xls':
      case 'xlsx':
        return {
          icon: faFileExcel,
          color: '#16a34a',
          bgColor: '#dcfce7'
        }
      case 'ppt':
      case 'pptx':
        return {
          icon: faFilePowerpoint,
          color: '#ea580c',
          bgColor: '#ffedd5'
        }
      case 'pdf':
        return {
          icon: faFilePdf,
          color: '#dc2626',
          bgColor: '#fee2e2'
        }
      case 'md':
        return {
          icon: faMarkdown,
          color: '#9333ea',
          bgColor: '#f3e8ff'
        }
      case 'folder':
        return {
          icon: faFolder,
          color: '#d97706',
          bgColor: '#fef3c7'
        }
      default:
        return config
    }
  }

  const { icon, color, bgColor } = getIconConfig()

  return (
    <div 
      className={`file-icon ${className}`}
      style={{
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        backgroundColor: bgColor,
        marginRight: '10px'
      }}
    >
      <FontAwesomeIcon 
        icon={icon} 
        style={{ 
          fontSize: '12px',
          color: color
        }} 
      />
    </div>
  )
}

export default FileIcon
