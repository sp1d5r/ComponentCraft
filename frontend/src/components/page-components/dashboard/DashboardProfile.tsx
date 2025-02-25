import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../shadcn/button';
import { Input } from '../../shadcn/input';
import { Label } from '../../shadcn/label';
import { Switch } from '../../shadcn/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shadcn/select';
import { useToast } from '../../../contexts/ToastProvider';
import { useProfile } from '../../../contexts/ProfileProvider';
import { useApi } from '../../../contexts/ApiContext';

const DashboardProfile = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profile!);

  if (!profile) return null;

  return (
    <div className="max-w-4xl space-y-12">
      {/* General Section */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">General</h2>
        
        {/* Appearance */}
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-gray-200 dark:border-neutral-800 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black dark:text-white">Appearance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Set your preferred theme for ComponentCraft
              </p>
            </div>
            <Select defaultValue="dark">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-gray-200 dark:border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black dark:text-white">Language</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Set your preferred language for ComponentCraft's interface
              </p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">Account</h2>
        
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-gray-200 dark:border-neutral-800 p-6 space-y-6">
          {/* Profile Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-black dark:text-white">Profile Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update your account's profile information
                </p>
              </div>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={editedData.displayName}
                      onChange={(e) => setEditedData({...editedData, displayName: e.target.value})}
                      className="bg-gray-50 dark:bg-neutral-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setIsEditing(false);
                    toast({
                      title: "Profile Updated",
                      description: "Your changes have been saved successfully.",
                    });
                  }}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Display Name</Label>
                  <p className="mt-1 text-black dark:text-white">{profile.displayName}</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Data Usage */}
          <div className="pt-6 border-t border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-black dark:text-white">AI Data Usage</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Allow us to use your search data to improve our AI models
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-xl font-semibold text-red-600 mb-6">Danger Zone</h2>
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-red-200 dark:border-red-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-600">Delete Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardProfile;