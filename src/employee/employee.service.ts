import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeStatus } from './entities/employee.entity';

@Injectable()
export class EmployeeService {

  constructor(
    @InjectRepository(Employee)
    private readonly usersRepository: Repository<Employee>,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = new Employee();
    employee.name = createEmployeeDto.name;
    employee.email = createEmployeeDto.email;
    return await this.usersRepository.save(employee);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: string) {
    const employee = await this.usersRepository.findOne({
      where: {
        id
      },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    })

    if (employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const result = await this.usersRepository.createQueryBuilder()
      .update({
        name: updateEmployeeDto.name,
        email: updateEmployeeDto.email
      })
      .where({
        id
      })
      .returning(['id', 'name', 'email', 'createdAt', 'updatedAt'])
      .execute();

    if (result.raw.length == 0) throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    return result.raw[0];
  }

  async remove(id: string) {
    const result = await this.usersRepository.createQueryBuilder()
      .update({
        status: EmployeeStatus.DELETED
      })
      .where({
        id
      })
      .returning(['id', 'name', 'email', 'createdAt', 'updatedAt'])
      .execute();

    if (result.raw.length == 0) throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    return result.raw[0];
  }

  async updateProfilePicture(id: string, file: object) {
    const result = await this.usersRepository.createQueryBuilder()
      .update({
        profilePicture: file
      })
      .where({
        id
      })
      .returning(['id', 'name', 'email', 'createdAt', 'updatedAt'])
      .execute();

    if (result.raw.length == 0) throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    return result.raw[0];
  }

  async getProfilePicture(id: string) {
    const employee = await this.usersRepository.findOne({
      where: {
        id
      },
      select: ['profilePicture']
    })

    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    if (!employee.profilePicture) {
      throw new HttpException('Employee profile picture not found', HttpStatus.NO_CONTENT);
    }
    return employee.profilePicture;
  }
}
