export class UserDto {
  id_user: number;
  username: string;
  email: string;
  password?: string; // Opcional, generalmente no se envía al cliente
  settings?: {
    numberType?: boolean;
    numberOfTaskToShow?: number;
    projectOrder?: string;
    showDescription?: boolean;
    showEmptyTask?: boolean;
    showAllOpen?: boolean;
    showCompleted?: boolean;
  };
}
