import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterResponse } from './interfaces/register-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && (await bcrypt.compare(pass, user.password))) {
        // Solo devuelve el usuario sin 'password'
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          // Agrega otros campos que necesites sin incluir 'password'
        };
      }
      return null;
    } catch (error) {
      console.error('Error en la validación del usuario:', error);
      throw new UnauthorizedException('Error en la validación del usuario');
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload: JwtPayload = {
        sub: user.id.toString(),
        email: user.email,
        role: user.role,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<RegisterResponse> {
    try {
      // Intenta crear un usuario
      const createdUser = await this.usersService.create(createUserDto);

      // Prepara el payload para el token JWT
      const payload: JwtPayload = {
        sub: createdUser.id.toString(),
        email: createdUser.email,
        role: createdUser.role,
      };

      // Genera el token JWT
      const token = this.jwtService.sign(payload);

      // Devuelve el usuario y el token
      return { user: createdUser, token };
    } catch (error) {
      // Manejo de errores específicos
      if (error.message.includes('Email already registered')) {
        throw new ConflictException('El email ya está registrado');
      }
      console.error('Error al registrar el usuario:', error);
      throw new UnauthorizedException('Error al registrar el usuario');
    }
  }

  async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
