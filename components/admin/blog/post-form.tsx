"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Models } from "appwrite";
import dynamic from "next/dynamic";
import { Loader2, Plus, X } from "lucide-react";

const MarkdownEditor = dynamic(() => import("../markdown-editor"), {
  ssr: false,
});

interface BlogPostFormProps {
  onSubmit: (data: BlogFormDataType) => void;
  isLoading: boolean;
  onCancel: () => void;
  initialData?: Models.Document | null;
}

export interface BlogFormDataType {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  imageFile: File | null;
  imageUrl: string;
  imageFileId?: string;
  slug: string;
  author: string;
  readTime: string;
  status: string;
}

export type FormFieldProps = {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

export type FormTextareaProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

function FormTextarea({
  label,
  id,
  value,
  onChange,
  rows,
  required = false,
  placeholder,
  disabled = false,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

export type FormMultiInputProps = {
  label: string;
  id: string;
  values: string[];
  onChange: (values: string[]) => void;
};

function FormMultiInput({ label, id, values, onChange }: FormMultiInputProps) {
  const safeValues = values.length > 0 ? values : [""];

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>{label}</Label>
      {safeValues.map((value: string, index: number) => (
        <div key={`${id}-${index}`} className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(event) => {
              const updated = [...safeValues];
              updated[index] = event.target.value;
              onChange(updated);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              onChange(safeValues.filter((_, itemIndex) => itemIndex !== index))
            }
            disabled={safeValues.length === 1}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...safeValues, ""])}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Tag
      </Button>
    </div>
  );
}

const createInitialFormData = (
  initialData: Models.Document | null | undefined
): BlogFormDataType => ({
  title: initialData?.title || "",
  excerpt: initialData?.excerpt || "",
  content: initialData?.content || "",
  category: initialData?.category || "",
  tags: Array.isArray(initialData?.tags) ? initialData.tags : [""],
  imageFile: null,
  imageUrl: initialData?.imageUrl || "",
  imageFileId: initialData?.imageFileId || "",
  slug: initialData?.slug || "",
  author: initialData?.author || "",
  readTime:
    typeof initialData?.readTime === "number"
      ? String(initialData.readTime)
      : initialData?.readTime || "",
  status: initialData?.status || "draft",
});

export default function BlogPostForm({
  onSubmit,
  isLoading,
  onCancel,
  initialData = null,
}: BlogPostFormProps) {
  const [formData, setFormData] = useState<BlogFormDataType>(
    createInitialFormData(initialData)
  );

  useEffect(() => {
    setFormData(createInitialFormData(initialData));
  }, [initialData]);

  useEffect(() => {
    const slugified = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData((prev) =>
      prev.slug === slugified ? prev : { ...prev, slug: slugified }
    );
  }, [formData.title]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.filter((tag) => tag.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Title"
          id="title"
          value={formData.title}
          onChange={(value: string) =>
            setFormData((prev) => ({ ...prev, title: value }))
          }
          required
          disabled={isLoading}
        />
        <FormField
          disabled={isLoading}
          label="Author Name"
          id="author"
          value={formData.author}
          onChange={(value: string) =>
            setFormData((prev) => ({ ...prev, author: value }))
          }
          required
        />
        <FormField
          disabled={isLoading}
          label="Read Time (mins)"
          id="readTime"
          type="number"
          value={formData.readTime}
          onChange={(value: string) =>
            setFormData((prev) => ({ ...prev, readTime: value }))
          }
          required
        />
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: string) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Application Tips">Application Tips</SelectItem>
              <SelectItem value="Financial Aid">Financial Aid</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="STEM">STEM</SelectItem>
              <SelectItem value="Success Stories">Success Stories</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: string) =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FormTextarea
        label="Excerpt"
        id="excerpt"
        value={formData.excerpt}
        onChange={(value: string) =>
          setFormData((prev) => ({ ...prev, excerpt: value }))
        }
        rows={3}
        placeholder="Brief summary of the post"
        disabled={isLoading}
      />

      <MarkdownEditor
        label="Content (Markdown)"
        value={formData.content}
        onChange={(value: string) =>
          setFormData((prev) => ({ ...prev, content: value }))
        }
        required
      />

      <FormMultiInput
        label="Tags"
        id="tags"
        values={formData.tags}
        onChange={(values: string[]) =>
          setFormData((prev) => ({ ...prev, tags: values }))
        }
      />

      <div className="space-y-2">
        <Label htmlFor="image">Upload Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              imageFile: event.target.files?.[0] || null,
            }))
          }
          disabled={isLoading}
        />
        {(formData.imageFile || formData.imageUrl) && (
          <>
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src={
                formData.imageFile
                  ? URL.createObjectURL(formData.imageFile)
                  : formData.imageUrl
              }
              alt="Blog cover preview"
              className="mt-2 max-h-40 rounded border object-cover"
            />
          </>
        )}
      </div>

      <FormField
        label="Slug"
        id="slug"
        value={formData.slug}
        onChange={(value: string) =>
          setFormData((prev) => ({ ...prev, slug: value }))
        }
        required
        disabled
      />

      <DialogFooter className="sticky bottom-0 border-t bg-background pt-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="sm:min-w-36">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : initialData ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
