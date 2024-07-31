import React from "react";

import Modal from "@amaxa/ui/modal";

import { Com } from "./com";

export default function Page(props: {
  params: {
    id: string;
  };
}) {
  const { id } = props.params;
  console.log(id);

  return (
    <Modal>
      <Com id={id} />
    </Modal>
  );
}
