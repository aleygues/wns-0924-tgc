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

export function makeRelations(
  info: GraphQLResolveInfo,
  entity: typeof BaseEntity
) {
  // extract possible relations from graphql request
  const possibleRelations = {};
  const baseSelectionSet = info?.fieldNodes?.[0]?.selectionSet;
  if (!baseSelectionSet) {
    return {};
  }
  parseSelectionSet(baseSelectionSet, possibleRelations);

  const repository = entity.getRepository();
  const entityRelations = repository.metadata.relations;
  const relations = {};
  checkRelation(possibleRelations, entityRelations, relations);

  return relations;
}
