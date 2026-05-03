import Accordion from "./Accordion";
import type { FAQProps } from "./types";

export function FAQ(props: FAQProps) {
  switch (props.variant) {
    case "accordion":
      return <Accordion {...props} />;
  }
}
