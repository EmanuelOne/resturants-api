import { JwtService } from '@nestjs/jwt';
import { S3 } from 'aws-sdk';
import { Location } from 'src/resturants/Schemas/resturants.schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeGeoCoder = require('node-geocoder');
export default class ApiFeatures {
  static async setRestaurantLocation(address: string) {
    try {
      // console.log(process.env.MAP_QUEST_API_KEY);
      const geocoder = nodeGeoCoder({
        provider: 'mapquest',
        httpAdapter: 'https',
        apiKey: process.env.MAP_QUEST_API_KEY,
        formatter: null,
      });
      const loc = await geocoder.geocode(address);
      const location: Location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipCode: loc[0].zipcode,
        country: loc[0].countryCode,
      };
      //   console.log(location);
      return location;
    } catch (err) {
      console.log(err);
    }
  }
  static async uploadFiles(files: any[]) {
    return new Promise((resolve, reject) => {
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const images = [];
      files.forEach(async (file) => {
        const splitFile = file.originalname.split('.');
        const reandom = new Date().getTime();

        const fileName = `${file.originalname.split('.')[0]}_${reandom}.${
          splitFile[splitFile.length - 1]
        }`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME + '/restaurants',
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        const uploadResponse = await s3.upload(params).promise();
        images.push(uploadResponse);
        if (images.length === files.length) {
          resolve(images);
        }
      });
    });
  }
  static async deleteFiles(files: any[]): Promise<boolean> {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const imagesKeys = files.map((file) => ({ Key: file.key }));
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: {
        Objects: imagesKeys,
        Quiet: false,
      },
    };
    return new Promise((resolve, reject) => {
      s3.deleteObjects(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
          reject(false);
        } else {
          console.log('Successfully deleted objects');
          resolve(true);
        }
      });
    });
  }
  static async assignJwtToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { id: userId };
    console.log(payload);
    const token = jwtService.sign({
      id: userId,
    });
    return token;
  }
}
