'''

testing the built-in face recognition algorithms of OpenCV
with the Yale face data set:
http://vision.ucsd.edu/content/yale-face-database

'''


import os

import numpy
import cv2
import imutils

# the Haar cascade to find faces
FaceDetect = cv2.CascadeClassifier('../../anaconda/share/OpenCV/haarcascades/haarcascade_frontalface_default.xml')

# Parameters for detectMultiScale
scaleFactor = 1.1 # specifies how much the image size is reduced at each image scale
minNeighbors = 5 # specifies how many neighbors each candidate rectangle should have to retain it.
flags = 0 # wtf?
minSize = (30,30) # min object size, smaller ones are ignored
maxSize = (200, 400) # max object size, larger ones are ignored

# parameters for the eigen face recognizer
num_components = 80 # number of eigenfaces kept
threshold = 100000.0 #wtf?

# the eigenface recognizer
recog_eigen = cv2.face.createEigenFaceRecognizer(num_components, threshold)

# parameters for the Fisher face recognizer
num_components = 0 # number of Fisherfaces kept
threshold = 10000.0 #wtf?

# the Fisherface recognizer
recog_fish = cv2.face.createFisherFaceRecognizer(num_components, threshold)

# parameters for the LBPH face recognizer
radius = 1
neighbors = 8
grid_x = 8
grid_y = 8
threshold = 1000.0 #wtf?

# the face recognizer
recog_LBPH = cv2.face.createLBPHFaceRecognizer(radius, neighbors, grid_x, grid_y, threshold)

def getImages():
    # load all images and their labels
    paths = [os.path.join('yalefaces',i) for i in os.listdir('yalefaces')
             if (not i.endswith('centerlight.jpeg') and i.endswith('.jpeg'))]
    # array of images
    pics = []
    # array of labels
    labels = []
    for p in paths:
        # read image
        img = cv2.imread(p, cv2.IMREAD_GRAYSCALE)
        # extract the label of the image
        l = int(os.path.split(p)[1].split('.')[0].replace('subject',''))
        # detect the face
        face = FaceDetect.detectMultiScale(img, scaleFactor, minNeighbors, flags, minSize, maxSize)
        # extract the face from the image
        for (x, y, w, h) in face:
            img2 = img[y: y + h, x: x + w]
            img2 = imutils.resize(img2, width=140)
            pics.append(numpy.array(img2, 'uint8'))
            labels.append(l)
    return pics, labels


def testImages(model):
    # load images and labels to be tested
    paths = [os.path.join('yalefaces',i) for i in os.listdir('yalefaces')
             if i.endswith('centerlight.jpeg')]
    for p in paths:
        # read image
        img = cv2.imread(p, cv2.IMREAD_GRAYSCALE)
        # extract the label of the image
        l = int(os.path.split(p)[1].split('.')[0].replace('subject',''))
        # detect the face
        face = FaceDetect.detectMultiScale(img, scaleFactor, minNeighbors, flags, minSize, maxSize)
        # extract the face from the image
        for (x, y, w, h) in face:
            img2 = img[y: y + h, x: x + w]
            img2 = imutils.resize(img2, width=140)
            l_predicted, conf = model.predict(img2)
            if l == l_predicted:
                print(l, ' recognized with confidence ', conf)
            else:
                print(l, ' wrongly recognized as ', l_predicted)



print('Get images and labels...')
pics, labels = getImages()

print('train the eigenface recognizer...')
recog_eigen.train(pics, numpy.array(labels))

print('test the eigenface recognizer:')
testImages(recog_eigen)

print('train the Fisherface recognizer...')
recog_fish.train(pics, numpy.array(labels))

print('test the Fisherface recognizer:')
testImages(recog_fish)

print('train the LBPH recognizer...')
recog_LBPH.train(pics, numpy.array(labels))

print('test the LBPH recognizer:')
testImages(recog_LBPH)


cv2.destroyAllWindows()