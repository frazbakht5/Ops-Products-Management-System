import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Product } from "../products/product.entity";
import { ProductOwnerAttributes } from "./product-owner.interface";

@Entity()
export class ProductOwner
  extends BaseEntity
  implements ProductOwnerAttributes
{
  constructor(defaults?: Partial<ProductOwnerAttributes>) {
    super();
    if (defaults) {
      Object.assign(this, defaults);
    }
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];
}
