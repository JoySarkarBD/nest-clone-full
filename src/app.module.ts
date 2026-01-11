import { Module } from "./common/decorators/module.decorator";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [UserModule],
})
export class AppModule {}
