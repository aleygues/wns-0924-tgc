import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from "typeorm";

// examples:
// await tag.remove(); → 🛑 missing context
// await tag.remove({ data: { context: { user: null } } }); → 🛑 not connected
// await tag.remove({ data: { context: { user: { id: ? } } } }); → 🤷 depending on ownership
// await context.db.remove(tag); → 🤷 depending on ownership
// await Tag.delete(tag.id); → 🛑 missing context (and cannot be given that way)
// await context.db.delete(Tag, tag.id); → 🤷 depending on ownership

@EventSubscriber()
export class AccessCheckerSubscriber implements EntitySubscriberInterface<any> {
  public async beforeRemove(event: RemoveEvent<any>) {
    // we should only handle entities with createdBy prop
    if (event.metadata.propertiesMap["createdBy"]) {
      const context =
        event.queryRunner["_context"] || event.queryRunner.data?.context;
      // context not provided
      if (!context) {
        const error = new Error(
          "Context is missing during the remove call, you should use `context.db.remove` or `Entity.remove(..., { data: { context } })` to pass the context properly"
        );
        error.name = "missing context in query runner";
        throw error;
      }
      // not connected
      const userId = context.user?.id;
      if (!userId) {
        const error = new Error(
          "There is no user in this context, is the user connected?"
        );
        error.name = "missing user in context";
        throw error;
      }
      // should get the entity first
      const entity: { createdBy: { id: number } } =
        "createdBy" in event.entity
          ? event.entity
          : await event.manager.findOne(event.entity.constructor, {
              where: { id: event.entityId },
              relations: ["createdBy"],
            });
      if (userId !== entity.createdBy.id) {
        throw new Error("you cannot delete this resource");
      }
    }
  }
}

export const datasource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "db",
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ["./src/entities/*.ts"],
  synchronize: true,
  logging: true,
  subscribers: [AccessCheckerSubscriber],
});
