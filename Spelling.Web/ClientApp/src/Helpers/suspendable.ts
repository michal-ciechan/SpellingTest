import { DependencyList, useMemo } from 'react';

export interface Suspendable<T> {
  result: () => T;
}

export function suspendable<T>(promise: Promise<T> | T): Suspendable<T> {
  let status = 'pending';
  let response: T;

  const suspender = Promise.resolve(promise).then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;
    },
  );

  const result = () => {
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  };

  return { result };
}

export function useSuspendable<T>(
  factory: () => Promise<T>,
  deps: DependencyList | undefined = undefined,
): Suspendable<T> {
  return useMemo(() => suspendable(factory()), deps);
}
