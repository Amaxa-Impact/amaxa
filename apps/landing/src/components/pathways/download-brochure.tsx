/**
 * DownloadBrochure - Partnership brochure download section
 *
 * Allows schools to request partnership brochure via form.
 * Uses a modal dialog with form validation.
 */

import { useState } from "react";
import { CheckCircle, Download, Globe, Star } from "lucide-react";

interface FormData {
  schoolName: string;
  contactEmail: string;
  contactName: string;
}

export function DownloadBrochure() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [errors, setErrors] = useState<{
    schoolName?: string;
    contactName?: string;
    contactEmail?: string;
  }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!schoolName.trim()) {
      newErrors.schoolName = "Please enter your school name";
    }
    if (!contactName.trim()) {
      newErrors.contactName = "Please enter your name";
    }
    if (!contactEmail.trim()) {
      newErrors.contactEmail = "Please enter your email";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert(
        "Thank you for your interest! We'll send brochure to your email shortly.",
      );
      setIsModalOpen(false);
      setSchoolName("");
      setContactName("");
      setContactEmail("");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="bg-background w-full px-6 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="flex flex-col gap-10">
            <div className="space-y-6 text-center md:text-left">
              <div>
                <h2 className="from-foreground to-foreground/60 bg-gradient-to-br bg-clip-text text-3xl leading-relaxed font-semibold text-transparent md:text-4xl lg:text-5xl">
                  Are you a school
                </h2>
                <p className="text-brand-green mt-2 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
                  Interested in Partnering with Ámaxa?
                </p>
              </div>
              <div className="bg-brand-green mx-auto h-1 w-24 rounded-full md:mx-0" />
            </div>

            {/* Grid is better for cards than flex-row for responsiveness */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
                <div className="flex flex-col items-start gap-4 sm:flex-row">
                  <div className="flex-shrink-0">
                    <Globe className="text-brand-green h-10 w-10 md:h-12 md:w-12" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-card-foreground mb-2 text-xl font-bold md:text-2xl">
                      Global Collaboration
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Give your students opportunity to collaborate with peers
                      from 48+ countries, work on real-world projects with
                      nonprofits in Palestine, Uganda, and Liberia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
                <div className="flex flex-col items-start gap-4 sm:flex-row">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-brand-green h-10 w-10 md:h-12 md:w-12" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-card-foreground mb-2 text-xl font-bold md:text-2xl">
                      100% Remote & Accessible
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Accessible to all students with no additional burden on
                      your staff—we provide trained coaches and a proven 3-month
                      curriculum.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
                <div className="flex flex-col items-start gap-4 sm:flex-row">
                  <div className="flex-shrink-0">
                    <Star className="text-brand-green h-10 w-10 md:h-12 md:w-12" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-card-foreground mb-2 text-xl font-bold md:text-2xl">
                      Real-World Impact
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Students work on meaningful projects that create tangible
                      change, building portfolios that showcase leadership and
                      empathy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full justify-center pt-4">
              <button
                onClick={openModal}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#3B3B3B] bg-[#BCD96C] px-8 py-4 text-sm font-medium text-[#3B3B3B] transition-colors hover:bg-[#a8c55f] md:text-base"
              >
                Download Brochure
                <Download className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-lg">
            <h3 className="text-foreground mb-2 text-2xl font-semibold">
              Request Brochure
            </h3>
            <p className="text-muted-foreground mb-4">
              Please provide your details and we'll send you our partnership
              brochure.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="schoolName"
                  className="text-foreground mb-1 block text-sm font-medium"
                >
                  School Name
                </label>
                <input
                  id="schoolName"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Enter your school name"
                  className="focus:border-brand-green border-input w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                />
                {errors.schoolName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.schoolName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactName"
                  className="text-foreground mb-1 block text-sm font-medium"
                >
                  Contact Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter your name"
                  className="focus:border-brand-green border-input w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="text-foreground mb-1 block text-sm font-medium"
                >
                  Email Address
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="focus:border-brand-green border-input w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border-border text-foreground hover:bg-muted flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#BCD96C] px-4 py-2 text-sm font-medium text-[#3B3B3B] transition-colors hover:bg-[#a8c55f]"
                >
                  Request Brochure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
