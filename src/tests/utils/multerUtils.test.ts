import multer from 'multer';
import { fileFilter } from '../../utils/upload';

describe('Multer File Filter', () => {
  it('should allow image files', () => {
    const req = {};
    const file = { mimetype: 'image/jpeg' };
    const cb = jest.fn();

    fileFilter(req, file, cb);

    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('should reject non-image files', () => {
    const req = {};
    const file = { mimetype: 'text/plain' };
    const cb = jest.fn();

    fileFilter(req, file, cb);

    expect(cb).toHaveBeenCalledWith(new Error('Not an image!'), false);
  });
});
