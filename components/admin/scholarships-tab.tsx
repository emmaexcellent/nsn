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
import { ID, Models } from "appwrite";
import SearchBar from "./search";
import ScholarshipForm from "./scholarship-form";
import ScholarshipCard from "./scholarship-card";
import { databaseId, databases } from "@/lib/appwrite";

interface ScholarshipsTabProps {
  scholarships: Models.DefaultDocument[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onScholarshipsChange: (scholarships: Models.DefaultDocument[]) => void;
}

export default function ScholarshipsTab({
  scholarships,
  searchTerm,
  onSearchChange,
  onScholarshipsChange,
}: ScholarshipsTabProps) {
  const [isAddingScholarship, setIsAddingScholarship] = useState(false);
  const [editingScholarship, setEditingScholarship] =
    useState<Models.DefaultDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredScholarships = scholarships.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sponsor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateFormData = (
    data: Models.DataWithoutDocumentKeys
  ) => {
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
      "deadline"
    ];

    for (const field of requiredFields) {
      if (
        !data[field] ||
        (Array.isArray(data[field]) &&
          data[field].some((v: string) => !v.trim()))
      ) {
        return `Please fill in all required fields. Missing or empty: ${field}`;
      }
    }

    if (isNaN(parseInt(data.amount))) {
      return "Amount must be a valid number.";
    }

    return null;
  };

  const handleAddScholarship = async (
    formData: Models.DataWithoutDocumentKeys
  ) => {
    const validationError = validateFormData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const newScholarship = await databases.createDocument(
        databaseId,
        "scholarships",
        ID.unique(),
        { ...formData, amount: parseInt(formData.amount) }
      );
      onScholarshipsChange([...scholarships, newScholarship]);
      setIsAddingScholarship(false);
      setError("");
    } catch (error) {
      console.error("Error adding scholarship:", error);
      setError("Failed to add scholarship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScholarship = async (
    formData: Models.DataWithoutDocumentKeys
  ) => {
    const validationError = validateFormData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const updatedScholarship = await databases.updateDocument(
        databaseId,
        "scholarships",
        editingScholarship!.$id,
        { ...formData, amount: parseInt(formData.amount) }
      );
      const updatedList = scholarships.map((s) =>
        s.$id === updatedScholarship.$id ? updatedScholarship : s
      );
      onScholarshipsChange(updatedList);
      setEditingScholarship(null);
      setError("");
    } catch (error) {
      console.error("Error updating scholarship:", error);
      setError("Failed to update scholarship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    setLoading(true);
    try {
      await databases.deleteDocument(databaseId, "scholarships", id);
      onScholarshipsChange(scholarships.filter((s) => s.$id !== id));
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      setError("Failed to delete scholarship.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar
          placeholder="Search scholarships..."
          value={searchTerm}
          onChange={onSearchChange}
        />
        <Dialog
          open={isAddingScholarship}
          onOpenChange={setIsAddingScholarship}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Scholarship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Scholarship</DialogTitle>
              <DialogDescription>
                Create a new scholarship opportunity
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <ScholarshipForm
              onSubmit={handleAddScholarship}
              isLoading={loading}
              onCancel={() => {
                setIsAddingScholarship(false);
                setError("");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredScholarships &&
          filteredScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.$id}
              scholarship={scholarship}
              onEdit={setEditingScholarship}
              isLoading={loading}
              onDelete={handleDeleteScholarship}
            />
          ))}
      </div>

      <Dialog
        open={!!editingScholarship}
        onOpenChange={() => setEditingScholarship(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Scholarship</DialogTitle>
            <DialogDescription>Update scholarship details</DialogDescription>
          </DialogHeader>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <ScholarshipForm
            initialData={editingScholarship}
            isLoading={loading}
            onSubmit={handleUpdateScholarship}
            onCancel={() => {
              setEditingScholarship(null);
              setError("");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
