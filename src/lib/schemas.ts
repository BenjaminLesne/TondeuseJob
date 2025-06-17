import { z } from "zod";

export const CoordinateSchema = z.coerce.number()
export const DirectionSchema = z.enum(["N", "E", "S", "W"])
export const InstructionSchema = z.enum(["R", "L", "F"])