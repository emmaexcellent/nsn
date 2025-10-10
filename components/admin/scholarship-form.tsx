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
import { FormFieldProps, FormMultiInputProps, FormTextareaProps } from "./blog/post-form";

interface ScholarshipFormProps {
  isLoading: boolean;
  onSubmit: (data: Models.DataWithoutDocumentKeys) => void;
  onCancel: () => void;
  initialData?: Models.DefaultDocument | null;
}

function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = false,
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
      />
    </div>
  );
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
        Add
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
  const [formData, setFormData] = useState({
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseInt(formData.amount),
    });
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
        />
        <FormField
          label="Sponsor"
          id="sponsor"
          value={formData.sponsor}
          onChange={(value: string) =>
            setFormData({ ...formData, sponsor: value })
          }
          required
        />
        <FormField
          label="Amount ($)"
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(value: string) =>
            setFormData({ ...formData, amount: value })
          }
          required
        />
        <FormField
          label="Location"
          id="location"
          value={formData.location}
          onChange={(value: string) =>
            setFormData({ ...formData, location: value })
          }
          required
        />
        <FormField
          label="Level"
          id="level"
          value={formData.level}
          onChange={(value: string) =>
            setFormData({ ...formData, level: value })
          }
          required
        />
        <FormField
          label="Link"
          id="link"
          type="url"
          value={formData.link}
          onChange={(value: string) =>
            setFormData({ ...formData, link: value })
          }
          required
        />
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STEM">STEM</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
              <SelectItem value="Community Service">
                Community Service
              </SelectItem>
              <SelectItem value="Need-Based">Need-Based</SelectItem>
              <SelectItem value="Merit-Based">Merit-Based</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FormTextarea
        label="Description"
        id="description"
        value={formData.description}
        onChange={(value: string) =>
          setFormData({ ...formData, description: value })
        }
        rows={3}
      />
      <FormTextarea
        label="About"
        id="about"
        value={formData.about}
        onChange={(value: string) => setFormData({ ...formData, about: value })}
        rows={3}
      />
      <FormMultiInput
        label="Eligibility Criteria"
        id="eligibility"
        values={formData.eligibility}
        onChange={(values: string[]) =>
          setFormData({ ...formData, eligibility: values })
        }
      />
      <FormMultiInput
        label="Required Documents"
        id="required"
        values={formData.required}
        onChange={(values: string[]) =>
          setFormData({ ...formData, required: values })
        }
      />
      <FormMultiInput
        label="Tags"
        id="tags"
        values={formData.tags}
        onChange={(values: string[]) =>
          setFormData({ ...formData, tags: values })
        }
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : `${initialData ? "Update" : "Create"} Scholarship`}
        </Button>
      </DialogFooter>
    </form>
  );
}
