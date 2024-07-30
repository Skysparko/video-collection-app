import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  user: mongoose.Types.ObjectId;
  filename: string;
  url: string; // Add url to the interface
  createdAt: Date;
}

const VideoSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true }, // Add url field to the schema
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IVideo>('Video', VideoSchema);
