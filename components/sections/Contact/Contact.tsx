import Form from "./Form";
import type { ContactProps } from "./types";

export function Contact(props: ContactProps) {
  switch (props.variant) {
    case "form":
      return <Form {...props} />;
  }
}
