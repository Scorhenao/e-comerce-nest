export interface JwtPayload {
  sub: string; // ID del usuario
  email?: string; // Correo del usuario, opcional
  role?: string; // Rol del usuario, opcional
}
