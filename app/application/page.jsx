"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  User,
  Briefcase,
  DollarSign,
  CreditCard,
  Home,
  Shield,
  Clock,
  Upload,
  Check,
  X,
  Save,
} from "lucide-react";
import UlizaChatbot from "@/components/UlizaChatbot";

const STORAGE_KEY = "mortgage_application_data";
const MAX_FILE_SIZE_FOR_STORAGE = 2 * 1024 * 1024; // 2 MB per document

const createInitialFormData = () => ({
  personal: {
    fullName: "",
    dateOfBirth: "",
    ssn: "",
    maritalStatus: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  },
  employment: {
    employerName: "",
    position: "",
    lengthOfEmployment: "",
    phoneNumber: "",
    annualIncome: "",
    employmentType: "",
  },
  assets: {
    checkingBalance: "",
    savingsBalance: "",
    retirementAccounts: "",
    stocksBonds: "",
    downPaymentSource: "",
  },
  debts: {
    rentMortgage: "",
    autoLoans: "",
    studentLoans: "",
    creditCardDebt: "",
    otherLoans: "",
  },
  property: {
    propertyAddress: "",
    propertyCity: "",
    propertyState: "",
    propertyZip: "",
    purchasePrice: "",
    loanAmount: "",
    downPayment: "",
    loanType: "",
    loanTerm: "",
  },
  disclosures: {
    creditAuthorization: false,
    loanEstimateAck: false,
    appraisalRights: false,
    privacyNotices: false,
    californiaPerDiem: false,
  },
});

export default function MortgageOrigination() {
  const [currentTab, setCurrentTab] = useState("personal");
  const [applicationProgress, setApplicationProgress] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [saveStatus, setSaveStatus] = useState(""); // "saved", "saving", ""
  const [saveError, setSaveError] = useState("");

  const hasHydratedRef = useRef(false);
  const skipDocAutoSaveRef = useRef(false);
  
  // Form data state
  const [formData, setFormData] = useState(createInitialFormData);

  // Helper function to convert File to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Helper function to convert base64 back to File
  const base64ToFile = (base64String, fileName, mimeType) => {
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });
  };

  // Load saved data on mount
  useEffect(() => {
    setSaveError("");
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.formData) {
          setFormData(parsed.formData);
        }
        if (parsed.applicationProgress) {
          setApplicationProgress(parsed.applicationProgress);
        }
        if (parsed.currentTab) {
          setCurrentTab(parsed.currentTab);
        }
        
        // Restore documents from base64 if available
        if (parsed.uploadedDocuments) {
          const restoredDocuments = {};
          let hasTooLarge = false;
          Object.keys(parsed.uploadedDocuments).forEach((key) => {
            const doc = parsed.uploadedDocuments[key];
            // If base64 is present, convert back to File object
            if (doc.base64) {
              try {
                const file = base64ToFile(doc.base64, doc.name, doc.type);
                restoredDocuments[key] = file;
              } catch (error) {
                console.error(`Error restoring file ${key}:`, error);
                // Keep metadata if file restoration fails
                restoredDocuments[key] = doc;
              }
            } else {
              // Just metadata (from old saves or failed conversions)
              restoredDocuments[key] = doc;
            }
            if (doc.tooLarge) {
              hasTooLarge = true;
            }
          });
          setUploadedDocuments(restoredDocuments);
          if (hasTooLarge) {
            setSaveError(
              "Some documents were too large to save automatically. Please re-upload those files when you return."
            );
          }
        }
        
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 2000);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
    skipDocAutoSaveRef.current = true;
    hasHydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save function - only called when user clicks Continue
  const saveToStorage = useCallback(async () => {
    try {
      setSaveStatus("saving");
      setSaveError("");
      
      // Convert file objects to base64 for storage
      const documentMetadata = {};
      const largeFiles = [];
      const filePromises = Object.keys(uploadedDocuments).map(async (key) => {
        const file = uploadedDocuments[key];
        if (file instanceof File) {
          if (file.size > MAX_FILE_SIZE_FOR_STORAGE) {
            largeFiles.push(file.name);
            documentMetadata[key] = {
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
              tooLarge: true,
            };
          } else {
            try {
              const base64 = await fileToBase64(file);
              documentMetadata[key] = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                base64: base64, // Store the actual file content
              };
            } catch (error) {
              console.error(`Error converting file ${key} to base64:`, error);
              // Fallback to metadata only if conversion fails
              documentMetadata[key] = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
              };
            }
          }
        } else {
          documentMetadata[key] = file;
        }
      });

      await Promise.all(filePromises);

      if (largeFiles.length > 0) {
        setSaveError(
          `We saved your information, but these files are larger than ${(MAX_FILE_SIZE_FOR_STORAGE / (1024 * 1024)).toFixed(1)} MB and will need to be re-uploaded next time: ${largeFiles.join(", ")}`
        );
      }

      const dataToSave = {
        formData,
        applicationProgress,
        currentTab,
        uploadedDocuments: documentMetadata,
        lastSaved: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (storageError) {
        // Handle localStorage quota exceeded
        if (storageError.name === 'QuotaExceededError') {
          console.error("Storage quota exceeded. Some files may be too large.");
          // Try saving without file content
          const metadataOnly = {};
          Object.keys(documentMetadata).forEach((key) => {
            const doc = documentMetadata[key];
            metadataOnly[key] = {
              name: doc.name,
              size: doc.size,
              type: doc.type,
              lastModified: doc.lastModified,
            };
          });
          const dataToSaveMetadata = {
            formData,
            applicationProgress,
            currentTab,
            uploadedDocuments: metadataOnly,
            lastSaved: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSaveMetadata));
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus(""), 3000);
          setSaveError(
            "We saved your details, but couldn't save document files because the browser storage limit was exceeded. You'll need to re-upload them next time."
          );
        } else {
          throw storageError;
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveStatus("");
    }
  }, [formData, applicationProgress, currentTab, uploadedDocuments]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    if (skipDocAutoSaveRef.current) {
      skipDocAutoSaveRef.current = false;
      return;
    }

    saveToStorage();
    // We intentionally omit skipDocAutoSaveRef from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedDocuments, saveToStorage]);

  // Update form data helper
  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "employment", label: "Employment & Income", icon: Briefcase },
    { id: "assets", label: "Assets", icon: DollarSign },
    { id: "debts", label: "Debts", icon: CreditCard },
    { id: "property", label: "Property", icon: Home },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "disclosures", label: "Disclosures", icon: Shield },
  ];

  const handleTabChange = (value, shouldSave = false) => {
    setCurrentTab(value);
    // Mark this section as viewed
    setApplicationProgress((prev) => ({
      ...prev,
      [value]: true,
    }));
    // Save only when Continue button is clicked
    if (shouldSave) {
      saveToStorage();
    }
  };

  const progressPercentage = Math.round(
    (Object.keys(applicationProgress).length / tabs.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mortgage Intake
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your mortgage intake in simple steps. All information
            is securely encrypted.
          </p>

          {/* Save Status Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {saveStatus === "saving" && (
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                <Save className="h-4 w-4 animate-pulse" />
                <span>Saving your progress...</span>
              </div>
            )}
            {saveStatus === "saved" && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <Check className="h-4 w-4" />
                <span>Your progress has been saved automatically</span>
              </div>
            )}
          </div>
          {saveError && (
            <div className="mt-2 text-center">
              <p className="text-sm text-red-600 font-medium">{saveError}</p>
            </div>
          )}
          
          {/* Info message about saving */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              💾 Your information is saved when you click "Continue". Files larger than 2&nbsp;MB are remembered in your checklist but will need to be re-uploaded when you return.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Intake Progress
              </span>
              <span className="text-sm font-medium text-gray-700">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Steps */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Intake Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isCompleted = applicationProgress[tab.id];

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        currentTab === tab.id
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isCompleted ? "✓" : tabs.indexOf(tab) + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{tab.label}</div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Regulatory Info Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Important Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Loan Estimate:</span>
                    <Badge variant="outline" className="text-xs">
                      3 Business Days
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Home Loan Toolkit:</span>
                    <Badge variant="outline" className="text-xs">
                      3 Business Days
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">MLDS (CA):</span>
                    <Badge variant="outline" className="text-xs">
                      3 Business Days
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const currentTabData = tabs.find(
                      (tab) => tab.id === currentTab
                    );
                    const Icon = currentTabData?.icon || FileText;
                    return (
                      <>
                        <Icon className="h-5 w-5" />
                        {currentTabData?.label}
                      </>
                    );
                  })()}
                </CardTitle>
                <CardDescription>
                  {currentTab === "personal" &&
                    "Provide your personal information for identity verification and credit check"}
                  {currentTab === "employment" &&
                    "Share your employment history and income details"}
                  {currentTab === "assets" &&
                    "List your assets and proof of funds for down payment"}
                  {currentTab === "debts" &&
                    "Disclose your current debts and obligations"}
                  {currentTab === "property" &&
                    "Information about the property you're purchasing"}
                  {currentTab === "documents" &&
                    "Upload required documentation"}
                  {currentTab === "disclosures" &&
                    "Review and acknowledge required disclosures"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={currentTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Full Legal Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          placeholder="John A. Smith"
                          value={formData.personal.fullName}
                          onChange={(e) => updateFormData("personal", "fullName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-md"
                          value={formData.personal.dateOfBirth}
                          onChange={(e) => updateFormData("personal", "dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Social Security Number
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          placeholder="XXX-XX-XXXX"
                          value={formData.personal.ssn}
                          onChange={(e) => updateFormData("personal", "ssn", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Marital Status
                        </label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={formData.personal.maritalStatus}
                          onChange={(e) => updateFormData("personal", "maritalStatus", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="separated">Separated</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Current Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Street Address
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="123 Main St"
                            value={formData.personal.streetAddress}
                            onChange={(e) => updateFormData("personal", "streetAddress", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">City</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Los Angeles"
                            value={formData.personal.city}
                            onChange={(e) => updateFormData("personal", "city", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">State</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="CA"
                            value={formData.personal.state}
                            onChange={(e) => updateFormData("personal", "state", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="90001"
                            value={formData.personal.zipCode}
                            onChange={(e) => updateFormData("personal", "zipCode", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <div></div>
                      <Button onClick={() => handleTabChange("employment", true)}>
                        Continue to Employment & Income
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Employment & Income Tab */}
                  <TabsContent value="employment" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Current Employment</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Employer Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="ABC Corporation"
                            value={formData.employment.employerName}
                            onChange={(e) => updateFormData("employment", "employerName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Position/Title
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Software Engineer"
                            value={formData.employment.position}
                            onChange={(e) => updateFormData("employment", "position", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Length of Employment
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="3 years"
                            value={formData.employment.lengthOfEmployment}
                            onChange={(e) => updateFormData("employment", "lengthOfEmployment", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="(555) 123-4567"
                            value={formData.employment.phoneNumber}
                            onChange={(e) => updateFormData("employment", "phoneNumber", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Income Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Annual Income
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$85,000"
                            value={formData.employment.annualIncome}
                            onChange={(e) => updateFormData("employment", "annualIncome", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Employment Type
                          </label>
                          <select 
                            className="w-full p-2 border rounded-md"
                            value={formData.employment.employmentType}
                            onChange={(e) => updateFormData("employment", "employmentType", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="w2">W-2 Employee</option>
                            <option value="self">Self-Employed</option>
                            <option value="1099">1099 Contractor</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleTabChange("personal")}
                      >
                        Back
                      </Button>
                      <Button onClick={() => handleTabChange("assets", true)}>
                        Continue to Assets
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Assets Tab */}
                  <TabsContent value="assets" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Bank Accounts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Checking Account Balance
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$5,000"
                            value={formData.assets.checkingBalance}
                            onChange={(e) => updateFormData("assets", "checkingBalance", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Savings Account Balance
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$15,000"
                            value={formData.assets.savingsBalance}
                            onChange={(e) => updateFormData("assets", "savingsBalance", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Investment Accounts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Retirement Accounts
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$45,000"
                            value={formData.assets.retirementAccounts}
                            onChange={(e) => updateFormData("assets", "retirementAccounts", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Stocks/Bonds
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$12,000"
                            value={formData.assets.stocksBonds}
                            onChange={(e) => updateFormData("assets", "stocksBonds", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Down Payment Source</h4>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Source of Down Payment
                        </label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={formData.assets.downPaymentSource}
                          onChange={(e) => updateFormData("assets", "downPaymentSource", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="savings">Personal Savings</option>
                          <option value="gift">Gift Funds</option>
                          <option value="retirement">Retirement Account</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleTabChange("employment")}
                      >
                        Back
                      </Button>
                      <Button onClick={() => handleTabChange("debts", true)}>
                        Continue to Debts
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Debts Tab */}
                  <TabsContent value="debts" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">
                        Current Monthly Housing Payment
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Rent/Mortgage Payment
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$1,500"
                            value={formData.debts.rentMortgage}
                            onChange={(e) => updateFormData("debts", "rentMortgage", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Loan Balances</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Auto Loans
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$8,000"
                            value={formData.debts.autoLoans}
                            onChange={(e) => updateFormData("debts", "autoLoans", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Student Loans
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$25,000"
                            value={formData.debts.studentLoans}
                            onChange={(e) => updateFormData("debts", "studentLoans", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Credit Card Debt
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$2,500"
                            value={formData.debts.creditCardDebt}
                            onChange={(e) => updateFormData("debts", "creditCardDebt", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Other Loans
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$0"
                            value={formData.debts.otherLoans}
                            onChange={(e) => updateFormData("debts", "otherLoans", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleTabChange("assets")}
                      >
                        Back
                      </Button>
                      <Button onClick={() => handleTabChange("property", true)}>
                        Continue to Property
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Property Tab */}
                  <TabsContent value="property" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Property Information</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Property Address
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="456 Oak Avenue"
                            value={formData.property.propertyAddress}
                            onChange={(e) => updateFormData("property", "propertyAddress", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">City</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="San Francisco"
                              value={formData.property.propertyCity}
                              onChange={(e) => updateFormData("property", "propertyCity", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">State</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="CA"
                              value={formData.property.propertyState}
                              onChange={(e) => updateFormData("property", "propertyState", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="94102"
                              value={formData.property.propertyZip}
                              onChange={(e) => updateFormData("property", "propertyZip", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Purchase Price
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="$450,000"
                              value={formData.property.purchasePrice}
                              onChange={(e) => updateFormData("property", "purchasePrice", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Loan Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Loan Amount Requested
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$360,000"
                            value={formData.property.loanAmount}
                            onChange={(e) => updateFormData("property", "loanAmount", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Down Payment
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="$90,000"
                            value={formData.property.downPayment}
                            onChange={(e) => updateFormData("property", "downPayment", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Loan Type
                          </label>
                          <select 
                            className="w-full p-2 border rounded-md"
                            value={formData.property.loanType}
                            onChange={(e) => updateFormData("property", "loanType", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="conventional">Conventional</option>
                            <option value="fha">FHA</option>
                            <option value="va">VA</option>
                            <option value="usda">USDA</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Loan Term
                          </label>
                          <select 
                            className="w-full p-2 border rounded-md"
                            value={formData.property.loanTerm}
                            onChange={(e) => updateFormData("property", "loanTerm", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="30">30 Year Fixed</option>
                            <option value="15">15 Year Fixed</option>
                            <option value="arm5">5/1 ARM</option>
                            <option value="arm7">7/1 ARM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleTabChange("debts")}
                      >
                        Back
                      </Button>
                      <Button onClick={() => handleTabChange("documents", true)}>
                        Continue to Documents
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium mb-3">
                        Required Documents Checklist
                      </h4>
                      <div className="space-y-4">
                        {[
                          {
                            id: "photoId",
                            label: "Government-issued photo ID",
                            required: true,
                          },
                          {
                            id: "payStubs",
                            label: "2 most recent pay stubs",
                            required: true,
                          },
                          {
                            id: "w2s",
                            label: "2 years W-2s or 1099s",
                            required: true,
                          },
                          {
                            id: "bankStatements",
                            label: "2-3 months bank statements",
                            required: true,
                          },
                          {
                            id: "investmentStatements",
                            label: "Investment account statements",
                            required: true,
                          },
                          {
                            id: "purchaseContract",
                            label: "Purchase contract (if applicable)",
                            required: false,
                          },
                        ].map((doc) => {
                          const file = uploadedDocuments[doc.id];
                          const fileDetails = file
                            ? file instanceof File
                              ? {
                                  name: file.name,
                                  size: file.size,
                                  tooLarge: false,
                                }
                              : file
                            : null;
                          const inputId = `upload-${doc.id}`;

                          const handleFileChange = (e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile) {
                              setUploadedDocuments((prev) => ({
                                ...prev,
                                [doc.id]: selectedFile,
                              }));
                            }
                          };

                          const handleRemoveFile = () => {
                            setUploadedDocuments((prev) => {
                              const newState = { ...prev };
                              delete newState[doc.id];
                              return newState;
                            });
                            // Reset the input
                            const input = document.getElementById(inputId);
                            if (input) input.value = "";
                          };

                          return (
                            <div
                              key={doc.id}
                              className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="mt-1">
                                    {file ? (
                                      <Check className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <div
                                        className={`w-5 h-5 rounded-full border-2 ${
                                          doc.required
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">
                                        {doc.label}
                                      </span>
                                      {doc.required && !file && (
                                        <Badge
                                          variant="destructive"
                                          className="text-xs"
                                        >
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                  {fileDetails && (
                                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                        <FileText className="h-3 w-3" />
                                      <span>{fileDetails.name || "Document"}</span>
                                        <span className="text-gray-400">
                                        ({fileDetails.size ? (fileDetails.size / 1024).toFixed(1) : "0"} KB)
                                        </span>
                                      {fileDetails.tooLarge && (
                                        <Badge variant="destructive" className="text-[10px]">
                                          Too large to auto-save
                                        </Badge>
                                      )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {file ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={handleRemoveFile}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Remove
                                    </Button>
                                  ) : (
                                    <>
                                      <input
                                        id={inputId}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          document.getElementById(inputId)?.click()
                                        }
                                      >
                                        <Upload className="h-4 w-4 mr-1" />
                                        Upload
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleTabChange("property")}
                      >
                        Back
                      </Button>
                      <Button onClick={() => handleTabChange("disclosures", true)}>
                        Continue to Disclosures
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Disclosures Tab */}
                  <TabsContent value="disclosures" className="space-y-6">
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">
                          Required Disclosures & Acknowledgements
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 mt-1" 
                              checked={formData.disclosures.creditAuthorization}
                              onChange={(e) => updateFormData("disclosures", "creditAuthorization", e.target.checked)}
                            />
                            <div>
                              <span className="text-sm font-medium">
                                Credit Authorization
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                I authorize the lender to pull my credit report
                                and verify information provided in this
                                intake.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 mt-1" 
                              checked={formData.disclosures.loanEstimateAck}
                              onChange={(e) => updateFormData("disclosures", "loanEstimateAck", e.target.checked)}
                            />
                            <div>
                              <span className="text-sm font-medium">
                                Loan Estimate Acknowledgement
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                I understand I will receive a Loan Estimate
                                within 3 business days of intake.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 mt-1" 
                              checked={formData.disclosures.appraisalRights}
                              onChange={(e) => updateFormData("disclosures", "appraisalRights", e.target.checked)}
                            />
                            <div>
                              <span className="text-sm font-medium">
                                Appraisal Rights
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                I acknowledge receipt of the ECOA appraisal
                                rights notice for first-lien dwellings.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 mt-1" 
                              checked={formData.disclosures.privacyNotices}
                              onChange={(e) => updateFormData("disclosures", "privacyNotices", e.target.checked)}
                            />
                            <div>
                              <span className="text-sm font-medium">
                                Privacy Notices
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                I acknowledge receipt of GLBA privacy notice and
                                California Financial Information Privacy Act
                                notice.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 mt-1" 
                              checked={formData.disclosures.californiaPerDiem}
                              onChange={(e) => updateFormData("disclosures", "californiaPerDiem", e.target.checked)}
                            />
                            <div>
                              <span className="text-sm font-medium">
                                California Per-Diem Disclosure
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                I understand I cannot be required to pay
                                interest for more than one day prior to escrow
                                disbursement.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">
                          Next Steps After Submission
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                          <li>Loan Estimate provided within 3 business days</li>
                          <li>
                            Home Loan Toolkit provided for purchase transactions
                          </li>
                          <li>
                            List of HUD-approved housing counselors provided
                          </li>
                          <li>
                            MLDS disclosure provided for California DRE brokers
                          </li>
                          <li>
                            Appraisal rights notice provided for first-lien
                            loans
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleTabChange("documents")}
                      >
                        Back
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={async () => {
                          try {
                            await saveToStorage();
                          } catch (error) {
                            console.error("Error saving before submission:", error);
                          }

                          localStorage.removeItem(STORAGE_KEY);
                          skipDocAutoSaveRef.current = true;
                          setFormData(createInitialFormData());
                          setApplicationProgress({});
                          setUploadedDocuments({});
                          setCurrentTab("personal");
                          setSaveStatus("");
                          setSaveError("");

                          alert("Application submitted successfully!");
                        }}
                      >
                        Submit Intake
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <UlizaChatbot />
    </div>
  );
}
