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
import useBlogPostActions from "./blog/submit-blog";

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

  const {uploadImage,deleteImage} = useBlogPostActions()

  const filteredScholarships = scholarships.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sponsor?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddScholarship = async (formData: Partial<Models.Document>) => {
    const validationError = validateFormData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    try {
      if (formData.imageFile) {
        const uploadResult = await uploadImage(formData.imageFile);
        formData.imageUrl = uploadResult.imageUrl;
        formData.imageFileId = uploadResult.fileId;
      }

      const { imageFile, ...rest } = formData;

      const newScholarship = await databases.createDocument(
        databaseId,
        "scholarships",
        ID.unique(),
        { ...rest, amount: parseInt(formData.amount) }
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
    formData: Partial<Models.Document>
  ) => {
    const validationError = validateFormData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      let oldImageFileId = formData.imageFileId;

      // Handle image update
      if (formData.imageFile) {
        try {
          const uploadResult = await uploadImage(formData.imageFile);
          formData.imageUrl = uploadResult.imageUrl;
          formData.imageFileId = uploadResult.fileId;

          // Delete old image if it exists
          if (oldImageFileId && oldImageFileId !== formData.imageFileId) {
            await deleteImage(oldImageFileId);
          }
        } catch (err) {
          setError("Failed to upload new image. Please try again.");
          return null;
        }
      }

      const { imageFile, ...rest } = formData;

      const updatedScholarship = await databases.updateDocument(
        databaseId,
        "scholarships",
        editingScholarship!.$id,
        { ...rest, amount: parseInt(formData.amount) }
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
      // Fetch scholarship document
      const { imageFileId = "" } = await databases.getDocument(
        databaseId,
        "scholarships",
        id
      );

      // Delete image if it exists (run in parallel with document deletion)
      const deleteImagePromise = imageFileId
        ? deleteImage(imageFileId)
        : Promise.resolve();

      const deleteDocPromise = databases.deleteDocument(
        databaseId,
        "scholarships",
        id
      );

      // Run both deletions concurrently for efficiency
      await Promise.all([deleteImagePromise, deleteDocPromise]);

      // Update state after successful deletion
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
          <DialogContent className="max-w-3xl">
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
        <DialogContent className="max-w-3xl">
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
