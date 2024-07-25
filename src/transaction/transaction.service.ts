import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}
  async create(data: CreateTransactionDto) {
    const user = await this.userService.show(data.user_Id);
    let currentValue = user.value;
    if(data.type === 1){
      currentValue = currentValue + data.value;
    }
    else if(data.type === 2){
      currentValue = currentValue - data.value;
    }
    console.log("currentValue")
    console.log(currentValue)
    try {
      await this.prisma.transaction.create({
        data,
      });

      await this.userService.updatePartial(user.id, { value: currentValue});
      return { message: 'Transaction criada com sucesso' };
      
    } catch (error) {
      throw new BadRequestException(
        `Invalid parameters! Please review and try again!`,
      );
    }


  }
  async list(user_Id: number) {
    return await this.prisma.transaction.findMany({
      where: {
        user_Id: user_Id, 
      },
    });
  }

  async show(id: number) {
    return await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    });
  }

  async all() {
    return await this.prisma.transaction.findMany();
  }

  async updatePartial(id: number,{ description, value, type, user_Id }: UpdateTransactionDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} não encontrada`);
    }
    
    const user = await this.userService.show(user_Id);
    let currentValue = user.value;
    
    const data: any = {};
    let old_type : number;
    let old_value : number;
    old_type = transaction.type;
    old_value = transaction.value;

    if (description) data.description= description;
    
    if (type) data.type = type;
    
    if (value) data.value= value;
    


    await this.prisma.transaction.update({
      data,
      where: {
        id,
      },
    });
   
    if(type !== undefined && old_type !== undefined){
      if(old_type === 1 ){
        currentValue = currentValue - old_value
        console.log(currentValue)
      }
      else if(old_type === 2){
        currentValue = currentValue +  old_value
        console.log(currentValue)
      }
    }
    


    if(transaction.type === 1){
      currentValue = currentValue + value
    }
    else if(transaction.type === 2){
      currentValue = currentValue - value
    }
    
    await this.userService.updatePartial(user.id, { value: currentValue});

    return { message: 'Transaction atualizada com sucesso' };
  }

  async delete(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} não encontrada`);
    }

    const user = await this.userService.show(transaction.user_Id);

    let newValue = user.value;
    if (transaction.type ===1) { 
      newValue = newValue - transaction.value; 
    } else if (transaction.type === 2) { 
      newValue = newValue + transaction.value; 
    }

    await this.prisma.transaction.delete({
      where: {
        id,
      },
    });
   

    await this.userService.updatePartial(user.id, { value: newValue });

    return { message: 'Transaction deletada com sucesso' };

  }
  


  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`User ${id} does not exist!`);
    }
  }
}
