import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

   @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'get_all_products' })
  findAll(@Payload() paginationDto : PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'get_one_product' })
  findOne(@Payload('id') id: string) {
    return this.productService.findOne(+id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload('id') updateProductDto: UpdateProductDto) {
    return this.productService.update(+updateProductDto.id, updateProductDto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id') id: string) {
    return this.productService.remove(+id);
  }
}
