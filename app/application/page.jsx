"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function MortgageOrigination() {
  const [currentTab, setCurrentTab] = useState("personal");
  const [applicationProgress, setApplicationProgress] = useState({});

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "employment", label: "Employment & Income", icon: Briefcase },
    { id: "assets", label: "Assets", icon: DollarSign },
    { id: "debts", label: "Debts", icon: CreditCard },
    { id: "property", label: "Property", icon: Home },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "disclosures", label: "Disclosures", icon: Shield },
  ];

  const handleTabChange = (value) => {
    setCurrentTab(value);
    // Mark this section as viewed
    setApplicationProgress((prev) => ({
      ...prev,
      [value]: true,
    }));
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
            Mortgage Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your mortgage application in simple steps. All information
            is securely encrypted.
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Application Progress
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
                  Application Steps
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
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-md"
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
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Marital Status
                        </label>
                        <select className="w-full p-2 border rounded-md">
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
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">City</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Los Angeles"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">State</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="CA"
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
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <div></div>
                      <Button onClick={() => handleTabChange("employment")}>
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
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Employment Type
                          </label>
                          <select className="w-full p-2 border rounded-md">
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
                      <Button onClick={() => handleTabChange("assets")}>
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
                        <select className="w-full p-2 border rounded-md">
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
                      <Button onClick={() => handleTabChange("debts")}>
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
                      <Button onClick={() => handleTabChange("property")}>
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
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">City</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="San Francisco"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">State</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="CA"
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
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Loan Type
                          </label>
                          <select className="w-full p-2 border rounded-md">
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
                          <select className="w-full p-2 border rounded-md">
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
                      <Button onClick={() => handleTabChange("documents")}>
                        Continue to Documents
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="space-y-6">
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">
                          Required Documents Checklist
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">
                              Government-issued photo ID
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">
                              2 most recent pay stubs
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">
                              2 years W-2s or 1099s
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">
                              2-3 months bank statements
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">
                              Investment account statements
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">
                              Purchase contract (if applicable)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="font-medium mb-2">Upload Documents</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Drag and drop files here or click to browse
                        </p>
                        <Button variant="outline">Select Files</Button>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleTabChange("property")}
                      >
                        Back
                      </Button>
                      <Button onClick={() => handleTabChange("disclosures")}>
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
                            <input type="checkbox" className="w-4 h-4 mt-1" />
                            <div>
                              <span className="text-sm font-medium">
                                Credit Authorization
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                I authorize the lender to pull my credit report
                                and verify information provided in this
                                application.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <input type="checkbox" className="w-4 h-4 mt-1" />
                            <div>
                              <span className="text-sm font-medium">
                                Loan Estimate Acknowledgement
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                I understand I will receive a Loan Estimate
                                within 3 business days of application.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <input type="checkbox" className="w-4 h-4 mt-1" />
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
                            <input type="checkbox" className="w-4 h-4 mt-1" />
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
                            <input type="checkbox" className="w-4 h-4 mt-1" />
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
                      <Button className="bg-green-600 hover:bg-green-700">
                        Submit Application
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
