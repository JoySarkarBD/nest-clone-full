
import { Injectable } from '../../common/decorators/injectable.decorator';

/**
 * UserService
 */
@Injectable()
export class UserService {
  findAll() {
    return ['Joy', 'Alex'];
  }
}
