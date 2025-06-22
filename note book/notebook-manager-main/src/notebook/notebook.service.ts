/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotebookDto } from './dtos/create-notebook.dtos';
import { UpdateNotebookDto } from './dtos/update-notebook.dtos';

@Injectable()
export class NotebookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotebookDto, userId: number) {
    // Check for duplicate title for the same user
    const existing = await this.prisma.notebook.findFirst({
      where: {
        title: data.title,
        userId: userId,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Note with title ${data.title} already exists`,
      );
    }

    return this.prisma.notebook.create({
      data: {
        title: data.title,
        content: data.content,
        userId: userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.notebook.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const notebook = await this.prisma.notebook.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!notebook) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return notebook;
  }

  async findByTitle(title: string, userId: number) {
    const notebook = await this.prisma.notebook.findFirst({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
        userId: userId,
      },
    });

    if (!notebook) {
      throw new NotFoundException(`Note with title ${title} not found`);
    }

    return notebook;
  }

  async search(query: string, userId: number) {
    return this.prisma.notebook.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async update(id: number, data: UpdateNotebookDto, userId: number) {
    // Check if notebook exists and belongs to user
    const existing = await this.prisma.notebook.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    // Check for duplicate title if title is being updated
    if (data.title && data.title !== existing.title) {
      const duplicate = await this.prisma.notebook.findFirst({
        where: {
          title: data.title,
          userId: userId,
          id: {
            not: id,
          },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          'Another note with the same title already exists',
        );
      }
    }

    return this.prisma.notebook.update({
      where: {
        id: id,
      },
      data: {
        title: data.title,
        content: data.content,
      },
    });
  }

  async delete(id: number, userId: number) {
    // Check if notebook exists and belongs to user
    const existing = await this.prisma.notebook.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    await this.prisma.notebook.delete({
      where: {
        id: id,
      },
    });

    return {
      message: `Note with id ${id} deleted.`,
    };
  }
}
