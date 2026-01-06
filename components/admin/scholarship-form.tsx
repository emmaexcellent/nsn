import { useState } from "react";
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
import {
  FormFieldProps,
  FormMultiInputProps,
  FormTextareaProps,
} from "./blog/post-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";


export interface ScholarshipFormData {
  title: string;
  description: string;
  about: string;
  amount: string;
  location: string;
  level: string;
  eligibility: string[];  
  required: string[];     
  tags: string[];         
  link: string;
  sponsor: string;
  category: string;
  deadline: string;
  imageFile: File | null;
  imageUrl: string;
  imageFileId: string;
}


interface ScholarshipFormProps {
  isLoading: boolean;
  onSubmit: (data: Partial<Models.Document>) => void;
  onCancel: () => void;
  initialData?: Models.Document | null;
}

function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  description,
}: FormFieldProps & { placeholder?: string; description?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function FormTextarea({
  label,
  id,
  value,
  onChange,
  rows,
  required = false,
  placeholder,
  description,
}: FormTextareaProps & { placeholder?: string; description?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function FormMultiInput({
  label,
  id,
  values,
  onChange,
  placeholder = "Add item...",
  description,
}: FormMultiInputProps & { placeholder?: string; description?: string }) {
  const addItem = () => {
    onChange([...values, ""]);
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...values];
    updated[index] = value;
    onChange(updated);
  };

  const removeItem = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated.length ? updated : [""]);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <div className="space-y-2">
        {values.map((val: string, index: number) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              value={val}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="h-9 w-9 text-gray-500 hover:text-red-500"
              disabled={values.length <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another
      </Button>
    </div>
  );
}

export default function ScholarshipForm({
  isLoading,
  onSubmit,
  onCancel,
  initialData = null,
}: ScholarshipFormProps) {
  const [formData, setFormData] = useState<ScholarshipFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    about: initialData?.about || "",
    amount: initialData?.amount || "",
    location: initialData?.location || "",
    level: initialData?.level || "",
    eligibility: initialData?.eligibility || [""],
    required: initialData?.required || [""],
    tags: initialData?.tags || [""],
    link: initialData?.link || "",
    sponsor: initialData?.sponsor || "",
    category: initialData?.category || "",
    deadline: initialData?.deadline || "",
    imageFile: null,
    imageUrl: initialData?.imageUrl || "",
    imageFileId: initialData?.imageFileId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      amount: parseInt(formData.amount) || 0,
      eligibility: formData.eligibility.filter((item: string) => item.trim() !== ""),
      required: formData.required.filter((item: string) => item.trim() !== ""),
      tags: formData.tags.filter((item: string) => item.trim() !== ""),
    };
    onSubmit(cleanedData);
  };

  // Predefined tag suggestions
  const tagSuggestions = [
    "Undergraduate",
    "Graduate",
    "International",
    "Domestic",
    "STEM",
    "Arts",
    "Sports",
    "Leadership",
    "Need-Based",
    "Merit-Based",
    "Women",
    "Minority",
    "Research",
    "Internship",
  ];

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags.filter((t: string) => t.trim() !== ""), tag],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Card */}
        <div className="md:col-span-2 p-0">
          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Scholarship Title"
                id="title"
                value={formData.title}
                onChange={(value: string) =>
                  setFormData({ ...formData, title: value })
                }
                placeholder="e.g., Presidential Leadership Scholarship"
                required
                description="Clear, descriptive title for the scholarship"
              />

              <FormField
                label="Sponsoring Organization"
                id="sponsor"
                value={formData.sponsor}
                onChange={(value: string) =>
                  setFormData({ ...formData, sponsor: value })
                }
                placeholder="e.g., Google, University of XYZ"
                required
                description="Organization offering the scholarship"
              />

              <FormField
                label="Amount ($)"
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(value: string) =>
                  setFormData({ ...formData, amount: value })
                }
                placeholder="5000"
                required
                description="Scholarship amount in USD"
              />

              <FormField
                label="Location"
                id="location"
                value={formData.location}
                onChange={(value: string) =>
                  setFormData({ ...formData, location: value })
                }
                placeholder="e.g., United States, Online, Canada"
                required
              />

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STEM">
                      STEM (Science, Technology, Engineering, Math)
                    </SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Arts">Arts & Humanities</SelectItem>
                    <SelectItem value="Community Service">
                      Community Service
                    </SelectItem>
                    <SelectItem value="Need-Based">Need-Based</SelectItem>
                    <SelectItem value="Merit-Based">Merit-Based</SelectItem>
                    <SelectItem value="Sports">Sports & Athletics</SelectItem>
                    <SelectItem value="Minority">
                      Minority & Diversity
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Education Level
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="PhD">PhD/Doctoral</SelectItem>
                    <SelectItem value="All Levels">
                      All Education Levels
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormField
                label="Application Link"
                id="link"
                type="url"
                value={formData.link}
                onChange={(value: string) =>
                  setFormData({ ...formData, link: value })
                }
                placeholder="https://example.com/apply"
                required
                description="URL to the official application page"
              />

              <FormField
                label="Application Deadline"
                id="deadline"
                type="date"
                value={
                  formData.deadline
                    ? new Date(formData.deadline).toISOString().split("T")[0]
                    : ""
                }
                onChange={(value: string) =>
                  setFormData({ ...formData, deadline: value })
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Description & About Card */}
        <div>
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <FormTextarea
              label=""
              id="description"
              value={formData.description}
              onChange={(value: string) =>
                setFormData({ ...formData, description: value })
              }
              rows={5}
              placeholder="Brief overview of the scholarship, its purpose, and what makes it unique..."
              description="This will appear in search results and lists"
            />

            <FormTextarea
              label="About the Scholarship"
              id="about"
              value={formData.about}
              onChange={(value: string) =>
                setFormData({ ...formData, about: value })
              }
              rows={5}
              placeholder="Detailed information about the scholarship, benefits, selection process..."
              description="Detailed description that appears on the scholarship page"
            />
          </div>
        </div>

        {/* Requirements & Tags Card */}
        <div>
          <div className="pt-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Requirements & Tags
            </h3>

            <FormMultiInput
              label="Eligibility Criteria"
              id="eligibility"
              values={formData.eligibility}
              onChange={(values: string[]) =>
                setFormData({ ...formData, eligibility: values })
              }
              placeholder="e.g., Minimum 3.0 GPA, U.S. citizenship"
              description="List specific requirements applicants must meet"
            />

            <FormMultiInput
              label="Required Documents"
              id="required"
              values={formData.required}
              onChange={(values: string[]) =>
                setFormData({ ...formData, required: values })
              }
              placeholder="e.g., Transcript, Letter of recommendation"
              description="Documents needed for application"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Tags</Label>
        <p className="text-xs text-gray-500">
          Add tags to help students find this scholarship. Click suggestions to
          add.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {tagSuggestions.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => addTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {formData.tags.map(
            (tag: string, index: number) =>
              tag.trim() && (
                <div key={index} className="flex gap-2 items-center">
                  <Badge className="flex-1 justify-between">
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.tags];
                        updated.splice(index, 1);
                        setFormData({ ...formData, tags: updated });
                      }}
                      className="ml-2 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
              )
          )}
        </div>

        <Input
          placeholder="Type custom tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const input = e.currentTarget;
              const newTag = input.value.trim();
              if (newTag && !formData.tags.includes(newTag)) {
                setFormData({
                  ...formData,
                  tags: [
                    ...formData.tags.filter((t: string) => t.trim() !== ""),
                    newTag,
                  ],
                });
              }
              input.value = "";
            }
          }}
        />
      </div>

      <div>
        <Label htmlFor="image">Upload Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({
              ...formData,
              imageFile: e.target.files?.[0] || null,
            })
          }
          disabled={isLoading}
        />
        {(formData.imageFile || formData.imageUrl) && (
          <p className="text-sm mt-1">
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src={
                formData.imageFile
                  ? URL.createObjectURL(formData.imageFile!)
                  : formData.imageUrl
              }
              alt="Image Preview"
              className="mt-2 max-h-40 object-cover rounded border"
            />
          </p>
        )}
      </div>

      <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
        <div className="flex justify-between w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              `${initialData ? "Update" : "Create"} Scholarship`
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
