import { Controller, Get, UseGuards, Request, Patch, Body, Post, Param, UseInterceptors, UploadedFile, Delete, Req, } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest } from 'express';
import { File as MulterFile } from 'multer';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ForbiddenException } from '@nestjs/common';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: number;
    email: string;
    name: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('Dados recebidos no cadastro:', createUserDto);
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getPerfil(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('editar')
  updatePerfil(
    @Request() req: AuthenticatedRequest,
    @Body() body: { name: string; email: string }
  ) {
    return this.usersService.updateUserAdmin(req.user.sub, body);
  }

  @Patch('updateUser')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async updateUser(
    @Req() req,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: MulterFile,
  ) {
    const userId = req.user.userId;
    if (file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      dto.avatar = `${baseUrl}/uploads/${file.filename}`;
    }
    return this.usersService.updateUser(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFoto(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: MulterFile,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/uploads/${file.filename}`;
    return { avatar: avatarUrl };
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: MulterFile,
    @Body() body: any,
    @Request() req: any
  ) {
    const userId = Number(id);
    const loggedUser = req.user;

    const isAdmin = loggedUser.role === 'ADMIN';
    const isOwner = loggedUser.userId === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Você não tem permissão para atualizar este usuário.');
    }

    const updateData: any = {
      name: body.name,
      email: body.email,
    };

    if (isAdmin && body.role) {
      updateData.role = body.role;
    }

    if (file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      updateData.avatar = `${baseUrl}/uploads/${file.filename}`;
    }

    return this.usersService.updateUserAdmin(userId, updateData);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
