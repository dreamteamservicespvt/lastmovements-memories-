import React, { useState } from "react";
import { RegistrationData } from "../../firebase/firestoreUtils";
import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import EditRegistrationModal from "./EditRegistrationModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface RegistrationTableProps {
  registrations: (RegistrationData & { id: string })[];
  isLoading: boolean;
  onViewReceipt: (url: string) => void;
  onEditRegistration: (id: string, data: Partial<RegistrationData>) => Promise<void>;
  onDeleteRegistration: (id: string) => Promise<void>;
}

const RegistrationTable: React.FC<RegistrationTableProps> = ({
  registrations,
  isLoading,
  onViewReceipt,
  onEditRegistration,
  onDeleteRegistration,
}) => {
  const [editingRegistration, setEditingRegistration] = useState<(RegistrationData & { id: string }) | null>(null);
  const [deletingRegistration, setDeletingRegistration] = useState<(RegistrationData & { id: string }) | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-party-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto mb-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-xl">No registrations found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Roll Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Receipt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {registrations.map((registration) => (
            <tr 
              key={registration.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-party-pink">
                {registration.registrationId || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {registration.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {registration.year}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {registration.rollNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {registration.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {registration.receiptUrl ? (
                  <button
                    onClick={() => onViewReceipt(registration.receiptUrl!)}
                    className="text-party-pink hover:text-party-pink-light underline flex items-center"
                  >
                    View
                  </button>
                ) : (
                  <span className="text-gray-500">Not uploaded</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingRegistration(registration)}
                >
                  <Pen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingRegistration(registration)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditRegistrationModal
        registration={editingRegistration}
        isOpen={!!editingRegistration}
        onClose={() => setEditingRegistration(null)}
        onSave={onEditRegistration}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingRegistration}
        onClose={() => setDeletingRegistration(null)}
        onConfirm={async () => {
          if (deletingRegistration) {
            await onDeleteRegistration(deletingRegistration.id);
            setDeletingRegistration(null);
          }
        }}
        registrationName={deletingRegistration?.name || ""}
      />
    </div>
  );
};

export default RegistrationTable;
