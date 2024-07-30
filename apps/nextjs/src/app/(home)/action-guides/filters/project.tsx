import { api } from "@/trpc/server";
import { PickerForm } from "./PickerForm";



export const FilterProject = async () => {
  const data = await api.actionGuides.projectNames.query();
  const courseData = data.map((course) => ({
    value: course.id,
    label: course.name,
  }));

  return (
    <div>
      <PickerForm data={courseData} idx="project" />
    </div>
  );
}
