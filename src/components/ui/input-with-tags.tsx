"use client";

import { Tag } from "@/types/todo"; // Importieren Sie Tag von Ihrer todo.ts
import { Label } from "@/components/ui/label";
import { X } from "lucide-react"; // Für das X-Icon
import { useState, useEffect } from "react";

interface InputWithTagsProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  label?: string;
}

export default function InputWithTags({
  selectedTags,
  onTagsChange,
  label = "Tags",
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

  // Funktion zum Hinzufügen eines Tags
  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some((selected) => selected.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  // Funktion zum Entfernen eines Tags
  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="tags-input">{label}</Label>
        <div className="mt-1 flex flex-wrap gap-2 p-2 border rounded-lg min-h-[2.5rem]">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md text-sm"
            >
              {tag.text}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:text-destructive"
              >
                <X size={14} />
              </button>
            </span>
          ))}
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
            >
              {tag.text}
            </button>
          ))}
      </div>
    </div>
  );
}
