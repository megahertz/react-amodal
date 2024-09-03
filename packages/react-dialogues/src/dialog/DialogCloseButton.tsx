import type { HTMLAttributes } from 'react';
import { useUiItem } from '../core/itemContext';

export function DialogCloseButton({
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  const item = useUiItem();

  return (
    <button
      aria-label="Close"
      className="rd-dialog-close"
      onClick={() => item?.destroy('close')}
      type="button"
      {...(props as object)}
    >
      🞨
    </button>
  );
}
