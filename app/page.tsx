"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Clock,
  FileCheck,
  Calculator,
  ArrowRight,
  CheckCircle,
  Lock,
  Star,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: FileCheck,
      title: "Complete Documentation Guide",
      description:
        "Step-by-step guidance through all required mortgage documents and disclosures",
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description:
        "Built-in compliance with TRID, ECOA, California-specific requirements and more",
    },
    {
      icon: Clock,
      title: "3-Day Deadline Tracking",
      description:
        "Automatic tracking of critical regulatory deadlines including Loan Estimate delivery",
    },
    {
      icon: Calculator,
      title: "Real-time Progress",
      description:
        "Track your application progress with visual indicators and completion status",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Personal Information",
      description: "Basic details and identification verification",
    },
    {
      number: "02",
      title: "Income & Employment",
      description: "Current employment status and income documentation",
    },
    {
      number: "03",
      title: "Assets & Funds",
      description: "Bank accounts, investments, and down payment sources",
    },
    {
      number: "04",
      title: "Property Details",
      description: "Information about the home you're purchasing",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "First-time Homebuyer",
      content:
        "The step-by-step process made applying for a mortgage so much less intimidating. I knew exactly what documents I needed at each stage.",
      rating: 5,
    },
    {
      name: "Michael T.",
      role: "Real Estate Investor",
      content:
        "As someone who deals with multiple properties, the compliance features and deadline tracking are incredibly valuable.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 text-white border-none"
          >
            Fully Compliant Mortgage Origination
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Streamline Your Mortgage
            <span className="block text-blue-200">Application Process</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Guided, compliant, and secure mortgage origination with built-in
            regulatory compliance for TRID, ECOA, and California requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
            >
              <Link href="/application" className="flex items-center gap-2">
                Start Your Application
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Dashboard
                {/* <ArrowRight className="h-5 w-5" /> */}
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-blue-200 text-sm">TRID Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3-Day</div>
              <div className="text-blue-200 text-sm">LE Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">CA</div>
              <div className="text-blue-200 text-sm">State Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">256-bit</div>
              <div className="text-blue-200 text-sm">Encryption</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Compliance & Efficiency
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our mortgage origination platform incorporates all federal and
              California regulatory requirements directly into the application
              flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center border-none shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Regulatory Compliance Highlight */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Regulatory Requirements Built-In
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        TRID 6-item application criteria
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        3-day Loan Estimate delivery tracking
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        California MLDS & per-diem disclosures
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        ECOA appraisal rights notifications
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Link
                      href="/application"
                      className="flex items-center gap-2"
                    >
                      Start Compliant Application
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              Complete your mortgage application with guided steps and automatic
              compliance checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              <Link
                href="/application"
                className="flex items-center gap-2 text-lg"
              >
                Begin Your Application
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Mortgage Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied homebuyers who&apos;ve streamlined their
            mortgage application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              <Link href="/application" className="flex items-center gap-2">
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Dashboard
                {/* <ArrowRight className="h-5 w-5" /> */}
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400">
            <Lock className="h-4 w-4" />
            <span>Bank-level security & encryption</span>
          </div>
        </div>
      </section>
    </div>
  );
}
