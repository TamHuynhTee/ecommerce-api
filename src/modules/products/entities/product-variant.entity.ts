import { CoreEntity } from 'src/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({
  name: 'product_variants',
})
export class ProductVariant extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  sku: string;

  @Column({
    type: 'text',
    array: true,
    default: [],
    nullable: true,
  })
  images: string[];

  @Column({
    type: 'text',
    default: null,
    nullable: true,
  })
  thumbnail: string | null;

  // specification
  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
  })
  color: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: true,
  })
  stock: number;

  @Column({
    type: 'boolean',
    default: true,
    nullable: true,
    name: 'is_active',
  })
  isActive: boolean;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
