import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">Last updated: May 31, 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to ExamGPT ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use
              of the ExamGPT website, mobile application, and services (collectively, the "Service").
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of
              the Terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Use of the Service</h2>
            <p>
              ExamGPT provides an AI-powered NEET preparation platform with personalized learning and analytics. You may
              use the Service only for lawful purposes and in accordance with these Terms.
            </p>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Service in any way that violates any applicable laws or regulations</li>
              <li>
                Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to
                or from the servers running the Service
              </li>
              <li>Use the Service for any purpose that is harmful, fraudulent, or illegal</li>
              <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service</li>
              <li>Use the Service to transmit any malware, spyware, or other harmful code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and up-to-date information. You
              are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            <p>
              You agree to notify us immediately of any unauthorized use of your account or any other breach of
              security. We will not be liable for any loss or damage arising from your failure to comply with this
              section.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Subscription and Payments</h2>
            <p>
              Some aspects of the Service may be provided for a fee. You will be required to select a payment plan and
              provide accurate payment information.
            </p>
            <p>
              By providing payment information, you represent and warrant that you are authorized to use the payment
              method and authorize us to charge your payment method for the total amount of your subscription or
              purchase.
            </p>
            <p>
              Subscription fees are non-refundable except as required by law or as explicitly stated in our refund
              policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive
              property of ExamGPT and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior
              written consent of ExamGPT.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason,
              including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
              account, you may simply discontinue using the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              In no event shall ExamGPT, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound
              by the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
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
