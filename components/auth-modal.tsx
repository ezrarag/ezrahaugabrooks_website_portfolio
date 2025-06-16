"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuthModalProps {
  onClose: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async (type: "login" | "register", formData: FormData) => {
    setIsLoading(true)

    // Supabase auth integration would go here
    // Example:
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: formData.get('email') as string,
    //   password: formData.get('password') as string,
    // })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-gold-400/30">
        <DialogHeader>
          <DialogTitle className="text-gold-400">Authentication</DialogTitle>
          <DialogDescription className="text-slate-300">
            Sign in to access exclusive content and features.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="login" className="data-[state=active]:bg-gold-400 data-[state=active]:text-slate-900">
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-gold-400 data-[state=active]:text-slate-900"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleAuth("login", formData)
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gold-400 text-slate-900 hover:bg-gold-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleAuth("register", formData)
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="reg-password"
                    name="password"
                    type="password"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-300">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gold-400 text-slate-900 hover:bg-gold-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
