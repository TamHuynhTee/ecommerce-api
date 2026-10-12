import { CoreEntity } from 'src/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity({
  name: 'products',
})
export class Product extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @Column({
    type: 'boolean',
    default: true,
    nullable: true,
    name: 'is_active',
  })
  isActive: boolean;
}
