import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Id } from "@amaxa/backend/_generated/dataModel";

import { ApplyForm } from "./apply-form";
import type { ApplicationForm, ApplicationFormField } from "./types";

const {
  submitMutationMock,
  toastErrorMock,
  toastSuccessMock,
  useAuthMock,
  useMutationMock,
} = vi.hoisted(() => ({
  useMutationMock: vi.fn(),
  useAuthMock: vi.fn(),
  submitMutationMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock("convex/react", () => ({
  useMutation: useMutationMock,
}));

vi.mock("@workos-inc/authkit-nextjs/components", () => ({
  useAuth: useAuthMock,
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

const formId = "form_1" as Id<"applicationForms">;
const triggerFieldId = "field_trigger" as Id<"applicationFormFields">;
const conditionalFieldId = "field_conditional" as Id<"applicationFormFields">;

const form: ApplicationForm = {
  _id: formId,
  _creationTime: 0,
  title: "Engineering Application",
  description: "Tell us about your experience",
  isPublished: true,
  slug: "engineering-application",
  createdBy: "site-admin",
};

const createField = (
  overrides: Partial<ApplicationFormField> = {},
): ApplicationFormField => ({
  _id: triggerFieldId,
  _creationTime: 0,
  formId,
  label: "Experience Level",
  type: "text",
  required: false,
  order: 0,
  ...overrides,
});

describe("ApplyForm integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthMock.mockReturnValue({
      user: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
      },
    });
    submitMutationMock.mockResolvedValue(undefined);
    useMutationMock.mockReturnValue(submitMutationMock);
  });

  it("prefills applicant info and toggles conditional fields", async () => {
    const fields = [
      createField(),
      createField({
        _id: conditionalFieldId,
        label: "Portfolio URL",
        order: 1,
        condition: {
          sourceFieldId: triggerFieldId,
          operator: "equals",
          value: "Senior",
        },
      }),
    ];

    render(
      <ApplyForm
        fields={fields}
        form={form}
        sections={[]}
        slug={form.slug}
      />,
    );

    expect(
      (screen.getByLabelText("Full Name *") as HTMLInputElement).value,
    ).toBe("Jane Doe");
    expect(
      (screen.getByLabelText("Email Address *") as HTMLInputElement).value,
    ).toBe("jane@example.com");
    expect(screen.queryByLabelText("Portfolio URL")).toBeNull();

    fireEvent.change(screen.getByLabelText("Experience Level"), {
      target: { value: "Senior" },
    });

    expect(await screen.findByLabelText("Portfolio URL")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Experience Level"), {
      target: { value: "Junior" },
    });

    await waitFor(() => {
      expect(screen.queryByLabelText("Portfolio URL")).toBeNull();
    });
  });

  it("submits only visible fields and shows success feedback", async () => {
    const fields = [
      createField(),
      createField({
        _id: conditionalFieldId,
        label: "Portfolio URL",
        order: 1,
        condition: {
          sourceFieldId: triggerFieldId,
          operator: "equals",
          value: "Senior",
        },
      }),
    ];

    render(
      <ApplyForm
        fields={fields}
        form={form}
        sections={[]}
        slug={form.slug}
      />,
    );

    fireEvent.change(screen.getByLabelText("Experience Level"), {
      target: { value: "Senior" },
    });
    fireEvent.change(await screen.findByLabelText("Portfolio URL"), {
      target: { value: "https://example.com/portfolio" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit Application" }));

    await waitFor(() => {
      expect(submitMutationMock).toHaveBeenCalledTimes(1);
    });

    expect(submitMutationMock).toHaveBeenCalledWith({
      formId,
      applicantName: "Jane Doe",
      applicantEmail: "jane@example.com",
      fieldResponses: [
        { fieldId: triggerFieldId, value: "Senior" },
        {
          fieldId: conditionalFieldId,
          value: "https://example.com/portfolio",
        },
      ],
    });
    expect(await screen.findByText("Application Submitted!")).toBeTruthy();
    expect(toastSuccessMock).toHaveBeenCalledWith(
      "Application submitted successfully!",
    );
  });

  it("excludes hidden conditional fields from the submitted payload", async () => {
    const fields = [
      createField(),
      createField({
        _id: conditionalFieldId,
        label: "Portfolio URL",
        order: 1,
        condition: {
          sourceFieldId: triggerFieldId,
          operator: "equals",
          value: "Senior",
        },
      }),
    ];

    render(
      <ApplyForm
        fields={fields}
        form={form}
        sections={[]}
        slug={form.slug}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit Application" }));

    await waitFor(() => {
      expect(submitMutationMock).toHaveBeenCalledTimes(1);
    });

    const payload = submitMutationMock.mock.calls[0]?.[0] as {
      fieldResponses: Array<{ fieldId: string; value: unknown }>;
    };

    expect(
      payload.fieldResponses.some(
        (response) => response.fieldId === conditionalFieldId,
      ),
    ).toBe(false);
    expect(payload.fieldResponses).toEqual([
      { fieldId: triggerFieldId, value: "" },
    ]);
  });

  it("shows error feedback when submission fails", async () => {
    submitMutationMock.mockRejectedValue(new Error("Submission failed"));

    render(
      <ApplyForm
        fields={[createField()]}
        form={form}
        sections={[]}
        slug={form.slug}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit Application" }));

    await waitFor(() => {
      expect(submitMutationMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Submission failed");
    });
    expect(screen.queryByText("Application Submitted!")).toBeNull();
  });
});
