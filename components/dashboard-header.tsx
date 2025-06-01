"use client"

import { useState } from "react"
import { Bell, User, Search, LogOut, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { subjectsData } from "@/lib/subjects-data"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    window.location.href = "/"
  }

  const handleRequestFeature = () => {
    // Open email client or feedback form
    window.open(
      "mailto:hi@examgpt.site?subject=Feature Request&body=I would like to request the following feature:",
      "_blank",
    )
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results: any[] = []

    Object.entries(subjectsData).forEach(([subjectKey, subjectData]) => {
      subjectData.class11.forEach((chapter) => {
        if (chapter.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            type: "chapter",
            subject: subjectData.name,
            subjectKey,
            class: "class11",
            chapter: chapter.id,
            name: chapter.name,
            chapterNumber: chapter.chapter,
          })
        }
      })

      subjectData.class12.forEach((chapter) => {
        if (chapter.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            type: "chapter",
            subject: subjectData.name,
            subjectKey,
            class: "class12",
            chapter: chapter.id,
            name: chapter.name,
            chapterNumber: chapter.chapter,
          })
        }
      })
    })

    setSearchResults(results.slice(0, 8))
    setShowSearchResults(true)
  }

  const handleResultClick = (result: any) => {
    router.push(`/dashboard/test/${result.subjectKey}/${result.class}/${result.chapter}`)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="font-bold text-xl bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            ExamGPT
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search chapters..."
                className="pl-10 w-full h-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
            </div>

            {/* Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{result.name}</p>
                        <p className="text-xs text-gray-500">
                          {result.subject} - Class {result.class.replace("class", "")} - Ch. {result.chapterNumber}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="transition-transform duration-200 hover:scale-105">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2 duration-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRequestFeature} className="cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Request Feature
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
