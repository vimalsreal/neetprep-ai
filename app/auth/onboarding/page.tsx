"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export default function Onboarding() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    class: "",
    phone: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClassChange = (value: string) => {
    setFormData((prev) => ({ ...prev, class: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Profile Created",
        description: "Your profile has been set up successfully",
      })
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="font-bold text-xl bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
          >
            ExamGPT
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Complete your profile</h1>
            <p className="text-gray-600 mt-2">Help us personalize your learning experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <RadioGroup
                value={formData.class}
                onValueChange={handleClassChange}
                className="flex flex-wrap gap-4"
                required
              >
                {["10", "11", "12", "Dropper"].map((cls) => (
                  <div key={cls} className="flex items-center space-x-2">
                    <RadioGroupItem value={cls} id={`class-${cls}`} />
                    <Label htmlFor={`class-${cls}`} className="cursor-pointer">
                      {cls === "Dropper" ? "Dropper" : `Class ${cls}`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your profile...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
