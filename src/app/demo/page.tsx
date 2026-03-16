"use client"

import { CustomCheckbox } from "@/components/ui/custom-checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DemoPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 selection:bg-primary/20">
            {/* Background Image Container */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2940&auto=format&fit=crop")',
                }}
            >
                {/* Dark overlay to ensure the form is highly readable */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            {/* Glassmorphic Form Card */}
            <div className="relative z-10 w-full max-w-md bg-black/40 text-white p-10 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-heading font-bold tracking-tight mb-3">Join the Beta</h2>
                    <p className="text-white/80 text-sm">Experience the new sophisticated design with interactive, user-friendly forms.</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2 text-left">
                        <label className="text-sm font-medium text-white/90 ml-1">Email Address</label>
                        <Input
                            type="email"
                            placeholder="hello@example.com"
                            className="h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary/50 focus-visible:border-white/40"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-sm font-medium text-white/90 ml-1">Workspace Name</label>
                        <Input
                            type="text"
                            placeholder="My Productivity Hub"
                            className="h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary/50 focus-visible:border-white/40"
                        />
                    </div>

                    <div className="flex items-center space-x-3 pt-2 pb-2">
                        {/* Custom Checkbox styled to blend with the dark glass theme */}
                        <CustomCheckbox
                            id="terms"
                            className="border-white/40 bg-white/10 checked:bg-primary checked:border-transparent"
                        />
                        <label htmlFor="terms" className="text-sm text-white/80 leading-snug cursor-pointer select-none">
                            I agree to the elegant terms & conditions
                        </label>
                    </div>

                    <Button className="w-full h-12 text-base font-semibold rounded-xl bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Get Started Now
                    </Button>
                </div>
            </div>
        </div>
    )
}
