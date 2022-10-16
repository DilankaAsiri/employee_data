import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseUUIDPipe, UploadedFile, UseInterceptors, StreamableFile, Res, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeeService.create(createEmployeeDto);
  }

  @Get()
  async findAll() {
    return await this.employeeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: "4" })) id: string) {
    return await this.employeeService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe({ version: "4" })) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return await this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: "4" })) id: string) {
    return await this.employeeService.remove(id);
  }

  @Patch(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(@Param('id', new ParseUUIDPipe({ version: "4" })) id: string, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10485760 }),
      ]
    })
  ) file: Express.Multer.File) {
    return await this.employeeService.updateProfilePicture(id, file);
  }

  @Get(':id/profile-picture')
  async getProfilePicture(@Param('id', new ParseUUIDPipe({ version: "4" })) id: string, @Res({ passthrough: true }) res: Response) {
    const employeeProfilePicture = await this.employeeService.getProfilePicture(id);
    res.set({
      'Content-Type': employeeProfilePicture.mimetype,
    });
    return new StreamableFile(Buffer.from(employeeProfilePicture.buffer.data))
  }
}
