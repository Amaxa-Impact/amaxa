"use client";

import { useState } from "react";
import { CheckCircle, Download, Globe, Star } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@amaxa/ui/button";
import { Card, CardContent } from "@amaxa/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amaxa/ui/dialog";
import { Input } from "@amaxa/ui/input";
import { Label } from "@amaxa/ui/label";
import { toast } from "@amaxa/ui/toast";

interface FormData {
  schoolName: string;
  contactEmail: string;
  contactName: string;
}

export function DownloadBrochure() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = () => {
    toast.success(
      "Thank you for your interest! We'll send the brochure to your email shortly.",
    );
    setIsModalOpen(false);
    reset();
  };

  return (
    <>
      <section className="bg-background w-full px-6 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div>
                  <h2 className="from-foreground to-foreground/60 bg-gradient-to-br bg-clip-text text-3xl leading-relaxed font-semibold text-transparent md:text-4xl lg:text-5xl">
                    Are you a school
                  </h2>
                  <p className="text-brand-green mt-2 text-3xl leading-relaxed font-bold md:text-4xl lg:text-5xl">
                    Interested in Partnering with Amaxa?
                  </p>
                </div>
                <div className="bg-brand-green h-1 w-24 rounded-full" />
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="brand" size="xl" className="gap-2">
                    Download Brochure
                    <Download className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request Brochure</DialogTitle>
                    <DialogDescription>
                      Please provide your details and we'll send you our
                      partnership brochure.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="schoolName">School Name</Label>
                      <Input
                        id="schoolName"
                        {...register("schoolName", {
                          required: "Please enter your school name",
                        })}
                        placeholder="Enter your school name"
                        className="mt-1"
                      />
                      {errors.schoolName && (
                        <p className="text-destructive mt-1 text-sm">
                          {errors.schoolName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        {...register("contactName", {
                          required: "Please enter your name",
                        })}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                      {errors.contactName && (
                        <p className="text-destructive mt-1 text-sm">
                          {errors.contactName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input
                        type="email"
                        id="contactEmail"
                        {...register("contactEmail", {
                          required: "Please enter your email",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address",
                          },
                        })}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                      {errors.contactEmail && (
                        <p className="text-destructive mt-1 text-sm">
                          {errors.contactEmail.message}
                        </p>
                      )}
                    </div>

                    <DialogFooter className="sm:justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="brand">
                        Request Brochure
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <Card className="rounded-2xl">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex-shrink-0">
                    <Globe className="text-brand-green h-12 w-12" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-card-foreground mb-2 text-xl font-bold md:text-2xl">
                      Global Collaboration
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
                      Give your students the opportunity to collaborate with
                      peers from 48+ countries, work on real-world projects with
                      nonprofits in Palestine, Uganda, and Liberia, and develop
                      leadership skills that go beyond the classroom.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-brand-green h-12 w-12" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-card-foreground mb-2 text-xl font-bold md:text-2xl">
                      100% Remote & Accessible
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
                      Accessible to all students with no additional burden on
                      your staff—we provide trained coaches and a proven 3-month
                      curriculum that integrates seamlessly with your school's
                      schedule.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex-shrink-0">
                    <Star className="text-brand-green h-12 w-12" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-card-foreground mb-2 text-xl font-bold md:text-2xl">
                      Real-World Impact
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
                      Students work on meaningful projects that create tangible
                      change in communities around the world, building
                      portfolios that showcase leadership, empathy, and global
                      citizenship.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
