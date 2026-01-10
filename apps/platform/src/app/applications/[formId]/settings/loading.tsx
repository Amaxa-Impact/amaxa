import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col">
      <FieldGroup>
        <Field>
          <FieldLabel>
            <Skeleton className="h-4 w-20" />
          </FieldLabel>
          <Skeleton className="h-10 w-full" />
          <FieldDescription>
            <Skeleton className="h-4 w-48" />
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
