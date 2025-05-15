import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateUserAdmin(id: number, data: Partial<User>) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new Error('Usuário não encontrado');

    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

  async updateUser(userId: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new Error('Usuário não encontrado');

    if (typeof dto.password === 'string' && dto.password.trim() !== '') {
      const salt = 10;
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    Object.assign(user, dto);
    return await this.usersRepository.save(user);
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: {
        id: 'ASC'
      }
    });
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new Error('Usuário não encontrado');
    await this.usersRepository.remove(user);
    return { message: 'Usuário excluído com sucesso' };
  }
}
