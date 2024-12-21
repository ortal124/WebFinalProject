import fs from 'fs';
import path from 'path';
import { IPost } from '../interfaces/IPost'


interface ProcessedPost extends IPost {
  file: string | null;
}


export const processPostsWithImages = async (posts: IPost[]): Promise<ProcessedPost[]> => {
  return await Promise.all(
    posts.map(async (post): Promise<ProcessedPost> => {
      let imageData: string | null = null;

      if (post.image) {
        const imagePath = path.join(__dirname, '../../uploads', path.basename(post.image));
        try {
          const imageBuffer = fs.readFileSync(imagePath);
          imageData = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
        } catch (err) {
          console.error(`Error reading image: ${err}`);
        }
      }

      return {
        ...post,
        file: imageData
      };
    })
  );
};
