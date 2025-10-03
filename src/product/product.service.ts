import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductService extends PrismaClient implements OnModuleInit {

  private logger = new Logger('ProductService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async create(createProductDto: CreateProductDto) {
    return this.product.create({
      data:createProductDto
    });
  }

  async findAll(paginationDto : PaginationDto) {
    const {page =1,limit = 10} = paginationDto
    const totalPages =await this.product.count({where: {available:true}});
    const lastPages = Math.ceil(totalPages / limit);
    return{
      data: await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where:{available:true}
    }),
    meta:{
      page:page,
      total: totalPages,
      lastPages:lastPages
    }
    }
  }

 async findOne(id: number) {
    const product = await this.product.findUnique({
      where:{id,available:true}
    });

    if(!product){
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    console.log("la data",updateProductDto)

    const {id:__, ...data} = updateProductDto;
   return this.product.update({
      where: {id},
      data: data
    })
  }

  async remove(id: number) {
    await this.findOne(id);
    const product = await this.product.update({
      where:{id},
      data: {available:false}
    })

    return product;
  }
}
