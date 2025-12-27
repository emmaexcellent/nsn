"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ID, Models } from "appwrite";
import { databaseId, databases } from "@/lib/appwrite";
import { useAuth } from "@/context/auth";

export default function ConfirmScholarshipApplication() {
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState<Models.Document | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const recent_scholarship = localStorage.getItem(
      "recent_applied_scholarship"
    );
    if (recent_scholarship) {
      const scholarship_data = JSON.parse(recent_scholarship);
      setScholarship(scholarship_data);
      setShowDialog(true);
    }
  }, []);

  const handleConfirm = async () => {
    if (!user) {
      alert("Please log in to confirm your application.");
      return;
    }
    if (!scholarship || !user || !user?.$id) return;

    setLoading(true);
    try {
      await databases.createDocument(
        databaseId,
        "saved_scholarships",
        ID.unique(),
        {
          profile: user.$id,
          scholarship: scholarship.$id,
          action: "apply",
        }
      );
      localStorage.removeItem("recent_applied_scholarship");
      setShowDialog(false);
    } catch (error) {
      console.error("Failed to confirm application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("recent_applied_scholarship");
    setShowDialog(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="!rounded">
        <DialogHeader>
          <DialogTitle>Confirm Application</DialogTitle>
        </DialogHeader>
        <p>
          Did you just apply for <strong>{scholarship?.title}</strong>?
        </p>
        <DialogFooter className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            No
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Confirming..." : "Yes, Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
