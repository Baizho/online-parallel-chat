import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    username: string;
    content: string;
}

const MessageSchema: Schema = new Schema({
    username: {type: String, required:true},
    content: {type:String, required:true},
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;