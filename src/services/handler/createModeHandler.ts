import { Mode } from '../../types/mode';
import { AutoModeHandler } from './AutoModeHandler';
import { HintModeHandler } from './HintModeHandler';
import type { IBookmarkModeHandler } from './interfaces/IBookmarkModeHandler';
import { OffModeHandler } from './OffModeHandler';
import type { IBookmarkRuleRepository } from '../../repository/interfaces/IBookmarkRuleRepository';

export function createModeHandler(mode: Mode, ruleRepository: IBookmarkRuleRepository): IBookmarkModeHandler {
  switch (mode) {
    case Mode.AUTO:
      return new AutoModeHandler(ruleRepository);
    case Mode.HINT:
      return new HintModeHandler(ruleRepository);
    case Mode.OFF:
      return new OffModeHandler();
  }
}
