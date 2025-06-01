import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-6">
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
  )
}
