import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales del usuario. Si las credenciales son correctas, retorna los datos del usuario sin la contraseña.
   * @param email - El correo del usuario.
   * @param pass - La contraseña del usuario.
   * @returns - Los datos del usuario o null si las credenciales no son válidas.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Genera un token JWT para el usuario.
   * @param user - Los datos del usuario.
   * @returns - Un objeto con el token JWT.
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registra un nuevo usuario en el sistema con la contraseña hasheada.
   * @param userData - Los datos para crear un nuevo usuario.
   * @returns - El usuario recién creado.
   */
  async register(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.usersService.create({ ...userData, password: hashedPassword });
  }
}
