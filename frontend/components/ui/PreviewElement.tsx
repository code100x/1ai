import { Trash2 } from "lucide-react"; // bin icon

export const PreviewElement = ({ attributes, children, element, onPreviewClick, onDelete }: any) => {
  const { content } = element;

  const handleClick = () => {
    onPreviewClick(content);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering onPreviewClick
    onDelete(element);
  };

  return (
    <div
      {...attributes}
      contentEditable={false}
      className="relative border-gray-300 bg-gray-600 p-3 my-2 cursor-pointer transition-all duration-200 inline-block mr-3 mb-3 rounded-lg shadow-sm hover:shadow-md"
      style={{
        width: '140px',
        height: '140px',   // make it square
      }}
      onClick={handleClick}
    >
      <pre
        className="text-xs text-white overflow-hidden break-words whitespace-pre-wrap leading-relaxed"
        style={{
          maxHeight: '100%',
        }}
      >
        {content.slice(0, 200)}...
      </pre>

      {/* Delete Button at bottom-right */}
      <button
        onClick={handleDelete}
        className="absolute bottom-1 right-1 text-white hover:text-red-500 p-1 rounded-full"
        aria-label="Delete preview"
      >
        <Trash2 size={16} />
      </button>

      {children}
    </div>
  );
};
