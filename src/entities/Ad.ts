import { IsEmail, IsUrl, Length, Max, Min } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
  title!: string;

  @Column()
  description!: string;

  @Column()
  location!: number;

  @Column()
  @IsEmail()
  owner!: string;

  @Column()
  @Min(0, { message: "Price must be positive" })
  @Max(1000000, { message: "Price must be lower than 1000000 cents" })
  price!: number;

  @Column()
  @IsUrl()
  picture!: string;

  @Column()
  createdAt!: Date;
}
