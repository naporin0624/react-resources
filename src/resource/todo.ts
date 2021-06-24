import axios from "axios";
import * as z from "zod";

const todoSchema = z.object({
  id: z.number(),
  userId: z.number(),
  completed: z.boolean(),
  title: z.string()
});
export type Todo = z.infer<typeof todoSchema>;

interface GetTodo {
  execute(): Promise<Todo[]>;
  execute(id: number): Promise<Todo>;
}

class GetTodoImpl implements GetTodo {
  execute(): Promise<Todo[]>;
  execute(id: number): Promise<Todo>;
  execute(id?: number): Promise<Todo[] | Todo> {
    return id ? this.single(id) : this.all();
  }

  private async all() {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/`);
    return todoSchema.array().parse(res.data);
  }
  private async single(id: number) {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
    return todoSchema.parse(res.data);
  }
}

export const getTodo = new GetTodoImpl();
