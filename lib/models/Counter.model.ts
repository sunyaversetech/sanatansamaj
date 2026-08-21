import mongoose, { Schema, type InferSchemaType } from "mongoose";

// One document per membership ID prefix (AMS, AMF, LF), atomically
// incremented to hand out "PREFIX-00001"-style sequential ids.
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 0 },
});

export type CounterDoc = InferSchemaType<typeof CounterSchema>;

export const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
