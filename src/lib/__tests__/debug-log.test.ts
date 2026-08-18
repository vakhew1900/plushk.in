import { afterEach, describe, expect, it, vi } from 'vitest';
import { debugLog } from '../debug-log';

describe('debugLog', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('logs while running under `wxt dev` (COMMAND === "serve")', () => {
    vi.stubEnv('COMMAND', 'serve');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    debugLog('hello', { foo: 'bar' });

    expect(spy).toHaveBeenCalledWith('hello', { foo: 'bar' });
  });

  it('stays silent in a production build (COMMAND === "build")', () => {
    vi.stubEnv('COMMAND', 'build');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    debugLog('hello');

    expect(spy).not.toHaveBeenCalled();
  });
});
