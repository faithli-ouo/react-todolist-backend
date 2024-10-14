import { Hono } from 'hono'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/connect';
import { db } from './db/db';
import { insertTodo, todolist, todostatus } from './db/schema';
import { eq } from 'drizzle-orm';
import { cors } from 'hono/cors'


const app = new Hono()


app.use(
  '*',
  cors({
    origin: ['http://localhost:4000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)

app.get('/', async (c) => {
  const data = await (await db).select().from(todolist)
  return c.json(data)
})

app.put('/:id',async (c) => {
  const item_id = Number(c.req.param("id"))

  if(!item_id){
    return c.text('Invalid ID', 400)
  }
  const form = await c.req.formData()
  const name = form.get('name')?.toString();
  if (!name) {
    return c.text('Name Error', 400)
  }
  const formStatus = form.get('status')?.toString() ?? 'undo';
  if (!name) {
    return c.text('Status Error', 400)
  }
  const validStatuses: todostatus[] = ["undo" , "processing" , "finish"];
  const status: todostatus = validStatuses.includes(formStatus as todostatus) 
  ? (formStatus as todostatus) 
  : 'undo';

  const data:insertTodo = {name: name, status: status}
  
  const res = await (await db)
  .update(todolist)
  .set(data)
  .where(eq(todolist.id,item_id))
  .returning({updateID: todolist.id})
  
  return c.text(`Update Success`, 200)
  
  
})

app.post('/', async (c) => {
  const form = await c.req.formData()
  const name = form.get('name')?.toString() ?? "name";
  const formStatus = form.get('status')?.toString() ?? 'undo';
  const validStatuses: todostatus[] = ["undo" , "processing" , "finish"];
  const status: todostatus = validStatuses.includes(formStatus as todostatus) 
  ? (formStatus as todostatus) 
  : 'undo';

  const data:insertTodo = {name: name, status: status}
  const res = await (await db)
  .insert(todolist)
  .values(data)
  .returning({insertID: todolist.id})

  return c.text(`Insert Success ID:${res[0].insertID}`)
  
  
})

app.delete('/:id', async (c) => {
  const item_id = Number(c.req.param('id'));
  if(!item_id || item_id < 0) {
    return c.text('Invalid Item ID', 400)
  }
  const res = await (await db).delete(todolist).where(eq(todolist.id, item_id)).returning({deleteID: todolist.id});
  
  return c.text(`Delete Success ID: ${res[0].deleteID}`, 200)
})


export default app
