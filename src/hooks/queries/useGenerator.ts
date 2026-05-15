/**
 * Query hooks for the generator module.
 *
 * Script generation is a POST mutation, so there are no read-side queries yet.
 * This file is kept as a placeholder so the hooks/queries/useGenerator
 * convention is already in place for future read endpoints
 * (e.g. fetching saved scripts, generation history, etc.).
 */

export const generatorKeys = {
  all: ["generator"] as const,
  history: () => [...generatorKeys.all, "history"] as const,
};
