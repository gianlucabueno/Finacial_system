import {
   
    IsString,
    IsNumber,
  } from 'class-validator';
  
  export class CreateTransactionDto  {

    @IsNumber()
    user_Id: number;
    
    @IsNumber()
    value: number;
  
    @IsString()
    description: string;

    @IsNumber()
    type: number;
  }
  
