import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">Last updated: May 31, 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p>
              ExamGPT ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you use our website, mobile application,
              and services (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you
              have read, understood, and agree to be bound by this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We may collect several types of information from and about users of our Service, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and other information you
                provide when creating an account or using our Service.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you access and use our Service, including your
                browsing patterns, page views, and features used.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the device you use to access our Service,
                including device type, operating system, and browser type.
              </li>
              <li>
                <strong>Learning Data:</strong> Information about your learning progress, test results, performance
                metrics, and study patterns.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our Service</li>
              <li>Personalize your experience and deliver content relevant to your interests</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, such as updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Develop new products, services, features, and functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Sharing Your Information</h2>
            <p>We may share your information in the following situations:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>With Service Providers:</strong> We may share your information with third-party vendors, service
                providers, contractors, or agents who perform services for us.
              </li>
              <li>
                <strong>For Business Transfers:</strong> We may share or transfer your information in connection with,
                or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a
                portion of our business.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may disclose your information for any other purpose with your
                consent.
              </li>
              <li>
                <strong>To Comply with Legal Obligations:</strong> We may disclose your information where required by
                law, governmental request, or to protect our rights.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal
              information. However, please be aware that no method of transmission over the Internet or method of
              electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Your Data Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The right to access the personal information we have about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <a href="mailto:hi@examgpt.site" className="text-blue-600 hover:underline">
                hi@examgpt.site
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under the age of 13. We do not knowingly collect personal
              information from children under 13. If you are a parent or guardian and you are aware that your child has
              provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:hi@examgpt.site" className="text-blue-600 hover:underline">
                hi@examgpt.site
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ExamGPT. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-gray-600 hover:text-black">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-black">
                Privacy Policy
              </Link>
              <a href="mailto:hi@examgpt.site" className="text-sm text-gray-600 hover:text-black">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
