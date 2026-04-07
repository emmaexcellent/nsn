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
import {
  FormFieldProps,
  FormMultiInputProps,
  FormTextareaProps,
} from "./blog/post-form";
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
  currency: string;
  status: string;
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
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      {description ? <p className="text-xs text-gray-500">{description}</p> : null}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      {description ? <p className="text-xs text-gray-500">{description}</p> : null}
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
  const safeValues = values.length > 0 ? values : [""];

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {description ? <p className="mt-1 text-xs text-gray-500">{description}</p> : null}
      </div>

      <div className="space-y-2">
        {safeValues.map((value: string, index: number) => (
          <div key={`${id}-${index}`} className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(event) => {
                const updated = [...safeValues];
                updated[index] = event.target.value;
                onChange(updated);
              }}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                onChange(safeValues.filter((_, itemIndex) => itemIndex !== index))
              }
              className="h-9 w-9 text-gray-500 hover:text-red-500"
              disabled={safeValues.length <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...safeValues, ""])}>
        <Plus className="mr-2 h-4 w-4" />
        Add Another
      </Button>
    </div>
  );
}

const createInitialFormData = (
  initialData: Models.Document | null | undefined
): ScholarshipFormData => ({
  title: initialData?.title || "",
  description: initialData?.description || "",
  about: initialData?.about || "",
  amount:
    typeof initialData?.amount === "number"
      ? String(initialData.amount)
      : initialData?.amount || "",
  location: initialData?.location || "",
  level: initialData?.level || "",
  eligibility: Array.isArray(initialData?.eligibility)
    ? initialData.eligibility
    : [""],
  required: Array.isArray(initialData?.required) ? initialData.required : [""],
  tags: Array.isArray(initialData?.tags) ? initialData.tags : [""],
  link: initialData?.link || "",
  sponsor: initialData?.sponsor || "",
  category: initialData?.category || "",
  deadline: initialData?.deadline || "",
  imageFile: null,
  imageUrl: initialData?.imageUrl || "",
  imageFileId: initialData?.imageFileId || "",
  currency: initialData?.currency || "USD",
  status: initialData?.status || "active",
});

export default function ScholarshipForm({
  isLoading,
  onSubmit,
  onCancel,
  initialData = null,
}: ScholarshipFormProps) {
  const [formData, setFormData] = useState<ScholarshipFormData>(
    createInitialFormData(initialData)
  );

  useEffect(() => {
    setFormData(createInitialFormData(initialData));
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      amount: Number.parseInt(formData.amount, 10) || 0,
      eligibility: formData.eligibility.filter((item) => item.trim() !== ""),
      required: formData.required.filter((item) => item.trim() !== ""),
      tags: formData.tags.filter((item) => item.trim() !== ""),
    });
  };

  const tagSuggestions = [
    "featured",
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
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags.filter((value) => value.trim() !== ""), tag],
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <div className="pt-2">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Scholarship Title"
                id="title"
                value={formData.title}
                onChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, title: value }))
                }
                placeholder="e.g., Presidential Leadership Scholarship"
                required
                description="Clear, descriptive title for the scholarship."
              />

              <FormField
                label="Sponsoring Organization"
                id="sponsor"
                value={formData.sponsor}
                onChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, sponsor: value }))
                }
                placeholder="e.g., Google, University of XYZ"
                required
                description="Organization offering the scholarship."
              />

              <FormField
                label="Amount"
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, amount: value }))
                }
                placeholder="5000"
                required
                description="Scholarship amount."
              />

              <FormField
                label="Location"
                id="location"
                value={formData.location}
                onChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, location: value }))
                }
                placeholder="e.g., Nigeria, Remote, Canada"
                required
              />

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STEM">STEM</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Arts">Arts & Humanities</SelectItem>
                    <SelectItem value="Community Service">
                      Community Service
                    </SelectItem>
                    <SelectItem value="Need-Based">Need-Based</SelectItem>
                    <SelectItem value="Merit-Based">Merit-Based</SelectItem>
                    <SelectItem value="Sports">Sports & Athletics</SelectItem>
                    <SelectItem value="Minority">Minority & Diversity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Education Level
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, level: value }))
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
                    <SelectItem value="All Levels">All Education Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormField
                label="Application Link"
                id="link"
                type="url"
                value={formData.link}
                onChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, link: value }))
                }
                placeholder="https://example.com/apply"
                required
                description="URL to the official application page."
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
                  setFormData((prev) => ({ ...prev, deadline: value }))
                }
                required
              />

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  Currency
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, currency: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Description</h3>
          <FormTextarea
            label="Short Description"
            id="description"
            value={formData.description}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            rows={5}
            required
            placeholder="Brief overview of the scholarship."
            description="This appears in search results and cards."
          />

          <FormTextarea
            label="About the Scholarship"
            id="about"
            value={formData.about}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, about: value }))
            }
            rows={7}
            required
            placeholder="Detailed information about the scholarship."
            description="This appears on the scholarship detail page."
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Requirements & Tags
          </h3>

          <FormMultiInput
            label="Eligibility Criteria"
            id="eligibility"
            values={formData.eligibility}
            onChange={(values: string[]) =>
              setFormData((prev) => ({ ...prev, eligibility: values }))
            }
            placeholder="e.g., Minimum 3.0 GPA"
            description="List the requirements applicants must meet."
          />

          <FormMultiInput
            label="Required Documents"
            id="required"
            values={formData.required}
            onChange={(values: string[]) =>
              setFormData((prev) => ({ ...prev, required: values }))
            }
            placeholder="e.g., Transcript"
            description="Documents needed for application."
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Tags</Label>
        <p className="text-xs text-gray-500">
          Add tags to help students find this scholarship quickly.
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          {tagSuggestions.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={() => addTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {formData.tags
            .filter((tag) => tag.trim())
            .map((tag: string, index: number) => (
              <Badge key={`${tag}-${index}`} className="flex items-center gap-2">
                {tag}
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((_, tagIndex) => tagIndex !== index),
                    }));
                  }}
                  className="hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
        </div>

        <Input
          placeholder="Type a custom tag and press Enter"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const input = event.currentTarget;
              const newTag = input.value.trim();
              if (newTag && !formData.tags.includes(newTag)) {
                setFormData((prev) => ({
                  ...prev,
                  tags: [...prev.tags.filter((tag) => tag.trim()), newTag],
                }));
              }
              input.value = "";
            }
          }}
        />
      </div>

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
              alt="Scholarship preview"
              className="mt-2 max-h-40 rounded border object-cover"
            />
          </>
        )}
      </div>

      <DialogFooter className="sticky bg-white bottom-0 border-t bg-background pt-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="sm:min-w-40">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : initialData ? (
              "Update Scholarship"
            ) : (
              "Create Scholarship"
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
