import { IdInput } from "../entities/Id";

/**
 * Merge some data on an existing database entity, it takes care of keeping existing many-to-many relations to avoid unicity constraints
 * @param entity The base entity you want to merge your incomming data on (make sure to fetch many-to-many relations)
 * @param data The data payload you want to apply on your base entity (to update)
 * @returns The merged entity (the entity is updated as well)
 */
export function merge(entity: any, data: any): any {
  // should keep existing relations
  for (const [key, value] of Object.entries(data)) {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof IdInput
    ) {
      if (!(key in entity)) {
        throw new Error(
          `missing key ${key} in your entity, did you forgot to fetch your relation?`
        );
      }
      if (Array.isArray(entity[key])) {
        data[key] = data[key].map((entry: IdInput) => {
          const existingEntry = entity[key].find(
            (entityEntry: IdInput) => entityEntry.id == entry.id
          );
          return existingEntry || entry;
        });
      }
    }
  }
  Object.assign(entity, data);
  return entity;
}
