import { CategoryFixture } from "./types.fixture";

export const category1: CategoryFixture = {
  id: 1,
  name: 'category1',
  description: 'this is the first category',
  imageUrl: 'category1/image',
  publicId: 'image1'
}

export const category2: CategoryFixture = {
  id: 2,
  name: 'category2',
  description: 'this is the second category',
  imageUrl: 'category2/image',
  publicId: 'image2'
}

export const category3: CategoryFixture = {
  id: 3,
  name: 'category3',
  description: 'this is the third category',
  imageUrl: 'category3/image',
  publicId: 'image3'
}

export const categoryFixture = [category1, category2, category3];