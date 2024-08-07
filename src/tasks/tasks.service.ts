import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { stat } from 'fs';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    private taskRepository: TaskRepository
  ) {}
  async getTasks(
    filterDto: GetTasksFilterDto,
    user: User
  ): Promise<Task[]> {
     return this.taskRepository.getTask(filterDto, user)
  }
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //  const {status, search} = filterDto;

  //  let tasks = this.getAllTasks()

  //  if(status) {
  //     tasks = tasks.filter(task => task.status === status)
      
  //  }

  //  if(search) {
  //     tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
  //  }
  //  return tasks
  // }

  async getTaskById(
    id: number,
    user: User
  ): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
  
    if (!found) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }
  
    return found;
  }
  // getTaskById(id: string): Task {
  //   const found = this.tasks.find(task => task.id === id)

  //   if(!found){
  //   throw new  NotFoundException(`Task with Id ${id} not found`)
  //   }

  //   return found
  // }

 async createTask(
  createTaskDto: CreateTaskDto,
  user: User
): Promise<Task> {
  return this.taskRepository.createTask(createTaskDto, user)
  }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //  const {title, description} = createTaskDto
  //   const task: Task = {
  //     id: uuidv4(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

async  deleteTask(
  id: number,
  user: User
): Promise<void> {
  const result = await this.taskRepository.delete({id, userId: user.id})

   if(result.affected  === 0) {
       throw new  NotFoundException(`Task with Id ${id} not found`)
   }

  }
  // deleteTask(id: string): void{

  //  const found = this.getTaskById(id)
  //  this.tasks = this.tasks.filter(task => task.id !== found.id)
  // }

 async updateTaskStatus(
  id:number, 
  status: TaskStatus,
  user:  User
): Promise<Task> {
  const task =  await this.getTaskById(id, user);
  task.status = status
  await task.save();
  return task
  }
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //  const task =  this.getTaskById(id)

  //  task.status = status

  //  return task
  // }
}
