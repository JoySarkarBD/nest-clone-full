import { Body } from "../../common/decorators/body.decorator";
import { Controller } from "../../common/decorators/controller.decorator";
import { Param } from "../../common/decorators/param.decorator";
import { Get, Post } from "../../common/decorators/route.decorator";
import { UseGuards } from "../../common/decorators/use-guards.decorator";
import { UseInterceptors } from "../../common/decorators/use-interceptors.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { LoggingInterceptor } from "../../common/interceptors/logging.interceptor";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

/**
 * UserController
 */
@Controller("/users")
export class UserController {
  constructor(private service: UserService) {}

  @Get("/")
  find() {
    return this.service.findAll();
  }

  @Post("/:id")
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  create(@Param("id") id: string, @Body(CreateUserDto) dto: CreateUserDto) {
    return { id, dto };
  }
}
