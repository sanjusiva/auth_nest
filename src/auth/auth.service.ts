import { Injectable, NotFoundException } from '@nestjs/common';
import {faker} from '@faker-js/faker'
import { IAuthenticate, Role } from './interface/user.interface';
import { AuthenticateDto } from './dto/authenticate.dto';
import {sign} from 'jsonwebtoken'
@Injectable()
export class AuthService {
    users=[
        {
            id:faker.datatype.uuid(),
            userName:'Sanjitha',
            password:'Sanju123',
            role:Role.Admin
        },
        {
            id:faker.datatype.uuid(),
            userName:'Kavya',
            password:'Kavya123',
            role:Role.Customer
        }
    ];

    authenticate(authenticateDto:AuthenticateDto):IAuthenticate{
        const user=this.users.find(
            (u)=>u.userName===authenticateDto.userName && u.password===authenticateDto.password
        );
        if(!user) throw new NotFoundException('Invalid user credentials');
        const token=sign({...user},'secrete')
        console.log("token: ",token);
        console.log("user: ",user);
        return {token,user}
    }
}
