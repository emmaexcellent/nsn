import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Models } from "appwrite";
import SearchBar from "./search";
import ScholarshipForm from "./scholarship-form";
import ScholarshipCard from "./scholarship-card";
import { apiRequest } from "@/lib/api-client";

interface ScholarshipsTabProps {
  scholarships: Models.Document[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onScholarshipsChange: (scholarships: Models.Document[]) => void;
}

export default function ScholarshipsTab({
  scholarships,
  searchTerm,
  onSearchChange,
  onScholarshipsChange,
}: ScholarshipsTabProps) {
  const [isAddingScholarship, setIsAddingScholarship] = useState(false);
  const [editingScholarship, setEditingScholarship] =
    useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const filteredScholarships = scholarships.filter(
    (scholarship) =>
      scholarship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.sponsor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateFormData = (data: Partial<Models.Document>) => {
    const requiredFields = [
      "title",
      "description",
      "about",
      "amount",
      "location",
      "level",
      "eligibility",
      "required",
      "tags",
      "link",
      "sponsor",
      "category",
      "deadline",
    ];

    for (const field of requiredFields) {
      if (
        !data[field] ||
        (Array.isArray(data[field]) &&
          data[field].some((value: string) => !value.trim()))
      ) {
        return `Please fill in all required fields. Missing or empty: ${field}`;
      }
    }

    if (Number.isNaN(Number(data.amount))) {
      return "Amount must be a valid number.";
    }

    return null;
  };

  const toFormData = (formData: Partial<Models.Document>) => {
    if (formData.imageFile instanceof File) {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(formData.imageFile.type)) {
        throw new Error(
          "Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF)."
        );
      }

      if (formData.imageFile.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }
    }

    const payload = new FormData();
    payload.append("title", String(formData.title || ""));
    payload.append("description", String(formData.description || ""));
    payload.append("about", String(formData.about || ""));
    payload.append("amount", String(formData.amount || ""));
    payload.append("location", String(formData.location || ""));
    payload.append("level", String(formData.level || ""));
    payload.append(
      "eligibility",
      JSON.stringify(
        Array.isArray(formData.eligibility) ? formData.eligibility : []
      )
    );
    payload.append(
      "required",
      JSON.stringify(Array.isArray(formData.required) ? formData.required : [])
    );
    payload.append(
      "tags",
      JSON.stringify(Array.isArray(formData.tags) ? formData.tags : [])
    );
    payload.append("link", String(formData.link || ""));
    payload.append("sponsor", String(formData.sponsor || ""));
    payload.append("category", String(formData.category || ""));
    payload.append("deadline", String(formData.deadline || ""));
    payload.append("imageUrl", String(formData.imageUrl || ""));
    payload.append("imageFileId", String(formData.imageFileId || ""));
    payload.append("currency", String(formData.currency || "USD"));
    payload.append("status", String(formData.status || "active"));

    if (formData.imageFile instanceof File) {
      payload.append("imageFile", formData.imageFile);
    }

    return payload;
  };

  const resetMessages = () => {
    setError("");
    setStatusMessage("");
  };

  const handleAddScholarship = async (formData: Partial<Models.Document>) => {
    const validationError = validateFormData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setStatusMessage("");
    try {
      const newScholarship = await apiRequest<Models.Document>(
        "/api/admin/scholarships",
        {
          method: "POST",
          body: toFormData(formData),
        }
      );

      onScholarshipsChange([newScholarship, ...scholarships]);
      setIsAddingScholarship(false);
      setError("");
      setStatusMessage("Scholarship created successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to add scholarship. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScholarship = async (formData: Partial<Models.Document>) => {
    const validationError = validateFormData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!editingScholarship) {
      return;
    }

    setLoading(true);
    setStatusMessage("");
    try {
      const updatedScholarship = await apiRequest<Models.Document>(
        `/api/admin/scholarships/${editingScholarship.$id}`,
        {
          method: "PATCH",
          body: toFormData(formData),
        }
      );

      onScholarshipsChange(
        scholarships.map((scholarship) =>
          scholarship.$id === updatedScholarship.$id
            ? updatedScholarship
            : scholarship
        )
      );
      setEditingScholarship(null);
      setError("");
      setStatusMessage("Scholarship updated successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update scholarship. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    setLoading(true);
    setStatusMessage("");
    try {
      await apiRequest(`/api/admin/scholarships/${id}`, {
        method: "DELETE",
      });

      onScholarshipsChange(
        scholarships.filter((scholarship) => scholarship.$id !== id)
      );
      setError("");
      setStatusMessage("Scholarship deleted successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete scholarship."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Search scholarships..."
          value={searchTerm}
          onChange={onSearchChange}
        />
        <Dialog
          open={isAddingScholarship}
          onOpenChange={(open) => {
            setIsAddingScholarship(open);
            if (!open) resetMessages();
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Scholarship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Scholarship</DialogTitle>
              <DialogDescription>
                Create a new scholarship opportunity.
              </DialogDescription>
            </DialogHeader>
            <ScholarshipForm
              onSubmit={handleAddScholarship}
              isLoading={loading}
              onCancel={() => {
                setIsAddingScholarship(false);
                resetMessages();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {statusMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{filteredScholarships.length} scholarships</span>
        {searchTerm ? <span>Filtered by &quot;{searchTerm}&quot;</span> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredScholarships.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.$id}
            scholarship={scholarship}
            onEdit={setEditingScholarship}
            isLoading={loading}
            onDelete={handleDeleteScholarship}
          />
        ))}
      </div>

      {filteredScholarships.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
          No scholarships match the current search.
        </div>
      ) : null}

      <Dialog
        open={!!editingScholarship}
        onOpenChange={(open) => {
          if (!open) {
            setEditingScholarship(null);
            resetMessages();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Scholarship</DialogTitle>
            <DialogDescription>Update scholarship details.</DialogDescription>
          </DialogHeader>
          <ScholarshipForm
            initialData={editingScholarship}
            isLoading={loading}
            onSubmit={handleUpdateScholarship}
            onCancel={() => {
              setEditingScholarship(null);
              resetMessages();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
