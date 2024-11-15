import { GraphQLResolveInfo, SelectionSetNode } from "graphql";
import { BaseEntity } from "typeorm";
import { RelationMetadata } from "typeorm/metadata/RelationMetadata";

/**
 * Simple approach to check if a key is present in the graphql request
 * And check if the key has a selection set (subquery)
 * @param info Information about the resolved query (can be obtained with `@Info() info`)
 * @param relationName The key name we want to find in the request
 * @returns True if the key is found (with a subquery)
 */
function hasRelation(info: GraphQLResolveInfo, relationName: string) {
  const selections = info?.fieldNodes?.[0]?.selectionSet?.selections;
  if (selections) {
    const entry = selections.find(
      (selection) =>
        selection.kind === "Field" &&
        selection.name.kind === "Name" &&
        selection.name.value === relationName
    );
    return entry?.kind === "Field" && !!entry?.selectionSet;
  }
}

// This parse the graphql request and keep only fields
// with a subselection (which may be relations)
function parseSelectionSet(
  set: SelectionSetNode,
  levelPossibleRelations: object
) {
  if (set.kind === "SelectionSet" && set.selections?.length > 0) {
    for (const entry of set.selections) {
      if (
        entry.kind === "Field" &&
        entry.selectionSet?.kind === "SelectionSet"
      ) {
        levelPossibleRelations[entry.name.value] = {};
        parseSelectionSet(
          entry.selectionSet,
          levelPossibleRelations[entry.name.value]
        );
      }
    }
  }
}

// this parse the possible relations keeping only real
// TypeORM relations
function checkRelation(
  possibleRelations: object,
  entityRelations: RelationMetadata[],
  relations: object
) {
  if (Object.keys(possibleRelations).length > 0) {
    const entityRelationsMap = {};
    for (const relation of entityRelations) {
      entityRelationsMap[relation.propertyName] =
        relation.inverseEntityMetadata.relations;
    }

    for (const possibleRelation in possibleRelations) {
      if (entityRelationsMap[possibleRelation]) {
        relations[possibleRelation] = {};
        checkRelation(
          possibleRelations[possibleRelation],
          entityRelationsMap[possibleRelation],
          relations[possibleRelation]
        );
      }
    }
  }
}

/**
 * This extracts TypeORM relations from the GraphQL request
 * @param info Information about the resolved query (can be obtained with `@Info() info`)
 * @param entity The TypeORM entity class (used to extract relations)
 * @returns An object in which each keys is the relation name to satisfy, and its value is the related relations to satisfy
 */
export function makeRelations(
  info: GraphQLResolveInfo,
  entity: typeof BaseEntity
) {
  // we want to extract possible asked relations from the graphql request based
  // on the requested fields and if the field has (or not) subselection
  // from this answer: https://stackoverflow.com/questions/50548188/graphql-how-to-do-a-join-request-instead-of-many-sequential-request
  const possibleRelations = {};
  const baseSelectionSet = info?.fieldNodes?.[0]?.selectionSet;
  if (!baseSelectionSet) {
    return {};
  }
  parseSelectionSet(baseSelectionSet, possibleRelations);

  // but since graphql request may have subselections for something else than SQL relations, we should
  // parse all possible relations and check if it's a real SQL relation based on the TypeORM entity
  // from this answer: https://stackoverflow.com/questions/62757637/get-list-of-relations-for-an-entity-in-typeorm
  const repository = entity.getRepository();
  const entityRelations = repository.metadata.relations;
  const relations = {};
  checkRelation(possibleRelations, entityRelations, relations);

  return relations;
}

/**
 * example of use:
 *
 * @Query(() => [Category])
 * async function categories(@Info() info: GraphQLResolveInfo): Promise<Category[]> {
 *   return await Category.find({
 *     relations: makeRelations(info, Category)
 *   });
 * }
 */
