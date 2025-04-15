import { DataSource } from "typeorm";

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
});
