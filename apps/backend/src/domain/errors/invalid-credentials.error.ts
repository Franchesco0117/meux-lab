export class InvalidCredentialsError extends Error {
  constructor(message = 'Correo o contraseña inválidos.') {
    super(message);
    this.name = 'InvalidCredentialsError';
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
