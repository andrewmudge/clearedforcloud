interface CodeBlockProps {
  children: string;
  language?: string;
}

export default function CodeBlock({ children, language = "bash" }: CodeBlockProps) {
  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="code-block-language">{language}</span>
      </div>
      <pre className="code-block-content">
        <code>{children}</code>
      </pre>
      
      <style jsx>{`
        .code-block-container {
          background-color: #002B36;
          border: 1px solid #475569;
          border-radius: 8px;
          margin: 16px 0;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .code-block-header {
          background-color: #334155;
          padding: 8px 16px;
          border-bottom: 1px solid #475569;
          font-size: 12px;
          color: #94a3b8;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        }
        
        .code-block-language {
          font-weight: 500;
        }
        
        .code-block-content {
          background-color: #002B36;
          padding: 16px;
          margin: 0;
          overflow-x: auto;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          color: #e2e8f0;
          white-space: pre;
        }
        
        .code-block-content code {
          background: transparent;
          border: none;
          padding: 0;
          font-family: inherit;
          font-size: inherit;
          color: inherit;
        }
      `}</style>
    </div>
  );
}
