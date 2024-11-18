import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { MessageDto } from '../models/message-dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getAll(): Promise<MessageDto[]> {
    return await this.messageRepository.find();
  }

  async getById(messageId: number): Promise<MessageDto> {
    return await this.messageRepository.findOne(messageId);
  }

  async create(msg: MessageDto): Promise<MessageDto> {
    const newMessage = new Message();

    newMessage.title = msg.title;
    newMessage.description = msg.description;

    return this.messageRepository.save(newMessage);
  }

  async update(messageId: number, msg: MessageDto): Promise<MessageDto> {
    const updateMessage = await this.messageRepository.findOne(messageId);

    updateMessage.title = msg.title;
    updateMessage.description = msg.description;

    return this.messageRepository.save(updateMessage);
  }

  async delete(messageId: number): Promise<DeleteResult> {
    return await this.messageRepository.delete(messageId);
  }
}
