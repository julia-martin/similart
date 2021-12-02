import csv
import os
import time
from pathlib import Path
from urllib import error

import h5py
from skimage import io, transform

IMG_URL = 'https://www.artic.edu/iiif/2/{}/full/843,/0/default.jpg'


class ImageIngestor:
    def __init__(self, path='hdf5/', num_imgs=3000, num_pixels=300):
        self.path = Path(path)
        self.num_imgs = num_imgs
        self.num_pixels = num_pixels
        self.hdf_file = None
        self.dataset = None
        self.idset = None

    def ingest(self):

        self.make_directory()
        self.create_database()
        self.ingest_data()
        self.close_conn()

    def make_directory(self):

        self.path.mkdir(parents=True, exist_ok=True)

    def create_database(self):

        int_type = h5py.h5t.STD_U8BE

        self.hdf_file = h5py.File(self.path / 'artworks.h5', 'w')

        self.dataset = self.hdf_file.create_dataset(
            'images', (self.num_imgs, self.num_pixels, self.num_pixels, 3),
            int_type)
        self.idset = self.hdf_file.create_dataset('ids', (self.num_imgs, 1),
                                                  int_type)

    def ingest_data(self):

        dirname = os.path.dirname(__file__)
        art_data = os.path.join(dirname, 'csv', 'art-data.csv')

        with open(art_data, 'w+', newline='', encoding='utf-8') as csvfile:
            filereader = csv.reader(csvfile, delimiter=',')

            for idx, row in enumerate(filereader):
                if idx == self.num_imgs:
                    break
                i_id, url_id = row[:2]
                try:
                    image_array = self._get_img(url_id)
                    print('Success: {}'.format(idx))
                except (ValueError, TimeoutError, error.URLError):
                    print('Unable to get img for {}, skipping'.format(url_id))
                    continue
                except error.HTTPError:
                    print('Encountered HTTP Error, continuing in 5 seconds')
                    time.sleep(5)
                    continue

                resized_array = transform.resize(
                    image_array, [self.num_pixels, self.num_pixels, 3],
                    preserve_range=True).astype('uint8')

                self.dataset[idx] = resized_array
                self.idset[idx] = int(i_id)
                time.sleep(1)

    def close_conn(self):

        self.hdf_file.close()

    def _get_img(self, url_id):

        img_url = IMG_URL.format(url_id)
        image = io.imread(img_url)

        return image


if __name__ == '__main__':

    dirname = os.path.dirname(__file__)
    db_path = os.path.join(dirname, 'hdf5')

    ingestor = ImageIngestor(path=db_path)
    ingestor.ingest()
