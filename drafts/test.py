import cv2

# lese Bild von Festplatte
image = cv2.imread("test.png")

# lese Farbwerte an Position y, x
y = 100
x = 50
(b, g, r) = image[y, x]
print(b,g,r)

# setze Farbwerte auf Rot (im BGR Farbraum)
image[y, x] = (0, 0, 255)

# waehle ein Region auf Interest an Punkt, y,x mit Dimension 50x50 Pixel
region_of_interest = image[y:y+50, x:x+50]

# zeige Bild in Fenster an
cv2.imshow("Bild", image)

# zeige Region of Interest an
cv2.imshow("ROI", region_of_interest)

# setze ROI auf gruen
region_of_interest[:, :] = (0, 255, 0)

# die ROI ist ein "Zeiger" auf das Ursprungsbild! Es enthaelt nun eine gruene Box
cv2.imshow("Bild modifiziert", image)

# warte auf Tastendruck (wichtig, sonst sieht man das Fenster nicht)
cv2.waitKey(0)
