import { Exclude } from 'class-transformer';
import { CoreEntity } from 'src/entities/core.entity';
import { Column, Entity } from 'typeorm';

export type Role = 'customer' | 'staff' | 'admin';

@Entity({ name: 'users' })
export class User extends CoreEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    default: null,
  })
  name: string | null;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    name: 'hashed_password',
  })
  @Exclude()
  hashedPassword: string;

  @Column({
    type: 'varchar',
    array: true,
    default: ['customer'],
  })
  roles: Role[];
}
