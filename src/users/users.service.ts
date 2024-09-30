import { Injectable } from '@nestjs/common';
import { DatasourceService } from '@src/datasource/datasource.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private datasourceService: DatasourceService) {}

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.datasourceService.user.update({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: {
          select: {
            id: true,
            description: true,
            name: true,
            actionsIds: true,
          },
        },
      },
      where: {
        id: userId,
      },
      data: {
        ...updateUserDto,
        updatedById: userId,
      },
    });

    return user;
  }
}
