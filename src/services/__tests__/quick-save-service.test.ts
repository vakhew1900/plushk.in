import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Mode } from '../../types/mode';
import { QuickSaveMessageType } from '../../types/quick-save-message';
import { QuickSaveService } from '../QuickSaveService';

const runtimeApi = vi.hoisted(() => ({
  sendMessage: vi.fn(),
}));

vi.mock('wxt/browser', () => ({
  browser: { runtime: runtimeApi },
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('QuickSaveService.create', () => {
  it('sends a quick-save/create message with the given input', async () => {
    runtimeApi.sendMessage.mockResolvedValueOnce(undefined);
    const service = new QuickSaveService();

    await service.create({ title: 'Foo', url: 'https://foo.com', mode: Mode.HINT, targetFolder: 'Reading' });

    expect(runtimeApi.sendMessage).toHaveBeenCalledWith({
      type: QuickSaveMessageType.CREATE,
      title: 'Foo',
      url: 'https://foo.com',
      mode: Mode.HINT,
      targetFolder: 'Reading',
    });
  });

  it('omits targetFolder when not given', async () => {
    runtimeApi.sendMessage.mockResolvedValueOnce(undefined);
    const service = new QuickSaveService();

    await service.create({ title: 'Foo', url: 'https://foo.com', mode: Mode.AUTO });

    expect(runtimeApi.sendMessage).toHaveBeenCalledWith({
      type: QuickSaveMessageType.CREATE,
      title: 'Foo',
      url: 'https://foo.com',
      mode: Mode.AUTO,
      targetFolder: undefined,
    });
  });
});
