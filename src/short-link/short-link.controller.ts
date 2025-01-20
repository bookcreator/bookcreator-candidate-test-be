import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ShortLinkService } from './short-link.service';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { getShortLinkParamDto } from './dto/get-short-link-param.dto';

@Controller('short-link')
export class ShortLinkController {
  constructor(private readonly shortLinkService: ShortLinkService) {}

  @Post()
  @ApiBody({ type: CreateShortLinkDto })
  @ApiOperation({
    summary: 'Create a shortened URL slug',
    description:
      'Generates a shortened URL slug that can be used to redirect to the original URL. Use the generated slug with the `GET short-link/:id` endpoint to perform the redirection.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Shortened URL slug created successfully',
    schema: {
      example: {
        shortUrlSlug: 'abc123', // Example of a generated slug
        redirectUrl: 'http://localhost:3000/api/v1/abc123',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid url provided',
    schema: {
      example: {
        message: ['url must be a full URL address including protocol'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async create(
    @Body() createShortLinkDto: CreateShortLinkDto,
    @Req() req: Request,
  ) {
    const shortUrlSlug = await this.shortLinkService.create(
      createShortLinkDto.url,
    );
    return {
      shortUrlSlug,
      // Basic build of redirectURL -- it would be possible to use Reflector from NestJS to determine it or get it from config
      redirectUrl: `${req.protocol}://${req.get('host')}/api/v1/short-link/${shortUrlSlug}`,
    };
  }

  @Get('/:id')
  @Redirect()
  @ApiOperation({
    summary: 'Redirect to the original URL from a shortened link',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description:
      'Returns 302 redirect with Location header. Please note that if the resultant server has restrictive CORS enabled it will fail in the swagger UI but work through a browser',
    headers: {
      Location: {
        description: 'The URL to redirect to',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Specified short link could not be found',
  })
  async findOne(@Param() { id }: getShortLinkParamDto) {
    const url = await this.shortLinkService.getOriginalUrl(id);
    return { url };
  }
}
