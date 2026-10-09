import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CartModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        entities: [],
        synchronize: process.env.NODE_ENV === 'development',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '123456',
        database: 'nestjs-ecommerce',
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
