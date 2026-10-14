import { Timestamp } from 'src/entities/timestamp.entity';
import { ProductVariant } from 'src/modules/products/entities/product-variant.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('cart_items')
@Check('"quantity" > 0')
export class CartItem extends Timestamp {
  @PrimaryColumn({
    type: 'uuid',
    name: 'user_id',
  })
  userId: string;

  @PrimaryColumn({
    type: 'uuid',
    name: 'product_variant_id',
  })
  productVariantId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ProductVariant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariant;

  @Column({ type: 'integer', default: 1 })
  quantity: number;
}
