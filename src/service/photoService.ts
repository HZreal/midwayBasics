import { Provide } from '@midwayjs/decorator';
import { Repository } from 'typeorm';
import { Photo } from './../modelEntity/photo';
import { InjectEntityModel } from '@midwayjs/orm';


@Provide()
export class PhotoService {
  @InjectEntityModel(Photo, 'default')
  photoModel: Repository<Photo>;

  // save
  async savePhoto(photo: Photo): Promise<number> {

    // save model entity
    const savedPhoto = await this.photoModel.save(photo);

    // save success
    console.log('photo id = ', savedPhoto.id);
    return savedPhoto.id
  }

  // find
  async getPhoto(pid: number) {
    let photo = await this.photoModel.findOne({ where: { id: pid } });
    console.log("🚀 ~ file: photoService.ts ~ line 25 ~ PhotoService ~ findPhoto ~ photo", photo)
    return photo
  }

  async findPhotos() {
    // find All
    let allPhotos = await this.photoModel.find();
    console.log('All photos from the db: ', allPhotos);


    // find one by name
    let meAndBearsPhoto = await this.photoModel.findOne({
      where: { name: 'Me and Bears' },
    });
    console.log('Me and Bears photo from the db: ', meAndBearsPhoto);

    // find by views
    let allViewedPhotos = await this.photoModel.find({ where: { views: 1 } });
    console.log('All viewed photos: ', allViewedPhotos);

    let allPublishedPhotos = await this.photoModel.find({
      where: { isPublished: true },
    });
    console.log('All published photos: ', allPublishedPhotos);

    // find and get count
    let [allPhotos2, photosCount] = await this.photoModel.findAndCount();
    console.log('All photos: ', allPhotos2);
    console.log('Photos count: ', photosCount);
  }

  // update
  async updatePhoto(obj: Photo) {
    let photo = await this.photoModel.findOne({where: { id: obj.id }});

    photo.name = obj.name;
    photo.description = obj.description;
    photo.filename = obj.filename;
    photo.views = obj.views;
    photo.isPublished = obj.isPublished;
    const updatedObj = await this.photoModel.save(photo);
    return updatedObj

  }

  // delete
  async deletePhoto(pid: number) {
    let toRemoveObj = await this.photoModel.findOne({where: {id: pid}});
    const deletedRes = await this.photoModel.remove(toRemoveObj);
    console.log("🚀 ~ file: photoService.ts ~ line 75 ~ PhotoService ~ deletePhoto ~ deletedRes", deletedRes)
    return deletedRes
    // 逻辑删除
    // await this.photoModel.softDelete(1);
  }
}


@Provide()
export class PhotoService11 {
  async createPhoto(photoObj) {
    return photoObj;
  }
}
