import H2 from "./H2.astro";
import H3 from "./H3.astro";
import H4 from "./H4.astro";
import Paragraph from "./Paragraph.astro";
import Blockquote from "./Blockquote.astro";
import Link from "./Link.astro";
import Strong from "./Strong.astro";
import Image from "./Image.astro";
import Code from "./Code.astro";

export const portableTextComponents = {
  type: {
    image: Image,
    code: Code,
  },
  block: {
    h2: H2,
    h3: H3,
    h4: H4,
    normal: Paragraph,
    blockquote: Blockquote,
  },
  mark: {
    link: Link,
    strong: Strong,
  },
};
