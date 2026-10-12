import { Exclude } from 'class-transformer';
import { CoreEntity } from 'src/entities/core.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity({ name: 'users' })
export class User extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: false,
    length: 24,
    unique: true,
  })
  username: string;

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
  })
  @Exclude()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile?: Profile | null;
}
