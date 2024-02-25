import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

const database = new DatabasePostgres()


server.get('/tasks', async (request, reply) => {
    const search = request.query.search
    const tasks = await database.list(search)

    return tasks
})


server.get('/tasks/tag/:tag', async (request, reply) => {
    const search = request.params.tag
    const tags = await database.getTags(search)

    return tags
})


server.post('/task', async (request, reply) => {
    const { tag, title, description, status } = request.body

    await database.create({
        tag,
        title,
        description,
        status
    })

    return reply.status(201).send()
})


server.put('/task/:id', async (request, reply) => {
    const taskId = request.params.id
    const { tag, title, description, status } = request.body

    await database.update(taskId, {
        tag,
        title,
        description,
        status
    })

    return reply.status(204).send()
})


server.put('/task/status/:tag', async (request, reply) => {
    const taskTag = request.params.tag
    
    await database.changeStatus(taskTag)

    return reply.status(204).send()
})


server.delete('/task/:id', async(request, reply) => {
    const taskId = request.params.id

    await database.delete(taskId)

    reply.status(204).send()
})

server.listen({port: process.env.PORT ?? 3333})
