# SIMILART

## DESCRIPTION

Similart is an innovative art recommendation app that displays a force-directed graph of recommended artworks to the user, given information provided by the user
in one of three ways:

1. An image uploaded by the user
2. An image selected from the sample artworks shown
3. A quiz on descriptive preferences

The project is built as a packaged Flask (Python) application with D3.js for part of the frontend. We use a command
line interface to handle data ingestion, model training and launching the web app locally.

## INSTALLATION

We were planning to deploy the app to Heroku, but due to space and time constraints we were not able to. To run Similart on your machine, follow the steps below.

Similart is built for Python 3.9.0, compatibility with other versions is not guaranteed.

Similart is packaged according to PEP-518 guidelines and is available to be installed via pip from GitHub:

pip install git+https://github.com/samuelhallam/similart.git

To initialize, run 'similart run' after install from your terminal/command prompt of choice, this will ingest data and train the model if needed. Ingestion will take
roughly one hour, training will take approximiately five minutes.

To re-ingest and re-train the model you can also run 'similart refresh' which will replace the model and data files
regardless of whether they had been previously created.

## EXECUTION

Once launched, the app will be running by default on port 5000. Navigate to http://127.0.0.1:5000 in your browser of
choice and the application is ready to be used. Input images can be entered in any of the three ways listed
in the description section. A recommendation graph will be shown shortly after submission.

# How we built it
## Dataset
We used a public dataset from the Art Institute of Chicago, as it is diverse and free, enabling us to more easily provide a free service to users.  We selected a subset of 3000 paintings (810 MB) from the dataset.  This subset maintains sufficient diversity and sample size, while still being manageable.
## Algorithms
Our project necessitates a combination of two separate algorithms, due to the multiple options we provide to the user.  We felt the below combination will enable us to improve upon the state of the art, due to its simplicity, flexibility, and effectiveness.

- **Option A**: The user opts to upload a photo or select from a list of photos. In this case, we use Principal Component Analysis (a dimensionality reduction technique) and K-Nearest Neighbors (a classification algorithm). This model is trained merely on the image data.

- **Option B**: The user opts to instead select topics/concepts that interest them.  In this case, we use a text-based model based on the image metadata, rather than the image itself.

**For Option A**:
The PCA algorithm comprises the following steps:
1. Utilize the function skimage.transform.resize() to resize the image to 300px x 300px.  This makes all images of comparable size without cropping and losing information.
2. “Unfold” each image into a 3002-dimensional column vector.
3. Arrange all column vectors into one big matrix – one column per image.
4. Subtract the mean of all vectors from each column vector.  The mean can be thought of as the “average” of all artworks.
5. Compute the covariance matrix, and find eigenvalues (λ) and eigenvectors (v).
6. Select the first m eigenvectors with the highest eigenvalues – the eigenvectors that span the most variance in the matrix.  These are the principal components.  Initially we selected m = 2 for ease of interpretability (see 2-dimensional plot in Figure 1 below).  However, our final algorithm used m = 283.  Refer to section 4.0 for details on this decision.
7. Project each image to the space of eigenvectors, i.e., represent the original picture as a linear combination of the principal components (eigenvectors).  Essentially a dot product between the original image and each eigenvector:

Note:  Initially, we tried both PCA and ISOMAP (non-linear dimensionality reduction), but ISOMAP had a longer delay in runtime and did not seem to produce as relevant of recommendations as PCA.

Whether the user uploads a photo of artwork of their own choosing or whether they choose to select an image from the curated set, we resize the image and run it through the PCA algorithm, then return its 8 nearest neighbors, and for each of those neighbors, return their 4 nearest neighbors.  “Nearest” is determined by the Euclidean distance between the vectors.

**For Option B**:
As it is a text-based model, this option required a significant amount of manual data cleaning.  The metadata available in the dataset for each image includes several fields.  The “subject_titles” field was determined to be most relevant as it contains the text which is the most descriptive of the content of the artwork.  Each image has an associated comma-separated list of tags.  There were a total of over 700 unique values in all.  We further grouped these down into a manageable 13 attributes: nature, animals, people, still life, religion, abstract, architecture/structures, fashion, entertainment, death/war/violence, mythology/monsters, food, and urban life.

The user is prompted to select from the 13 attributes.  They may select one or multiple attributes that interest them.  We then essentially filter the artwork dataset down to only those that contain at least one of the attributes the user selected.  We then return ~20 images, randomly selected from this filtered list.

Initially, we considered returning the 20 “most relevant” pieces of art from the dataset, where “relevant” in this case was defined as and ranked by the number of checkbox attributes that an individual image satisfied.  I.e., an image that satisfied all of a user’s selected checkboxes would be considered more relevant than an image that satisfied only one checkbox.  However, we discussed that just because a user enjoys certain subjects in art does not mean that the user will necessarily want to see them all together at the same time in the same piece of art.  We also felt it might artificially limit the results and therefore the artwork exposure we could give to users.  Thus, we opted to simply show ~20 randomly selected images from the dataset that satisfy at least one of the checkbox attributes selected by the user.
