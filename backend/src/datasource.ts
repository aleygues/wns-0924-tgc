import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from "typeorm";

@EventSubscriber()
export class AccessesSubscriber implements EntitySubscriberInterface<any> {
  async beforeRemove(event: RemoveEvent<any>) {
    const context = event.queryRunner.data?.context;

    if (!context) {
      throw new Error("context not found, you should pass it when removing");
    }

    if (!context.user) {
      throw new Error("context.user is undefined, you are not connected");
    }

    if (
      context.user.role !== "admin" &&
      "createdBy" in event.metadata.propertiesMap
    ) {
      const entityWithCreatedBy =
        "createdBy" in event.entity
          ? event.entity
          : await event.manager.findOne(event.entity.constructor, {
              where: { id: event.entityId },
              relations: ["createdBy"],
            });
      if (entityWithCreatedBy.createdBy.id !== context.user.id) {
        throw new Error("this is not YOUR resource");
      }
    }
  }
}

export const datasource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "db", // 172.12.10.10
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ["./src/entities/*.ts"],
  synchronize: true,
  logging: true,
  subscribers: [AccessesSubscriber],
});
