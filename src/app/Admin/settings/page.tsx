"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Save, Bell, Shield, Database, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoApproval, setAutoApproval] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-shark-900 font-secondary">Admin Settings</h1>
        <p className="text-shark-600 font-primary">Configure platform settings and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-shark-900 font-secondary">Notification Settings</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-shark-900 font-primary">Email Notifications</h4>
                  <p className="text-sm text-shark-600 font-primary">Receive admin alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-verdant-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verdant-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-shark-900 font-primary">Push Notifications</h4>
                  <p className="text-sm text-shark-600 font-primary">Real-time browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-verdant-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verdant-600"></div>
                </label>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-shark-900 font-secondary">Security Settings</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-shark-900 font-primary">Auto-approve Organizations</h4>
                  <p className="text-sm text-shark-600 font-primary">Automatically approve new organization registrations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoApproval}
                    onChange={(e) => setAutoApproval(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-verdant-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verdant-600"></div>
                </label>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Database className="text-purple-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-shark-900 font-secondary">System Settings</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-shark-900 font-primary">Maintenance Mode</h4>
                  <p className="text-sm text-shark-600 font-primary">Put the platform in maintenance mode</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-shark-900 font-primary mb-2">Database Actions</h4>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Backup Database
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
                    Clear Cache
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                    Reset Statistics
                  </button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Platform Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Globe className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-shark-900 font-secondary">Platform Information</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-shark-900 font-primary">Version</h4>
                <p className="text-sm text-shark-600 font-primary">v1.2.0</p>
              </div>
              <div>
                <h4 className="font-medium text-shark-900 font-primary">Last Updated</h4>
                <p className="text-sm text-shark-600 font-primary">August 4, 2025</p>
              </div>
              <div>
                <h4 className="font-medium text-shark-900 font-primary">Server Status</h4>
                <p className="text-sm text-green-600 font-primary">● Online</p>
              </div>
              <div>
                <h4 className="font-medium text-shark-900 font-primary">Uptime</h4>
                <p className="text-sm text-shark-600 font-primary">15 days, 4 hours</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-verdant-600 text-white font-medium rounded-lg hover:bg-verdant-700 transition-colors"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
