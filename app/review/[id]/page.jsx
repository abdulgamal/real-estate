// app/review/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  User,
  Briefcase,
  Home,
  AlertCircle,
  Download,
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Edit,
  MessageCircle,
  Printer,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function ApplicationDetails() {
  const params = useParams();
  const [application, setApplication] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for detailed application view
  const mockApplications = {
    "APP-2024-7890": {
      id: "APP-2024-7890",
      applicantName: "Sarah M. Johnson",
      coApplicantName: "Michael R. Johnson",
      propertyAddress: "456 Oak Avenue, San Francisco, CA 94102",
      loanAmount: 680000,
      purchasePrice: 850000,
      loanType: "Conventional",
      status: "under_review",
      statusLabel: "Under Review",
      submittedDate: "2024-01-15",
      lastUpdated: "2024-01-15",
      progress: 85,
      documents: {
        uploaded: 12,
        total: 14,
        list: [
          {
            name: "government_id.pdf",
            type: "identification",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "pay_stub_1.pdf",
            type: "income",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "pay_stub_2.pdf",
            type: "income",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "w2_2023.pdf",
            type: "income",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "w2_2022.pdf",
            type: "income",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "bank_statements.pdf",
            type: "assets",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "investment_accounts.pdf",
            type: "assets",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "purchase_agreement.pdf",
            type: "property",
            uploaded: "2024-01-15",
            status: "pending",
          },
          {
            name: "homeowners_insurance.pdf",
            type: "property",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "credit_authorization.pdf",
            type: "disclosures",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "privacy_notice.pdf",
            type: "disclosures",
            uploaded: "2024-01-15",
            status: "verified",
          },
          {
            name: "appraisal_rights.pdf",
            type: "disclosures",
            uploaded: "2024-01-15",
            status: "verified",
          },
        ],
      },
      loanOfficer: "Jennifer Martinez",
      priority: "high",
      details: {
        personal: {
          primary: {
            fullName: "Sarah M. Johnson",
            dateOfBirth: "1985-06-15",
            ssn: "XXX-XX-1234",
            maritalStatus: "Married",
            currentAddress: {
              street: "123 Main Street",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90001",
            },
            contact: {
              phone: "(555) 123-4567",
              email: "sarah.johnson@email.com",
            },
          },
          coApplicant: {
            fullName: "Michael R. Johnson",
            dateOfBirth: "1984-03-22",
            ssn: "XXX-XX-5678",
            maritalStatus: "Married",
            currentAddress: {
              street: "123 Main Street",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90001",
            },
            contact: {
              phone: "(555) 123-4568",
              email: "michael.johnson@email.com",
            },
          },
        },
        employment: {
          primary: {
            employer: "Tech Solutions Inc.",
            position: "Senior Software Engineer",
            employmentLength: "4 years",
            annualIncome: 125000,
            employmentType: "W-2 Employee",
            employerPhone: "(555) 987-6543",
          },
          coApplicant: {
            employer: "Global Marketing Partners",
            position: "Marketing Director",
            employmentLength: "6 years",
            annualIncome: 95000,
            employmentType: "W-2 Employee",
            employerPhone: "(555) 987-6544",
          },
        },
        assets: {
          checkingBalance: 18500,
          savingsBalance: 35000,
          retirementAccounts: 125000,
          investmentAccounts: 45000,
          downPaymentSource: "Personal Savings",
          totalAssets: 223500,
          giftFunds: 0,
        },
        debts: {
          monthlyRent: 2200,
          autoLoans: 15000,
          studentLoans: 28000,
          creditCardDebt: 4500,
          otherLoans: 0,
          totalDebts: 47500,
        },
        property: {
          address: "456 Oak Avenue",
          city: "San Francisco",
          state: "CA",
          zipCode: "94102",
          purchasePrice: 850000,
          loanAmount: 680000,
          downPayment: 170000,
          loanType: "Conventional",
          loanTerm: "30 Year Fixed",
          estimatedTaxes: 8500,
          hoaFees: 300,
          insurance: 1200,
        },
        disclosures: {
          creditAuth: true,
          loanEstimateAck: true,
          appraisalRights: true,
          privacyNotices: true,
          californiaPerDiem: true,
          allAccepted: true,
          acceptedDate: "2024-01-15",
        },
      },
      timeline: [
        {
          date: "2024-01-15",
          event: "Application Submitted",
          description: "Full application submitted online",
        },
        {
          date: "2024-01-15",
          event: "Credit Pull",
          description: "Credit report pulled and verified",
        },
        {
          date: "2024-01-16",
          event: "Initial Review",
          description: "Application moved to underwriting",
        },
        {
          date: "2024-01-16",
          event: "Document Verification",
          description: "Income and asset documents verified",
        },
        {
          date: "2024-01-17",
          event: "Appraisal Ordered",
          description: "Property appraisal scheduled",
        },
      ],
      conditions: [
        {
          description: "Purchase agreement signature page",
          status: "pending",
          dueDate: "2024-01-22",
        },
        {
          description: "Appraisal completion",
          status: "in_progress",
          dueDate: "2024-01-25",
        },
        {
          description: "Title commitment",
          status: "pending",
          dueDate: "2024-01-28",
        },
      ],
    },
    "APP-2024-7889": {
      id: "APP-2024-7889",
      applicantName: "David Chen",
      coApplicantName: "None",
      propertyAddress: "789 Pine Street, Los Angeles, CA 90001",
      loanAmount: 450000,
      purchasePrice: 625000,
      loanType: "FHA",
      status: "approved",
      statusLabel: "Approved",
      submittedDate: "2024-01-10",
      lastUpdated: "2024-01-14",
      progress: 100,
      documents: { uploaded: 15, total: 15, list: [] },
      loanOfficer: "Robert Wilson",
      priority: "medium",
      details: {
        // ... similar structure for other applications
      },
    },
  };

  useEffect(() => {
    // Simulate API call to fetch specific application
    const timer = setTimeout(() => {
      const appData =
        mockApplications[params.id] || mockApplications["APP-2024-7890"];
      setApplication(appData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Application Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The application you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { details, timeline, conditions } = application;

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "conditions":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Application Details
              </h1>
              <p className="text-gray-600">ID: {application.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        {/* Application Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600">Applicant</div>
                <div className="font-semibold text-lg">
                  {application.applicantName}
                </div>
                {application.coApplicantName !== "None" && (
                  <div className="text-sm text-gray-600">
                    Co-applicant: {application.coApplicantName}
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-600">Property</div>
                <div className="font-semibold truncate">
                  {application.propertyAddress}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Loan Amount</div>
                <div className="font-semibold">
                  ${application.loanAmount.toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge
                  className={`w-fit ${getStatusColor(application.status)}`}
                >
                  {application.statusLabel}
                </Badge>
                <div className="text-sm text-gray-600">
                  Loan Officer: {application.loanOfficer}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {application.progress}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${application.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  Documents: {application.documents.uploaded}/
                  {application.documents.total}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Applicant
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Applicant
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Send className="h-4 w-4" />
                  Request Documents
                </Button>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Purchase Price</span>
                  <span className="font-semibold">
                    ${details.property.purchasePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Amount</span>
                  <span className="font-semibold">
                    ${details.property.loanAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment</span>
                  <span className="font-semibold">
                    ${details.property.downPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Type</span>
                  <span className="font-semibold">
                    {details.property.loanType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Term</span>
                  <span className="font-semibold">
                    {details.property.loanTerm}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>LTV Ratio</span>
                  <span className="font-semibold">
                    {(
                      (details.property.loanAmount /
                        details.property.purchasePrice) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Primary Applicant */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">
                          Primary Applicant
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Full Name
                            </label>
                            <div className="font-semibold">
                              {details.personal.primary.fullName}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Date of Birth
                              </label>
                              <div className="font-semibold">
                                {new Date(
                                  details.personal.primary.dateOfBirth
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                SSN
                              </label>
                              <div className="font-semibold">
                                {details.personal.primary.ssn}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Contact
                            </label>
                            <div className="font-semibold">
                              {details.personal.primary.contact.phone}
                            </div>
                            <div className="font-semibold">
                              {details.personal.primary.contact.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Co-Applicant */}
                      {application.coApplicantName !== "None" && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg">
                            Co-Applicant
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Full Name
                              </label>
                              <div className="font-semibold">
                                {details.personal.coApplicant.fullName}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">
                                  Date of Birth
                                </label>
                                <div className="font-semibold">
                                  {new Date(
                                    details.personal.coApplicant.dateOfBirth
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">
                                  SSN
                                </label>
                                <div className="font-semibold">
                                  {details.personal.coApplicant.ssn}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Contact
                              </label>
                              <div className="font-semibold">
                                {details.personal.coApplicant.contact.phone}
                              </div>
                              <div className="font-semibold">
                                {details.personal.coApplicant.contact.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Employment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Employment & Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Primary Applicant</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Employer
                            </label>
                            <div className="font-semibold">
                              {details.employment.primary.employer}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Position
                            </label>
                            <div className="font-semibold">
                              {details.employment.primary.position}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Annual Income
                              </label>
                              <div className="font-semibold">
                                $
                                {details.employment.primary.annualIncome.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Employment Length
                              </label>
                              <div className="font-semibold">
                                {details.employment.primary.employmentLength}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {application.coApplicantName !== "None" && (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Co-Applicant</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Employer
                              </label>
                              <div className="font-semibold">
                                {details.employment.coApplicant.employer}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Position
                              </label>
                              <div className="font-semibold">
                                {details.employment.coApplicant.position}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">
                                  Annual Income
                                </label>
                                <div className="font-semibold">
                                  $
                                  {details.employment.coApplicant.annualIncome.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">
                                  Employment Length
                                </label>
                                <div className="font-semibold">
                                  {
                                    details.employment.coApplicant
                                      .employmentLength
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        $
                        {(
                          details.employment.primary.annualIncome +
                          (details.employment.coApplicant?.annualIncome || 0)
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Combined Annual Income
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Property Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Property Address
                        </label>
                        <div className="font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {application.propertyAddress}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Purchase Price
                        </label>
                        <div className="font-semibold">
                          ${details.property.purchasePrice.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Estimated Taxes
                        </label>
                        <div className="font-semibold">
                          ${details.property.estimatedTaxes}/year
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          HOA Fees
                        </label>
                        <div className="font-semibold">
                          ${details.property.hoaFees}/month
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Management</CardTitle>
                    <CardDescription>
                      {application.documents.uploaded} of{" "}
                      {application.documents.total} documents uploaded
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.documents.list.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-gray-600 capitalize">
                                {doc.type} • Uploaded{" "}
                                {new Date(doc.uploaded).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={getDocumentStatusColor(doc.status)}
                            >
                              {doc.status.charAt(0).toUpperCase() +
                                doc.status.slice(1)}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timeline.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            {index < timeline.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="font-medium">{event.event}</div>
                            <div className="text-sm text-gray-600">
                              {event.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conditions Tab */}
              <TabsContent value="conditions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Underwriting Conditions</CardTitle>
                    <CardDescription>
                      {
                        conditions.filter((c) => c.status === "completed")
                          .length
                      }{" "}
                      of {conditions.length} conditions met
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conditions.map((condition, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                condition.status === "completed"
                                  ? "bg-green-500"
                                  : condition.status === "in_progress"
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                              }`}
                            ></div>
                            <div>
                              <div className="font-medium">
                                {condition.description}
                              </div>
                              <div className="text-sm text-gray-600">
                                Due{" "}
                                {new Date(
                                  condition.dueDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={getConditionStatusColor(
                              condition.status
                            )}
                          >
                            {condition.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value="financial" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assets */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Assets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Checking Accounts</span>
                        <span className="font-semibold">
                          ${details.assets.checkingBalance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Savings Accounts</span>
                        <span className="font-semibold">
                          ${details.assets.savingsBalance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retirement Accounts</span>
                        <span className="font-semibold">
                          ${details.assets.retirementAccounts.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment Accounts</span>
                        <span className="font-semibold">
                          ${details.assets.investmentAccounts.toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Assets</span>
                        <span>
                          ${details.assets.totalAssets.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Debts */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Debts & Obligations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Auto Loans</span>
                        <span className="font-semibold">
                          ${details.debts.autoLoans.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Student Loans</span>
                        <span className="font-semibold">
                          ${details.debts.studentLoans.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credit Card Debt</span>
                        <span className="font-semibold">
                          ${details.debts.creditCardDebt.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Loans</span>
                        <span className="font-semibold">
                          ${details.debts.otherLoans.toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Debts</span>
                        <span>
                          ${details.debts.totalDebts.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Financial Ratios */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Ratios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {(
                            (details.property.loanAmount /
                              details.property.purchasePrice) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          Loan-to-Value (LTV)
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {(
                            ((details.debts.monthlyRent +
                              details.debts.totalDebts / 12) /
                              ((details.employment.primary.annualIncome +
                                (details.employment.coApplicant?.annualIncome ||
                                  0)) /
                                12)) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          Debt-to-Income (DTI)
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {(
                            (details.assets.totalAssets /
                              details.property.purchasePrice) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          Asset-to-Price Ratio
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
