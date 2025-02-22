"use client";

import { Tag } from "@/types/todo"; // Importiert tags von todo.ts
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface InputWithTagsProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  label?: string;
}

export default function InputWithTags({
  selectedTags,
  onTagsChange,
}: InputWithTagsProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        if (data.status === "success") {
          setAvailableTags(data.tags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some((selected) => selected.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  return (
    <div className="space-y-4 w-full">
      <div>
        <div className="mt-1 flex flex-wrap gap-2 p-1 border rounded-lg min-h-[2.5rem]">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 rounded-md text-sm"
            >
              {tag.text}
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:text-destructive"
                type="button"
                aria-label={`Remove tag ${tag.text}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {selectedTags.length === 0 && (
            <span className="text-muted-foreground text-sm p-1">
              Select tags from below
            </span>
          )}
        </div>
      </div>

      {/* Verfügbare Tags */}
      <div className="flex flex-wrap gap-2">
        {availableTags
          .filter(
            (tag) => !selectedTags.some((selected) => selected.id === tag.id)
          )
          .map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagSelect(tag)}
              className="px-3 py-1 text-sm border rounded-md hover:bg-accent transition-colors"
              aria-label={`Add tag ${tag.text}`}
            >
              {tag.text}
            </button>
          ))}
      </div>
    </div>
  );
}
