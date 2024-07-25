import { Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ParamId } from './../decorators/param-id.decorator';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService : TransactionService) {}
  
    @Post()
    async create(@Body() body: CreateTransactionDto) {
      return this.transactionService.create(body);
    }
  
    @Get('list')
    async list(@Query('user_id') user_id: number) {
      return this.transactionService.list(user_id);
    }
  
    @Get('show')
    async show(@Query('id') id: number) {
      return this.transactionService.show(id);
    }

    @Get()
    async all() {
      return this.transactionService.all();
    }
  
  
    @Patch(':id')
    async updatePartial(@Body() body: UpdateTransactionDto, @ParamId() id: number) {
      return this.transactionService.updatePartial(id, body);
    }
  
    @Delete(':id')
    async delete(@ParamId() id: number) {
      return this.transactionService.delete(id);
    }
}
  

