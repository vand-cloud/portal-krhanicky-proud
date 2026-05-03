import Default from "./Default";
import Minimal from "./Minimal";
import type { FooterProps } from "./types";

export function Footer(props: FooterProps) {
  switch (props.variant) {
    case "default":
      return <Default {...props} />;
    case "minimal":
      return <Minimal {...props} />;
  }
}
