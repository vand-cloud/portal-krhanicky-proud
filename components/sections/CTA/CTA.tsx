import Banner from "./Banner";
import Split from "./Split";
import type { CTAProps } from "./types";

export function CTA(props: CTAProps) {
  switch (props.variant) {
    case "banner":
      return <Banner {...props} />;
    case "split":
      return <Split {...props} />;
  }
}
