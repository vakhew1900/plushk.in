import type { ComponentType } from 'react';
import type { IconSize } from './icon-size';
import { IconName } from '@/types/icon-name';
import { IconLibrary } from './IconLibrary';
import { IconNetwork } from './IconNetwork';
import { IconLink } from './IconLink';
import { IconHome } from './IconHome';
import { IconFolder } from './IconFolder';
import { IconFileText } from './IconFileText';
import { IconVideo } from './IconVideo';
import { IconGraduationCap } from './IconGraduationCap';
import { IconMusic } from './IconMusic';
import { IconCode } from './IconCode';
import { IconWrench } from './IconWrench';
import { IconNewspaper } from './IconNewspaper';
import { IconPenLine } from './IconPenLine';
import { IconMessageSquare } from './IconMessageSquare';
import { IconImage } from './IconImage';
import { IconClapperboard } from './IconClapperboard';
import { IconMap } from './IconMap';
import { IconShoppingCart } from './IconShoppingCart';
import { IconGamepad } from './IconGamepad';
import { IconLightbulb } from './IconLightbulb';

interface IconComponentProps {
  size?: IconSize;
}

/** Maps every entity-pickable `IconName` to its icon component. */
export const ICON_REGISTRY: Record<IconName, ComponentType<IconComponentProps>> = {
  [IconName.LIBRARY]: IconLibrary,
  [IconName.NETWORK]: IconNetwork,
  [IconName.LINK]: IconLink,
  [IconName.HOME]: IconHome,
  [IconName.FOLDER]: IconFolder,
  [IconName.ARTICLE]: IconFileText,
  [IconName.VIDEO]: IconVideo,
  [IconName.COURSE]: IconGraduationCap,
  [IconName.MUSIC]: IconMusic,
  [IconName.CODE]: IconCode,
  [IconName.TOOL]: IconWrench,
  [IconName.NEWS]: IconNewspaper,
  [IconName.BLOG]: IconPenLine,
  [IconName.FORUM]: IconMessageSquare,
  [IconName.IMAGE]: IconImage,
  [IconName.MOVIE]: IconClapperboard,
  [IconName.MAP]: IconMap,
  [IconName.SHOPPING]: IconShoppingCart,
  [IconName.GAME]: IconGamepad,
  [IconName.IDEA]: IconLightbulb,
};
