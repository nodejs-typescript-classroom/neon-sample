import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  greeting(): string {
    return 'hello';
  }
}
