import { Request, Response } from 'express';
import { CreateMessageDto } from './dtos/CreateMessage.dot';
import MessageService from './message-service';

class MessageController {
    private MessageService : MessageService;


    constructor(MessageService : MessageService){
        this.MessageService = MessageService;
    }

    createMessage = async (req: Request, res: Response): Promise<void> => {
        try {
          const createMessageDto: CreateMessageDto = req.body;
          const Message = await this.MessageService.createMessage(createMessageDto);
          res.status(201).json(Message);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }

    getMessages = async (req: Request, res: Response): Promise<void> => {
        try {
          const Messages = await this.MessageService.getMessages();
          res.status(200).json(Messages);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }

    getMessageById = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const Message = await this.MessageService.getMessageById(id);
          if (!Message) {
            res.status(404).json({ message: 'Message not found' });
            return;
          }
          res.status(200).json(Message);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }
}

export default MessageController;