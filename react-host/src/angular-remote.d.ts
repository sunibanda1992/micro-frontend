declare module 'angularRemote/Component' {
  export function mount(container: HTMLElement): Promise<void>;
  export function unmount(): void;
}
