import { useEffect, useState } from "react";

/**
 * true only after the first client render. Use it to gate UI that depends on
 * localStorage (auth, theme) so server HTML and first client render match.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
