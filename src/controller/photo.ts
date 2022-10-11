import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Put, Query, Validate } from "@midwayjs/decorator";
import { Context } from "egg";
import { PhotoDTO } from "../dto/photoDto";
import { Photo } from "../modelEntity/photo";
import { PhotoService } from "../service/photoService";


@Provide()
@Controller('/api/photo')
export class PhotoAPIController {
  @Inject()
  ctx: Context;

  @Inject()
  photoService: PhotoService;

  @Get('/:photoId')
  async getPhoto(@Param() photoId: number) {

    const photo = await this.photoService.getPhoto(photoId)
    console.log("🚀 ~ file: photo.ts ~ line 20 ~ PhotoAPIController ~ getPhoto ~ photo", photo)

    return photo;
  }

  @Post('/createPhoto')
  @Validate()
  async createPhoto(@Body(ALL) photo: PhotoDTO) {
    console.log("🚀 ~ file: photo.ts ~ line 23 ~ APIController4 ~ createPhoto ~ photo", photo)

    const pid = await this.photoService.savePhoto(photo)
    return { code: 0, message: 'OK', data: {id: pid} };
  }

  @Put('/update')
  async updatePhoto(@Body(ALL) photo: Photo) {

    const updatedObj = await this.photoService.updatePhoto(photo)

    console.log("🚀 ~ file: photo.ts ~ line 39 ~ PhotoAPIController ~ updatePhoto ~ updatedObj", updatedObj)
    return updatedObj;
  }

  @Del('/:id1')
  // async deletePhoto(@Param() id: number, @Query() queryData) {
  async deletePhoto(@Param() id1: number, @Query('id') id2: number) {
  console.log("🚀 ~ file: photo.ts ~ line 47 ~ PhotoAPIController ~ deletePhoto ~ id2", id2)
  console.log("🚀 ~ file: photo.ts ~ line 47 ~ PhotoAPIController ~ deletePhoto ~ id1", id1)

    if (id1 !== id2) {
      return
    }

    const deletedObj = await this.photoService.deletePhoto(id1)
    console.log("🚀 ~ file: photo.ts ~ line 55 ~ PhotoAPIController ~ deletePhoto ~ deletedObj", deletedObj)

    return deletedObj;
  }

}
