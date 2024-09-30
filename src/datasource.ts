import { DataSource } from "typeorm";

const datasource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: ["./src/entities/*.ts"],
  synchronize: false,
  migrations: ["./migrations/*.ts"],
  migrationsTableName: "migrations",
  logging: true,
});

export default datasource;
