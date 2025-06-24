export type Hook<T> = (input: T) => Promise<T> | T;
// export type HookSet<T> = Set<Hook<T>>;

export class HookSet<T> extends Set<Hook<T>> {}

export async function resolveHooks<T>(
  input: T,
  hooks: Iterable<Hook<T>>,
): Promise<T> {
  let value = input;
  for (const hook of hooks) {
    value = await Promise.resolve(hook(value));
  }

  return value;
}
