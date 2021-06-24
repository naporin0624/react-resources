import axios from "axios";
import * as z from "zod";

const todoSchema = z.object({
  id: z.number(),
  userId: z.number(),
  completed: z.boolean(),
  title: z.string()
});
export type Todo = z.infer<typeof todoSchema>;

export const todos = async (): Promise<Todo[]> => {
  const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/`);
  return todoSchema.array().parse(res.data);
};

export const todo = async (id: number): Promise<Todo> => {
  const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return todoSchema.parse(res.data);
};
