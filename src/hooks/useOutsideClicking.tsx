import { RefObject, useEffect } from 'react';

type EventFunction = (event: Event) => void;

export const useOutsideClicking = (ref: RefObject<HTMLElement>, eventFunction: EventFunction) => {
  useEffect(() => {
    const clickOutsideComponent = (event: Event) => {
      if (!ref.current?.contains(event.target as Node)) {
        eventFunction(event);
      }
    };

    document.addEventListener('click', clickOutsideComponent);

    return () => {
      document.removeEventListener('click', clickOutsideComponent);
    };
  });
};