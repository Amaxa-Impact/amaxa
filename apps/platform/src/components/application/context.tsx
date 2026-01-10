"use client";

import { useQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface FormContext {
  _id: Id<"applicationForms">;
  title: string;
  description: string | undefined;
  isPublished: boolean;
  slug: string;
  createdBy: string;
}

export const FormContext = createContext<FormContext>({
  _id: "" as Id<"applicationForms">,
  title: "",
  description: undefined,
  isPublished: false,
  slug: "",
  createdBy: "",
});

export const ApplicationFormProvider = ({
  children,
  formId,
}: {
  children: React.ReactNode;
  formId: Id<"applicationForms">;
}) => {
  const form = useQuery(api.applicationForms.get, {
    formId,
  });

  if (!form) {
    return null;
  }

  return (
    <FormContext.Provider
      value={{
        _id: form._id,
        title: form.title,
        description: form.description,
        isPublished: form.isPublished,
        slug: form.slug,
        createdBy: form.createdBy,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useApplicationForm = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useApplicationForm must be used within a FormProvider");
  }

  return context;
};
