import React from 'react';
import {
  Palette,
  ArrowRightLeft,
  ShieldCheck,
  BookmarkCheck,
  Zap,
  RotateCcw,
  Blocks,
  LucideProps,
} from 'lucide-react';
import { IntentArchetype } from '../types';

interface IntentIconProps extends Omit<LucideProps, 'ref'> {
  archetype: IntentArchetype;
}

export const IntentIcon: React.FC<IntentIconProps> = ({ archetype, ...props }) => {
  switch (archetype) {
    case 'expressive_composition':
      return <Palette {...props} />;
    case 'cross_language_parity':
      return <ArrowRightLeft {...props} />;
    case 'hardening_integrity':
      return <ShieldCheck {...props} />;
    case 'standardizing_de_facto':
      return <BookmarkCheck {...props} />;
    case 'runtime_vitality':
      return <Zap {...props} />;
    case 'correcting_historical_regrets':
      return <RotateCcw {...props} />;
    case 'framework_enablement':
      return <Blocks {...props} />;
    default:
      return null;
  }
};
