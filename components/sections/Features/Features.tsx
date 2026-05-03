import Grid from "./Grid";
import Alternating from "./Alternating";
import type { FeaturesProps } from "./types";

export function Features(props: FeaturesProps) {
  switch (props.variant) {
    case "grid":
      return <Grid {...props} />;
    case "alternating":
      return <Alternating {...props} />;
  }
}
