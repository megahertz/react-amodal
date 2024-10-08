import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { OkButton } from '../controls/OkButton';
import { dialogues } from '../core/dialogues';
import { useUiItem } from '../core/itemContext';
import type { RdItem } from '../core/RdState';
import { Dialog, type DialogProps } from '../dialog/Dialog';
import { createDivComponent } from '../utils/constructors';
import { cls } from '../utils/string';

const Mask = createDivComponent('mask');

const defaults: ModalProps = {
  buttons: [<OkButton />],
  centered: false,
  className: '',
  closeOthers: false,
  mask: true,
  maskClosable: true,
  role: 'dialog',
  size: 'normal',
};

export function Modal({
  centered = defaults.centered,
  className = defaults.className,
  closeOthers,
  buttons = defaults.buttons,
  footer,
  mask = defaults.mask,
  maskClosable = defaults.maskClosable,
  role = defaults.role,
  size = defaults.size,
  ...props
}: ModalProps) {
  const item = useUiItem();
  const focusRootRef = useFocusLock();
  useScrollLock();
  useEsc(() => item?.destroy('close'));

  function onWrapClick(e: MouseEvent<HTMLDivElement>) {
    if (
      maskClosable &&
      (e.target as HTMLDivElement)?.classList.contains('rd-modal-wrapper')
    ) {
      item.destroy('close');
    }
  }

  const cssClass = cls('rd-modal', size && `rd-${size}`, className);
  const wrapCssClass = cls('rd-modal-wrapper', centered && 'rd-centered');
  return (
    <>
      {mask && <Mask aria-hidden />}
      <div aria-hidden className={wrapCssClass} onClick={onWrapClick}>
        <Dialog
          aria-modal
          buttons={buttons}
          className={cssClass}
          footer={footer}
          ref={focusRootRef}
          role={role}
          {...props}
        />
      </div>
    </>
  );
}

Modal.defaults = defaults;

Modal.show = createShowFunction();
Modal.info = createShowFunction({ type: 'info' });
Modal.success = createShowFunction({ type: 'success' });
Modal.warning = createShowFunction({ type: 'warning' });
Modal.error = createShowFunction({ type: 'error' });

Modal.destroyAll = (result?: unknown) => {
  for (const item of dialogues.internal.state.getItemsByType('modal')) {
    item.destroy(result);
  }
};

function createShowFunction(overrides: ModalProps = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TResult = any,>(props: ModalProps): RdItem<ModalProps, TResult> => {
    const mergedProps = {
      closeOthers: defaults.closeOthers,
      ...overrides,
      ...props,
    };

    if (mergedProps.closeOthers) {
      dialogues.internal.state.getItemsByType('modal').forEach((item) => {
        item.destroy('close');
      });
    }

    const element = dialogues.internal.state.add<ModalProps, TResult>({
      type: 'modal',
      props: mergedProps,
      component: props.component || Modal,
    });

    dialogues.internal.ensurePortalRendered();

    return element;
  };
}

function useFocusLock() {
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);
  const disabledElementsRef = useRef<Element[]>([]);

  useEffect(() => {
    if (!rootEl || typeof window === 'undefined') {
      return undefined;
    }

    disabledElementsRef.current = Array.from(
      document.querySelectorAll('body > *'),
    ).filter((el) => !el.contains(rootEl));

    disabledElementsRef.current.forEach((el) => el.setAttribute('inert', ''));

    return () =>
      disabledElementsRef.current.forEach((el) => el.removeAttribute('inert'));
  }, [rootEl]);

  return setRootEl;
}

function useScrollLock() {
  const oldOverflowRef = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    oldOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = oldOverflowRef.current;
    };
  }, []);
}

function useEsc(onPress: () => void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onPress();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onPress]);
}

export interface ModalProps extends DialogProps {
  fullscreen?: boolean;
  centered?: boolean;
  closeOthers?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  size?: ModalSize;
}

export type ModalSize = 'normal' | 'large' | 'full';
