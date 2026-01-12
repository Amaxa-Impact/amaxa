/**
 * DownloadBrochure - Partnership brochure download section
 *
 * Allows schools to request partnership brochure via form.
 * Uses a modal dialog with form validation.
 */

import { useState } from "react";
import { CheckCircle, Download, Globe, Star } from "lucide-react";

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
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 lg:py-28">
          <div className="mb-12 md:mb-16">
            <p className="text-brand-green mb-2 text-sm font-semibold uppercase tracking-widest">
              For Schools
            </p>
            <h2 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
              Interested in Partnering with Ámaxa?
            </h2>
            <div className="bg-brand-green mt-4 h-1 w-16 rounded-full" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-border bg-card rounded-xl border p-6">
              <Globe className="text-brand-green mb-4 h-8 w-8" />
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Global Collaboration
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Give your students opportunity to collaborate with peers from
                48+ countries, work on real-world projects with nonprofits in
                Palestine, Uganda, and Liberia.
              </p>
            </div>

            <div className="border-border bg-card rounded-xl border p-6">
              <CheckCircle className="text-brand-green mb-4 h-8 w-8" />
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                100% Remote & Accessible
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Accessible to all students with no additional burden on your
                staff—we provide trained coaches and a proven 3-month
                curriculum.
              </p>
            </div>

            <div className="border-border bg-card rounded-xl border p-6">
              <Star className="text-brand-green mb-4 h-8 w-8" />
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Real-World Impact
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Students work on meaningful projects that create tangible
                change, building portfolios that showcase leadership and
                empathy.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={openModal}
              className="bg-brand-green text-foreground hover:bg-brand-green-hover inline-flex items-center rounded-full px-6 py-3 text-sm font-medium transition-colors"
            >
              Download Brochure
              <Download className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-lg">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Request Brochure
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Please provide your details and we'll send you our partnership
              brochure.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="schoolName"
                  className="text-foreground mb-1.5 block text-sm font-medium"
                >
                  School Name
                </label>
                <input
                  id="schoolName"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Enter your school name"
                  className="border-border focus:border-brand-green w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm focus:outline-none"
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
                  className="text-foreground mb-1.5 block text-sm font-medium"
                >
                  Contact Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-border focus:border-brand-green w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm focus:outline-none"
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
                  className="text-foreground mb-1.5 block text-sm font-medium"
                >
                  Email Address
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="border-border focus:border-brand-green w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm focus:outline-none"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border-border text-foreground hover:bg-accent flex-1 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-green text-foreground hover:bg-brand-green-hover flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
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
