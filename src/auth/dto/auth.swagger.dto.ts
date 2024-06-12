import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSwaggerDto {
  @ApiProperty({
    description: 'User information',
    example: {
      id: 'bf9cd525-3b3b-4c6f-9de4-7be258448de2',
      createdAt: '2024-06-10T21:43:44.762Z',
      updatedAt: '2024-06-10T21:43:44.762Z',
      email: 'admin@gmail.com',
      name: 'Test Testovich',
      role: Role.ADMIN,
    },
  })
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name?: string;
    role: Role;
  };

  @ApiProperty({
    description: 'Access token for authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmOWNkNTI1LTNiM2ItNGM2Zi05ZGU0LTdiZTI1ODQ0OGRlMiIsImlhdCI6MTcxODEyNjQyMSwiZXhwIjoxNzE4MTMwMDIxfQ.aBZHnssIjX0FEQ-UIgDmThesceV4DRWVc4aXVf_jMb4',
  })
  accessToken: string;
}
