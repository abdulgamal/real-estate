"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Home,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Building,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for multiple applications
  const mockApplications = [
    {
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
      },
      loanOfficer: "Jennifer Martinez",
      priority: "high",
    },
    {
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
      documents: {
        uploaded: 15,
        total: 15,
      },
      loanOfficer: "Robert Wilson",
      priority: "medium",
    },
    {
      id: "APP-2024-7885",
      applicantName: "Emily Rodriguez & Carlos Rodriguez",
      coApplicantName: "Carlos Rodriguez",
      propertyAddress: "321 Elm Drive, San Diego, CA 92101",
      loanAmount: 320000,
      purchasePrice: 400000,
      loanType: "VA",
      status: "conditions",
      statusLabel: "Conditions Requested",
      submittedDate: "2024-01-08",
      lastUpdated: "2024-01-13",
      progress: 70,
      documents: {
        uploaded: 11,
        total: 15,
      },
      loanOfficer: "Jennifer Martinez",
      priority: "high",
    },
    {
      id: "APP-2024-7878",
      applicantName: "James Wilson",
      coApplicantName: "None",
      propertyAddress: "654 Birch Road, San Jose, CA 95101",
      loanAmount: 950000,
      purchasePrice: 1180000,
      loanType: "Jumbo",
      status: "processing",
      statusLabel: "Processing",
      submittedDate: "2024-01-05",
      lastUpdated: "2024-01-12",
      progress: 60,
      documents: {
        uploaded: 10,
        total: 16,
      },
      loanOfficer: "Robert Wilson",
      priority: "medium",
    },
    {
      id: "APP-2024-7865",
      applicantName: "Amanda Thompson",
      coApplicantName: "None",
      propertyAddress: "987 Cedar Lane, Sacramento, CA 95801",
      loanAmount: 275000,
      purchasePrice: 345000,
      loanType: "Conventional",
      status: "withdrawn",
      statusLabel: "Withdrawn",
      submittedDate: "2024-01-02",
      lastUpdated: "2024-01-10",
      progress: 30,
      documents: {
        uploaded: 8,
        total: 14,
      },
      loanOfficer: "Jennifer Martinez",
      priority: "low",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setApplications(mockApplications);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "under_review":
        return <Eye className="h-4 w-4 text-blue-600" />;
      case "conditions":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-purple-600" />;
      case "withdrawn":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

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
      case "withdrawn":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = {
    total: applications.length,
    approved: applications.filter((app) => app.status === "approved").length,
    inProgress: applications.filter((app) =>
      ["under_review", "processing", "conditions"].includes(app.status)
    ).length,
    withdrawn: applications.filter((app) => app.status === "withdrawn").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Loan Origination Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage and track all mortgage applications in one place
            </p>
          </div>
          <Button asChild className="flex items-center gap-2">
            <Link href="/application">
              <Plus className="h-4 w-4" />
              New Application
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.approved}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Withdrawn</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.withdrawn}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="under_review">Under Review</option>
                    <option value="processing">Processing</option>
                    <option value="conditions">Conditions</option>
                    <option value="approved">Approved</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>

                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              {filteredApplications.length} application(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card
                  key={application.id}
                  className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section - Application Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {application.applicantName}
                            </h3>
                            {application.coApplicantName !== "None" && (
                              <p className="text-sm text-gray-600">
                                Co-applicant: {application.coApplicantName}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(application.status)}
                            >
                              {getStatusIcon(application.status)}
                              {application.statusLabel}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(application.priority)}
                            >
                              {application.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 truncate">
                              {application.propertyAddress}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              ${application.loanAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {application.loanType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(
                                application.submittedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Application Progress
                            </span>
                            <span className="font-medium">
                              {application.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${application.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              Documents: {application.documents.uploaded}/
                              {application.documents.total}
                            </span>
                            <span>Loan Officer: {application.loanOfficer}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                        <Button
                          asChild
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Link href={`/review/${application.id}`}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          Actions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No applications found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Get started by creating a new mortgage application"}
                  </p>
                  <Button asChild>
                    <Link href="/application">
                      <Plus className="h-4 w-4 mr-2" />
                      New Application
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Processing Time</span>
                  <span className="font-medium">14 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approval Rate</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Loan Amount</span>
                  <span className="font-medium">$535,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div>APP-2024-7889 approved</div>
                    <div className="text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div>New application submitted</div>
                    <div className="text-gray-500">1 day ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div>
                    <div>Conditions requested for APP-2024-7885</div>
                    <div className="text-gray-500">2 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <Button variant="outline" className="w-full justify-start">
                  View Compliance Guidelines
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Training Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
