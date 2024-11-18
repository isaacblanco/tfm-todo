export class UserDto {
  id: number;
  username: string;
  email: string;
  password?: string; // Opcional, generalmente no se envía al cliente
  settings?: {
    numberOfTaskToShow?: number;
    projectOrder?: string;
    showDescription?: boolean;
    showEmptyTask?: boolean;
    showAllOpen?: boolean;
  };
}
