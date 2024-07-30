import React from 'react'
import { PickerForm } from './PickerForm';
import { api } from '@/trpc/server';

export const FilterSkill = async () => {
  const data = await api.actionGuides.skillNames.query();
  const courseData = data.map((course) => ({
    value: course.id,
    label: course.name,
  }));

  return (
    <div>
      <PickerForm data={courseData} idx="skill" />
    </div>
  );

}
