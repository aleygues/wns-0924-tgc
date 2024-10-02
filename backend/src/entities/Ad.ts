import { IsEmail, IsUrl, Length, Max, Min } from "class-validator";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Tag } from "./Tag";

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => {
      return Category;
    },
    (category) => category.ads
    /* { eager: true } */
  )
  category!: Category;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  tags!: Tag[];

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

  @BeforeInsert()
  private setCreatedAt() {
    this.createdAt = new Date();
  }
}
