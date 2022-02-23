import mongoose from 'mongoose';

export const isValidMongoId = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return true;
  }
  return false;
};
