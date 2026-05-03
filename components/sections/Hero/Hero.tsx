import Centered from "./Centered";
import Left from "./Left";
import Split from "./Split";
import Minimal from "./Minimal";
import type { HeroProps } from "./types";

export function Hero(props: HeroProps) {
  switch (props.variant) {
    case "centered":
      return <Centered {...props} />;
    case "left":
      return <Left {...props} />;
    case "split":
      return <Split {...props} />;
    case "minimal":
      return <Minimal {...props} />;
  }
}
