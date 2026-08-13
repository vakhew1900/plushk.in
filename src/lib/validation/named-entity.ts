import { z } from 'zod';

// Shared across every named, user-created row (tags, entities, workflow
// statuses, domain aliases, rules) — trims first so whitespace-only input
// doesn't count as a name.
export const NonEmptyNameSchema = z.string().trim().min(1);

export function hasValidName(name: string): boolean {
  return NonEmptyNameSchema.safeParse(name).success;
}
