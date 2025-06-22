import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotebookService } from './notebook.service';
import { CreateNotebookDto } from './dtos/create-notebook.dtos';
import { UpdateNotebookDto } from './dtos/update-notebook.dtos';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('notebook')
@UseGuards(JwtAuthGuard) // Protect all notebook routes
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Post()
  async create(@Body() data: CreateNotebookDto, @Request() req) {
    const userId = req.user.id;
    return this.notebookService.create(data, userId);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return this.notebookService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.notebookService.findOne(Number(id), userId);
  }

  @Get('title/:title')
  async findByTitle(@Param('title') title: string, @Request() req) {
    const userId = req.user.id;
    return this.notebookService.findByTitle(title, userId);
  }

  @Get('search/:query')
  async search(@Param('query') query: string, @Request() req) {
    const userId = req.user.id;
    return this.notebookService.search(query, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateNotebookDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.notebookService.update(Number(id), data, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.notebookService.delete(Number(id), userId);
  }
}
