import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from "typeorm";
import { ProductOwner } from "../product-owners/product-owner.entity";
import { ProductAttributes } from "./product.interface";

@Check("CHK_PRODUCT_PRICE_NONNEG", "price >= 0")
@Check("CHK_PRODUCT_INVENTORY_NONNEG", "inventory >= 0")
@Entity()
export class Product extends BaseEntity implements ProductAttributes {
  constructor(defaults?: Partial<ProductAttributes>) {
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
  sku: string;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => (value == null ? null : value.toFixed(2)),
      from: (value: string) => (value == null ? null : parseFloat(value)),
    },
  })
  price: number;

  @Column({ type: "int", default: 0 })
  inventory: number;

  @Column({
    type: "enum",
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  })
  status: ProductAttributes["status"];

  @Column({ type: "uuid" })
  ownerId: string;

  @ManyToOne(() => ProductOwner, (owner) => owner.products, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "ownerId" })
  owner: ProductOwner;
}
