import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { MessageDto } from './models/message-dto';
import { MessagesService } from './services/messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}
  @Get()
  getAll(@Res() response: Response): void {
    this.messageService
      .getAll()
      .then((msgList) => {
        response.status(HttpStatus.OK).json(msgList);
      })
      .catch((error) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ error, msg: 'error in get messages list' });
      });
  }

  @Get(':id')
  getById(@Res() response: Response, @Param('id') messageId: number): void {
    this.messageService
      .getById(messageId)
      .then((msg) => {
        response.status(HttpStatus.OK).json(msg);
      })
      .catch((error) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ error, msg: 'error in get messages' });
      });
  }

  @Post()
  create(@Body() newMessageDto: MessageDto, @Res() response: Response): void {
    this.messageService
      .create(newMessageDto)
      .then((msg) => {
        response.status(HttpStatus.CREATED).json(msg);
      })
      .catch((error) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ error, msg: 'error in creation message entity' });
      });
  }

  @Put(':id')
  update(
    @Body() updateMessageDto: MessageDto,
    @Res() response: Response,
    @Param('id') messageId: number,
  ): void {
    this.messageService
      .update(messageId, updateMessageDto)
      .then((msg) => {
        response.status(HttpStatus.OK).json(msg);
      })
      .catch((error) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ error, msg: 'error in update message entity' });
      });
  }

  @Delete(':id')
  delete(@Res() response: Response, @Param('id') messageId: number): void {
    this.messageService
      .delete(messageId)
      .then((resp) => {
        response.status(HttpStatus.OK).json(resp);
      })
      .catch((error) => {
        response
          .status(HttpStatus.FORBIDDEN)
          .json({ error, msg: 'error in delete message entity' });
      });
  }
}
