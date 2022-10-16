import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let employeeRespository: MockType<Repository<Employee>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: getRepositoryToken(Employee), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    employeeRespository = module.get(getRepositoryToken(Employee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const employee = { name: 'Employee test', email: 'test@mail.com' };
    const employeeCreateMock = { id: 'b9bef9a3-7c02-4a72-9359-5113d199791e', ...employee };
    employeeRespository.save.mockReturnValue(employeeCreateMock);

    const employeeRes  = await service.create(employee)
    console.log(employeeRes)
    expect(employeeRes.id).toBeDefined();
  });

  it('should find a user', async () => {
    const employee = { id: 'b9bef9a3-7c02-4a72-9359-5113d199791e', name: 'Employee test', email: 'test@mail.com' };
    employeeRespository.findOne.mockReturnValue(employee);

    const employeeRes  = await service.findOne(employee.id)
    expect(employeeRes).toEqual(employee);
  });
});

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  save: jest.fn(entity => entity),
  findOne: jest.fn(entity => entity),
}));

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};