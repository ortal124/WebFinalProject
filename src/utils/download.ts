import fs from 'fs';
import path from 'path';
import { IPost } from '../interfaces/IPost'
import { IUser } from '../interfaces/IUser';


interface ProcessedPost extends IPost {
  file: string | null;
}


export const processPostsWithImages = async (posts: IPost[]): Promise<ProcessedPost[]> => {
  return await Promise.all(
    posts.map(async (post): Promise<ProcessedPost> => {
      let imageData: string | null = null;

      if (post.image) {
        imageData = download(post.image);
      }

      return {
        ...post,
        file: imageData
      };
    })
  );
};


interface ProcessedUser extends IUser {
  file: string | null;
}


export const processUserWithImages = async (user: IUser): Promise<ProcessedUser> => {
  let imageData: string | null = null;
  if (user.profileImage) {
    imageData = download(user.profileImage);
  }

  return {
    ...user,
    file: imageData
  };
};

const download =  (url: string): string | null => {
  const imagePath = path.join(__dirname, '../../uploads', path.basename(url));
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageData = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    return imageData;
  } catch (err) {
    console.error(`Error reading image: ${err}`);
    return null;
  }
}
