import { CoreEntity } from 'src/entities/core.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'first_name',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 10,
  })
  gender: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'date_of_birth',
  })
  dateOfBirth: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'profile_image',
  })
  profileImage: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
