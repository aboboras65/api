import { randomUUID } from "crypto"
import { sql } from './db.js'

export class DatabasePostgres {
    async list(search) {
        let tasks
        
        if(search) {
            tasks = await sql`SELECT * FROM tasks WHERE TITLE ILIKE ${'%' + search + '%'}`
        } else {
            tasks = await sql`SELECT * FROM tasks`
        }
        
        return tasks
    }
    
    async create(task) {
        const taskId = randomUUID()
        
        const { tag, title, description, status } = task
        
        await sql`INSERT INTO tasks (id, tag, title, description, status) VALUES (${taskId}, ${tag}, ${title}, ${description}, ${status})`
    }
    
    async update(id, task) {
        const { tag, title, description, status } = task
        
        await sql`UPDATE tasks set tag = ${tag}, title = ${title}, description = ${description}, status = ${status} WHERE id = ${id}`
    }
    
    async getTags(tag) {
        const tags = await sql`SELECT tag FROM tasks WHERE tag ILIKE ${'%' + tag + '%'}`

        return tags
    }

    async changeStatus(tag) {
        await sql`UPDATE tasks set status = NOT status WHERE tag = ${tag}`
    }

    async getStatus(tag) {
        await sql`select status from tasks where tag = ${tag}`
    }

    async delete(id) {
        const status = await sql`DELETE FROM tasks WHERE tag = ${id}`

        return status
    }
}