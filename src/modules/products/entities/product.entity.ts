import { CoreEntity } from 'src/entities/core.entity';
import { Entity } from 'typeorm';

@Entity({
  name: 'products',
})
export class Product extends CoreEntity {}
