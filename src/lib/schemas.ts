import { z } from "zod";

export const CoordinateSchema = z.coerce.number()
export const DirectionSchema = z.enum(["N", "E", "S", "W"])
export const InstructionSchema = z.enum(["R", "L", "F"])
export const EvenLengthStringSchema = z.string().refine(s => s.length % 2 === 0, {
    message: 'String length must be even',
  });