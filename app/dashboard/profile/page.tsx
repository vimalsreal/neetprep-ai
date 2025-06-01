"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, LogOut, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  email: string
  phone?: string
  name?: string
  joinedDate: string
  subscription: "free" | "premium"
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      // Mock data for demonstration
      const mockProfile: UserProfile = {
        id: "user_123",
        email: "student@example.com",
        phone: "+91 9876543210",
        name: "Rahul Sharma",
        joinedDate: "2025-03-15",
        subscription: "premium",
      }

      setProfile(mockProfile)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear any stored auth tokens
      localStorage.removeItem("authToken")
      sessionStorage.clear()

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  const handleRequestFeature = () => {
    window.open(
      "mailto:hi@examgpt.site?subject=Feature Request&body=Hi ExamGPT Team,%0A%0AI would like to request the following feature:%0A%0A",
      "_blank",
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl pb-20 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {profile.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.name || "Student"}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={profile.subscription === "premium" ? "default" : "secondary"}>
                  {profile.subscription === "premium" ? "Premium" : "Free"}
                </Badge>
                <span className="text-sm text-gray-500">
                  Member since {new Date(profile.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{profile.name || "Not set"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{profile.phone || "Not set"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{profile.email}</span>
                <Badge variant="outline" className="text-xs ml-auto">
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button onClick={handleRequestFeature} variant="outline" className="w-full justify-start">
          <MessageSquare className="h-4 w-4 mr-2" />
          Request Feature
        </Button>

        <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
