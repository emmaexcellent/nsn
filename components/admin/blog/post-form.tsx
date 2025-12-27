"use client"
import { useState, useEffect } from "react";
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


// import MarkdownEditor from "../markdown-editor";

const MarkdownEditor = dynamic(() => import("../markdown-editor"), { ssr: false });

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
}

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
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
}

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
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
}

function FormMultiInput({ label, id, values, onChange }: FormMultiInputProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {values.map((val: string, index: number) => (
        <Input
          key={index}
          value={val}
          onChange={(e) => {
            const updated = [...values];
            updated[index] = e.target.value;
            onChange(updated);
          }}
          className="mb-2"
        />
      ))}
      <Button type="button" onClick={() => onChange([...values, ""])}>
        Add Tag
      </Button>
    </div>
  );
}

export default function BlogPostForm({
  onSubmit,
  isLoading,
  onCancel,
  initialData = null,
}: BlogPostFormProps) {
  const [formData, setFormData] = useState<BlogFormDataType>({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    tags: initialData?.tags || [""],
    imageFile: null,
    imageUrl: initialData?.imageUrl || "",
    imageFileId: initialData?.imageFileId || "",
    slug: initialData?.slug || "",
    author: initialData?.author || "",
    readTime: initialData?.readTime || "",
    status: initialData?.status || "draft",
  });

  useEffect(() => {
    const slugified = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug: slugified }));
  }, [formData.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Title"
          id="title"
          value={formData.title}
          onChange={(value: string) =>
            setFormData({ ...formData, title: value })
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
            setFormData({ ...formData, author: value })
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
            setFormData({ ...formData, readTime: value })
          }
          required
        />
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: string) =>
              setFormData({ ...formData, category: value })
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
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: string) =>
              setFormData({ ...formData, status: value })
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
          setFormData({ ...formData, excerpt: value })
        }
        rows={2}
        placeholder="Brief summary of the post"
        disabled={isLoading}
      />
      <MarkdownEditor
        label="Content (Markdown)"
        value={formData.content}
        onChange={(value: string) =>
          setFormData({ ...formData, content: value })
        }
        required
      />
      <FormMultiInput
        label="Tags"
        id="tags"
        values={formData.tags}
        onChange={(values: string[]) =>
          setFormData({ ...formData, tags: values })
        }
      />

      <div>
        <Label htmlFor="image">Upload Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, imageFile: e.target.files?.[0] || null })
          }
          disabled={isLoading}
        />
        {(formData.imageFile || formData.imageUrl) && (
          <p className="text-sm mt-1">
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src={formData.imageUrl ? formData.imageUrl : URL.createObjectURL(formData.imageFile!)}
              alt="Image Preview"
              className="mt-2 max-h-40 object-cover rounded"
            />
          </p>
        )}
      </div>

      <FormField
        label="Slug (auto-generated)"
        id="slug"
        value={formData.slug}
        onChange={(value: string) => setFormData({ ...formData, slug: value })}
        required
        disabled={true}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Loading..."
            : `${initialData ? "Update" : "Create"} Post`}
        </Button>
      </DialogFooter>
    </form>
  );
}
