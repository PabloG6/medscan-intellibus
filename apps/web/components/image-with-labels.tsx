import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./image-with-fallback";

export interface ImageLabel {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  text: string;
}

interface ImageWithLabelsProps {
  src: string;
  alt: string;
  labels?: ImageLabel[];
  onLabelsChange?: (labels: ImageLabel[]) => void;
  className?: string;
  editable?: boolean;
  defaultLabelText?: string;
}

export function ImageWithLabels({
  src,
  alt,
  labels: initialLabels = [],
  onLabelsChange,
  className = "",
  editable = true,
  defaultLabelText = "Label"
}: ImageWithLabelsProps) {
  const [labels, setLabels] = useState<ImageLabel[]>(initialLabels);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editable) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newLabel: ImageLabel = {
      id: `label-${Date.now()}`,
      x,
      y,
      text: defaultLabelText
    };

    const updatedLabels = [...labels, newLabel];
    setLabels(updatedLabels);
    setEditingId(newLabel.id);
    onLabelsChange?.(updatedLabels);
  };

  const handleLabelTextChange = (id: string, text: string) => {
    const updatedLabels = labels.map(label =>
      label.id === id ? { ...label, text } : label
    );
    setLabels(updatedLabels);
    onLabelsChange?.(updatedLabels);
  };

  const handleRemoveLabel = (id: string) => {
    const updatedLabels = labels.filter(label => label.id !== id);
    setLabels(updatedLabels);
    onLabelsChange?.(updatedLabels);
  };

  const handleLabelClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editable) {
      setEditingId(id);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={`relative ${className}`}
        onClick={handleImageClick}
        style={{ cursor: editable ? 'crosshair' : 'default' }}
      >
        <ImageWithFallback src={src} alt={alt} className="w-full h-full object-cover" />
        
        {/* Labels */}
        {labels.map((label) => (
          <div
            key={label.id}
            className="absolute group"
            style={{
              left: `${label.x}%`,
              top: `${label.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => handleLabelClick(e, label.id)}
          >
            {/* Marker dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border-2 border-white" />
            
            {/* Label box */}
            <div className="absolute top-0 left-4 whitespace-nowrap">
              {editingId === label.id && editable ? (
                <div className="flex items-center gap-2 bg-black border border-white px-2 py-1 rounded-[1px]">
                  <input
                    type="text"
                    value={label.text}
                    onChange={(e) => handleLabelTextChange(label.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingId(null);
                      e.stopPropagation();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent text-white text-sm outline-none border-none w-32"
                    autoFocus
                  />
                  {editable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLabel(label.id);
                      }}
                      className="text-white hover:text-white/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-black border border-white px-2 py-1 rounded-[1px] opacity-90">
                  <span className="text-sm text-white">{label.text}</span>
                  {editable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLabel(label.id);
                      }}
                      className="text-white hover:text-white/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Instructions */}
      {editable && (
        <div className="mt-2 text-sm">
          Click on the image to add labels. Click on a label to edit or remove it.
        </div>
      )}
    </div>
  );
}
