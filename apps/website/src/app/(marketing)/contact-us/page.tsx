"use client";

import React from "react";
import Image from "next/image";

import { AnimatedTitle } from "~/components/animated-underline";

export default function ProgramPage() {

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {showInquiryTypeSelector && (
              <FormField
                control={form.control}
                name="inquiryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel {...({} as any)}>Inquiry Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="internship">
                          Internship Inquiry
                        </SelectItem>
                        <SelectItem value="high-school">
                          High School Program
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of inquiry that best matches your question
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel {...({} as any)}>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel {...({} as any)}>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formType === "demo" && (
              <>
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel {...({} as any)}>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Personal, School Name, or Company Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel {...({} as any)}>
                          Phone Number (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(555) 123-4567"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(
                                e.target.value,
                              );
                              field.onChange(formatted);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel {...({} as any)}>
                          Preferred Date (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel {...({} as any)}>
                          Preferred Time (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel {...({} as any)}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Timezone (Optional)
                          </div>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {timezones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your timezone so we can schedule at a
                          convenient time
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel {...({} as any)}>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        formType === "demo"
                          ? "Tell us about your organization and what you'd like to learn about ámaxa..."
                          : "Tell us how we can help you..."
                      }
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#3B3B3B] text-white hover:bg-[#3B3B3B]/90"
              disabled={isSubmitting}
              variant="primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>

            {formType !== "demo" && (
              <div className="mt-4 rounded-lg border border-[#BCD96C]/30 bg-[#BCD96C]/10 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3B3B3B]" />
                  <div className="text-sm text-[#3B3B3B]/80">
                    <p className="mb-1 font-medium">
                      Where does this message go?
                    </p>
                    <p>
                      Your message will be sent directly to{" "}
                      <strong>lauren@amaxaimpact.org</strong>. A team member
                      will reply directly to your email address. We typically
                      respond within 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ContactUsPage() {
  return (
    <main>
      {/* Header Section */}
      <div className="relative flex max-h-[320px] w-full flex-col bg-white px-6 sm:max-h-[240px] md:max-h-[320px] md:px-12 lg:px-20">
        {/* Background container - hidden but preserved for reference */}
        <div className="invisible absolute inset-0">
          <div
            className="h-full w-full"
            style={{ background: "url(/Untitled design.png)" }}
          />
        </div>
        {/* Content container with flex layout */}
        <section className="w-full py-16 md:py-24 overflow-visible">
          <div className="container mx-auto px-6 md:px-16 lg:px-20 overflow-visible">
            <div className="flex flex-col items-center justify-center overflow-visible">
              <div className="mb-12 max-w-full overflow-visible">
                <AnimatedTitle underlinedText="Contact Us" color="#BCD96C" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full px-6 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
          {/* High School Program */}
          <div className="space-y-8 md:space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:gap-12">
              {/* Left: Description */}
              <div className="w-full space-y-6 md:w-1/2">
                <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
                  Questions, comments, or partnership proposals? We'd love to
                  hear from you.
                </h2>
                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  For general inquiries, please email our CEO Lauren McMillen at
                  lauren@amaxaimpact.org.
                </p>

                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  For collaboration inquiries, please email our COO Alexi Jones
                  at lexi@amaxaimpact.org.
                </p>

              </div>
              <h3 className="text-2xl font-semibold text-[#3B3B3B] md:text-3xl">
                Send Us a Message
              </h3>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Fill out the form below that matches your inquiry type. A team
                member will reply to your email address, or for demo requests
                with a preferred date and time, you'll receive a Google Calendar
                invite.
              </p>
            </div>

              <div className="mt-8 flex w-full items-center justify-center md:mt-0 md:w-1/2">
                <div className="h-auto w-auto">
                  <Image
                    src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO8nKnqPHgjXRpn0dgo1l6KOV2DuqGLya94cMI"
                    alt="mail"
                    width="300"
                    height="300"
                  />
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-3xl">
              <ContactForm
                formType="demo"
                title="Request a Demo or Intro Call"
                description="Tell us about your organization and we'll schedule a time to connect."
                schema={demoFormSchema}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
