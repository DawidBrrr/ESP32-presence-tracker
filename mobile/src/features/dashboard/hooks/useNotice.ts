import { useCallback, useState } from "react";
import type { Notice, NoticeType } from "../../../types/ui";

export function useNotice() {
  const [notice, setNotice] = useState<Notice | null>(null);

  const showNotice = useCallback((type: NoticeType, message: string) => {
    setNotice({ type, message });
  }, []);

  const pushNotice = useCallback((nextNotice: Notice) => {
    setNotice(nextNotice);
  }, []);

  const clearNotice = useCallback(() => {
    setNotice(null);
  }, []);

  return { notice, showNotice, pushNotice, clearNotice };
}
