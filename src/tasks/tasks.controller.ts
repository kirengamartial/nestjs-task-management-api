import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private taskService: TasksService) {}
  
    @Get()
    getTasks(
      @Query(ValidationPipe) filterDto: GetTasksFilterDto,
      @GetUser() user: User
    ): Promise<Task[]> {
      this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
      return this.taskService.getTasks(filterDto, user);
    }
  
    @Get('/:id') 
    getTaskById(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User
    ): Promise<Task> {
       return this.taskService.getTaskById(id, user);
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
      @Body() createTaskDto: CreateTaskDto,
      @GetUser() user: User
    ): Promise<Task> {
      this.logger.verbose(`User "${user.username}" creating new task. Data: ${JSON.stringify(createTaskDto)}`);
      return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User
    ): Promise<void> {
      return this.taskService.deleteTask(id, user);
    }
   
    @Patch('/:id/status')
    updateTaskStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('status', TaskStatusValidationPipe) status: TaskStatus,
      @GetUser() user: User
    ): Promise<Task> {
     return this.taskService.updateTaskStatus(id, status, user);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      return this.taskService.saveImage(file);
    }
}