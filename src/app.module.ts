import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { UserModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ProductModule } from './modules/products/products.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CartModule,
    ProductModule,
    ProfileModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true, //process.env.NODE_ENV === 'development',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '123456',
        database: 'nestjs-ecommerce',
      }),
    }),
  ],
  controllers: [],
})
export class AppModule {}
