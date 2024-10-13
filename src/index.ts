import { Hono } from 'hono'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/connect';
import { db } from './db/db';
import { insertTodo, todolist, todostatus } from './db/schema';
import { eq } from 'drizzle-orm';


const app = new Hono()

app.get('/', async (c) => {
  const data = await (await db).select().from(todolist)
  return c.json(data)
})

app.put('/:id',async (c) => {
  const item_id = Number(c.req.param("id"))
  console.log(item_id);
  
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
  
  const res = (await db)
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
  const item_id = Number(c.req.param('id'))
  if(!item_id){
    return c.text(`Unvalid ID`, 400)
  }
  const res = (await db).delete(todolist).where(eq(todolist.id, item_id)).returning({id:todolist.id})
  return c.text(`Delete Success`, 200)
})


export default app
