# Einführung in Computer Vision mit OpenCV und Python

Computer Vision ist eine spannende Disziplin in der Informatik. Die Forschung beschäftigt sich bereits seit Jahrzenten mit dem Thema, aber erst durch aktuelle Fortschritte im Bereich Big Data und künstlicher Intelligenz ergeben sich beeindruckende neue Möglichkeiten. Mittels Cloud Technologien sowie neuen GPUs wird die Verarbeitung immer billiger und schneller. "Pay-as-you-go Modelle" erlauben einen "risikolosen" Einstieg - ohne große vorab Investitionen. Kleine Embedded Systeme (z.B. nvidia Jetson) ermöglichen innovative, mobile und smarte Geräte mit hoher Rechenleistung bei geringem Stromverbrauch. 
 
Vor vielen Millionen Jahren, kam es in der Evolution zur kambrischen Explosion. Dabei ist einem "relativ kurzem" Zeitraum die Artenvielfalt auf der Erde "explodiert". Einige Forscher sind der Meinung, dass eine Ursache dafür die Entwicklung des Sehens war und dass wir heute im Bereich Computer Vision auf einem ähnlichen Weg sind [1]. Allerdings entwickeln sich die visuellen Fähigkeiten von Computern sehr viel schneller, als es in der Evolution der Fall war. 

> Autos, Roboter und Drohnen beginnen zu verstehen, was in Bildern und Videos zu sehen ist. Die Schnittstelle "Computer Vision" zwischen Mensch und Maschine wird in den nächsten Jahren wahrscheinlich stark an Bedeutung gewinnen. 

Dieser Artikel ist der erste in einer Serie und soll Interessierten einen einfachen Einstieg in das Thema Computer Vision ermöglichen. Am Beispiel einer interaktiven Drohne versuche ich zu erklären, wie man (mit einfachen Mitteln) Objekte und Personen in einem Video erkennen kann ... hier die Demo aus unserem Projekt http://cvdrone.de

[![person objekt detection](http://img.youtube.com/vi/zCdacGMnlO0/0.jpg)](https://youtu.be/zCdacGMnlO0 "person object detection")

# OpenCV, Python und verfügbare Frameworks - Getting Started

Es existieren diverse Frameworks für Computer Vision. Das wohl populärste ist OpenCV (http://www.opencv.org) und ebenfalls empfehlenswert ist dlib (http://dlib.net). 

![computer vision frameworks](frameworks.png)

> " ... OpenCV is released under a BSD license and hence it’s free for both academic and commercial use. It has C++, C, Python and Java interfaces and supports Windows, Linux, Mac OS, iOS and Android. OpenCV was designed for computational efficiency and with a strong focus on real-time applications. Written in optimized C/C++, the library can take advantage of multi-core processing. Enabled with OpenCL, it can take advantage of the hardware acceleration of the underlying heterogeneous compute platform. ..." - http://www.opencv.org
 
Je nach Vorliebe/Vorwissen kann man damit auf unterschiedlichsten Plattformen entwickeln. Für einen leichten Einstieg empfehle ich eine Entwicklungs-Umgebung auf Ubuntu 16.04 mit Python 3.x und OpenCV 3.x aufzubauen. Auf meinem Macbook verwende ich eine virtuelle Maschine auf Basis von vmware Workstation (hier funktioniert die Integration von externer Hardware im Vergleich zu anderen Virtualisierungs-Lösungen oft stabiler). Die Komponenten lassen sich auch auf anderen Betriebssystemen zum Laufen bringen - hier ist evtl. aber fortgeschrittenes "Versions-Konflikt-und-Dependency-Gefummel" notwendig.

dlib ist zwar bei weitem nicht so umfangreich wie OpenCV - aber manche Funktionen sind einfach sehr gut. Beispielsweise die "Facial Landmark Detection" (siehe: http://cvdrone.de/dlib-facial-landmark-detection.html) oder der Correlation Tracker ... Siehe hier:

[![dlib correlation tracking](http://img.youtube.com/vi/sUv0HjpVgd8/0.jpg)](https://youtu.be/sUv0HjpVgd8?t=35s "dlib correlation tracking")

Weiterhin gibt es einen OpenVX Standard. Dieser macht sich zur Aufgabe Grafik-Hardware zu abstrahieren und diese damit besser nutzbar zu machen. Eine Implementierung davon ist nvidias VisionWork. Hier wurde viel Aufwand betrieben, um die wichtigsten CV Algorithmen speziell für die Ausführung auf GPUs zu optimieren. Wer viel Performance bei geringem Stromverbrauch sucht, sollte sich VisionWorks genauer anschauen. 

## GPU oder CPU - ist das hier die Frage?

Einige Algorithmen basieren auf CUDA zur Nutzung der GPU. Dafür benötigt man eine Grafikkarte von nvidia. Hat man diese nicht, kann man auf AWS eine GPU Instanz mieten oder man besorgt sich ein Entwickler Board (z.B. nvidia Jetson TK1). Für einen ersten Einstieg ist das nicht unbedingt notwendig - aufwändigere Algorithmen (Neuronale Netze, Deep Learning etc.) laufen mit Hardware Beschleunigung aber oft um Größenordnungen schneller. In diesem Bereich fährt man übrigens nicht unbedingt gut, wenn man auf latest-greatest Versionen setzt. Evtl. ist ein älteres Ubuntu und ein nicht ganz aktueller Linux Kernel nötig, um alle Treiber und Abhängigkeiten kompilieren zu können. Im AWS Marketplace findet man GPU Instanzen, bei denen bereits OpenCV, Python, CUDA etc. lauffähig vorinstalliert sind (basierend auf Ubuntu 14.04 - Stand Mai 2017).

## Installation von OpenCV mit Python Wrappern

Es gibt im Internet viele Anleitungen, wie man OpenCV installieren kann - ich werde daher nicht das Rad neu erfinden, sondern verweise auf den lesenswerten Blog von Adrian Rosebrock [3]. Also zunächst eine Ubuntu vm aufsetzen und dann folgenden Artikel Schritt für Schritt nachvollziehen: http://www.pyimagesearch.com/2016/10/24/ubuntu-16-04-how-to-install-opencv/ 

OpenCV ist zwar in C geschrieben, mir ist aber der Einstieg mit den Python Wrappern leichter gefallen. Je nach Vorwissen kommt man damit deutlich schneller zu funktionierenden Prototypen. Der Performance Unterschied ist dabei in vielen Fällen vernachlässigbar gering. 

# Computer Vision Basics

Der Fortschritt im Bereich Computer Vision passiert zwar vor allem mit Hilfe von Neuronalen Netzen und Deep Learning, für einen Einstieg in das Thema sollte man sich vielleicht aber zunächst mit den Basics beschäftigen.

Hier ein Video mit einer kurzen Darstellung der Basics, sowie Codebeispielen, wie wir den simplen Objekt-Detektor im Drohnen Video realisiert haben:

[![opencv basics](http://img.youtube.com/vi/Q_2tbDCJTnU/0.jpg)](https://youtu.be/Q_2tbDCJTnU "OpenCV Basics")


## Bilder sind multidimensionale Arrays

Ein Bild wird im Computer als multidimensionaler Array repräsentiert. In Python ist der Datentyp "numpy" in C ist es "Mat". Die Koordinate (0, 0) ist in der linken oberen Ecke. Bei einem farbigen Bild stehen an jeder Koordinate 3 Farbwerte. Je nach Auflösung und Farbraum können die Arrays unterschiedlich groß sein. Die Farbwerte reichen jeweils von 0 bis 255. In OpenCV gibt man als erstes die Y und dann die X Koordinate an (das ist teilweise verwirrend). 

Folgender Code liest ein Bild ein und führt einige Basic Operationen auf Pixel Ebene aus:

```python
import cv2

# lese Bild von Festplatte
image = cv2.imread("test.png")

# lese Farbwerte an Position y, x
y = 100
x = 50
(b, g, r) = image[y, x]

# gib Farbwerte auf Bildschirm aus
print(b,g,r)

# setze Farbwerte auf Rot (im BGR Farbraum)
image[y, x] = (0, 0, 255)

# waehle ein Region auf Interest an Punkt: (y, x) mit Dimension 50x50 Pixel
region_of_interest = image[y:y+50, x:x+50]

# zeige Bild in Fenster an
cv2.imshow("Bild", image)

# zeige Region of Interest an
cv2.imshow("ROI", region_of_interest)

# setze ROI auf gruen
region_of_interest[:, :] = (0, 255, 0)

# die ROI ist ein "Zeiger" auf das urspruenglich geladene image. Es enthaelt nun eine gruene Box!
cv2.imshow("Bild modifiziert", image)

# warte auf Tastendruck (wichtig, sonst sieht man das Fenster nicht)
cv2.waitKey(0)
```

## Farbräume

Der default Farb Raum in OpenCV ist BGR - also Blue Green Red. Normalerweise kennt man es eher als RGB - also auch hier wieder leichte Verwirrung am Anfang. Aber dafür gibt es einen guten Grund: "War so, ist so und wird daher so bleiben!"
Je nachdem in welchem Farbraum man arbeitet, hat dies Vor- und Nachteile für die jeweilige Applikation. Beispielsweise ist ein Farbraum wie HSV leichter zu handhaben, wenn man nach bestimmten Farben filtert. Möchte ich im BGR Farbraum alles filtern, was irgendwie "orange" ist, ist das nicht so leicht zu implementieren - in HSV ist das deutlich einfacher. Auch ist dieser Farb Raum z.B. nicht so anfällig für Änderung der Helligkeit (durch Wolken/Sonne).
Konvertiert man ein Bild in Graustufen, hat es nur noch einen Farb-Kanal. Dies macht zum Beispiel Sinn, um Datenmengen und Rechenzeit zu reduzieren.

Hier wieder ein kleines Beispiel:

```python
import cv2

# initialisiere WebCam
cam = cv2.VideoCapture(0)

# lese ein Bild von der WebCam
ret, image = cam.read()

# konvertiere das Bild in Graustufen
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# zeige das Bild an
cv2.imshow("Bild modifiziert", image)

# warte auf Tastendruck (wichtig, sonst sieht man das Fenster nicht)
cv2.waitKey(0)
```

## Gängige Algorithmen / Methoden

In der Computer Vision muss man teilweise etwas um die Ecke denken, um komplexere Funktionen zu implementieren. Der Computer versteht ja erstmal nicht wirklich was in einem Bild zu sehen ist, sondern er sieht nur Zahlen, die Farbwerte repräsentieren. Ich möchte hier einige Methoden hervorheben, die zum Grundwerkzeug des Computer Visionärs gehören ...

### Thresholding

Thresholding wird häufig verwendet, um Bereiche eines Bildes, die bestimmte (Farb-)Eigenschaften haben, zu filtern. Es gibt verschiedene Thresholding Methoden - eine davon ist "Binary Thresholding". Dabei definiert man einen Schwellwert und man erhält als Output ein Schwarz/Weiß Bild. Pixel, die den den Schwellwert überschreiten sind Weiß - alle anderen Pixel sind Schwarz. Damit kann man dann zum Beispiel alle Pixel im Bild "suchen", die Orange sind (so wie der Marker in unserem Demo Video).

Diese Thresholding Masken sind dann oft Grundlage für weitere Analysen. 


[![opencv basics thresholding](http://img.youtube.com/vi/6OozI19C7pQ/0.jpg)](https://youtu.be/6OozI19C7pQ "OpenCV Basics Thresholding")

Hier der Code zu dem Video:

```python

## ermittle Farbwerte eines Tennisballs

import cv2


# initialisiere Webcam
cam = cv2.VideoCapture(0)

# define region of interest
x, y, w, h = 400, 400, 100, 100

# zeige stream von WebCam an
while cam.isOpened():
    # lese frame von WebCam
    ret, frame = cam.read()

    # konvertiere frame in HSV Farbraum, um besser nach Farb Ranges filtern zu können
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # zeichne rechteck in bild
    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 255, 255), thickness=1)

    # gebe Hue Wert an der linken oberen ecke der ROI aus, um Farbwerte des Tennis balls zu ermitteln:
    cv2.putText(frame, "HSV: {0}".format(frame[y+1, x+1]), (x, 600),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), thickness=2)

    # zeige Frame an
    cv2.imshow("frame", frame)

    # warte auf Tastendruck (sonst sieht man das fenster nicht)
    key = cv2.waitKey(1) & 0xff

    # wenn ESC gedrückt beende programm
    if key == 27:
        break

```

Mit den Farbwerten filtern wir nach Range:

```python
import cv2


# initialisiere Webcam
cam = cv2.VideoCapture(0)

# definiere farb ranges
lower_yellow = (18, 100, 210)
upper_yellow = (40, 160, 245)

# zeige stream von WebCam an
while cam.isOpened():
    # lese frame von WebCam
    ret, frame = cam.read()

    # konvertiere frame in HSV Farbraum, um besser nach Farb Ranges filtern zu können
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # filtere bild nach farb grenzen
    mask = cv2.inRange(frame, lower_yellow, upper_yellow)

    # zeige Frame an
    cv2.imshow("threshold", mask)

    # warte auf Tastendruck (sonst sieht man das fenster nicht)
    key = cv2.waitKey(1) & 0xff

    # wenn ESC gedrückt beende programm
    if key == 27:
        break

```

### Konturen finden

Für Schwarz/Weiß Bilder existieren effiziente Algorithmen, um darin Konturen zu finden. Diese erkennen zusammenhängende Pixel und gruppieren diese zu Blobs. Zusätzlich kann man diverse Eigenschaften dieser Konturen für weitere Analysen verwenden - zum Beispiel die Fläche oder die Kantenlänge der Kontur und man kann sich eine Bounding Box zurückgeben lassen. In unserem Demo Video verwenden wir dies, um die Position des orangenen Markers zu finden - dabei suchen wir nur Konturen heraus, die eine gewisse Mindestfläche haben (so können wir einzelne "noisy" Pixel herausfiltern, die im Orange Bereich liegen). 

Hier versuchen wir jetzt den Tennis Ball im Bild zu finden und filtern die noisy Pixel heraus:

[![opencv basics contours](http://img.youtube.com/vi/Wp7qylBXXv4/0.jpg)](https://youtu.be/Wp7qylBXXv4 "OpenCV Basics Konturen")

```python
import cv2

# initialisiere Webcam
cam = cv2.VideoCapture(0)

# definiere farb ranges
lower_yellow = (18, 100, 210)
upper_yellow = (40, 160, 245)

# zeige stream von WebCam an
while cam.isOpened():
    # lese frame von WebCam
    ret, frame = cam.read()

    # konvertiere frame in HSV Farbraum, um besser nach Farb Ranges filtern zu können
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # filtere bild nach farb grenzen
    mask = cv2.inRange(frame, lower_yellow, upper_yellow)

    # finde Konturen in der Maske, die nur noch zeigt, wo gelbe Pixel sind:
    _, contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                      cv2.CHAIN_APPROX_SIMPLE)

    # suche die größte contour heraus (diese ist höchst wahrscheinlich der Tennis Ball)
    # dazu nehmen wir die Fläche der Kontur:
    if len(contours) > 0:
        tennis_ball = max(contours, key=cv2.contourArea)

        # zeichne die Bounding box des tennis balls in das Video Bild ein:
        x, y, w, h = cv2.boundingRect(tennis_ball)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), thickness=3)

    # zeige Frame an
    cv2.imshow("frame", frame)

    # warte auf Tastendruck (sonst sieht man das fenster nicht)
    key = cv2.waitKey(1) & 0xff

    # wenn ESC gedrückt beende programm
    if key == 27:
        break
```

### Background Subtraction

Wenn man eine statische Kamera hat, gibt es diverse (relativ einfache) Methoden, um Bewegung in einem Bild zu erkennen. Man geht dann davon aus, dass das was sich nicht bewegt der Hintergrund ist. Einfach gesagt subtrahiert man die Pixel-Farb-Werte vom aktuellen Frame mit denen vom vorher gehenden Frame. Dort, wo sich nichts verändert hat, ergibt dies 0 - also keine Bewegung. Dieses Modell ist aber für die Praxis meist zu simpel, denn durch leichte Veränderungen der Lichtverhältnisse oder Umwelteinflüsse wie z.B. Wind erhält man zu viel "Noise". Über die letzten Jahrzehnte wurde eine Vielzahl von Algorithmen entwickelt, die alle ihre Vor- und Nachteile haben. Einen "One-Fits-All" Algorithmus, der in allen Situationen 100% funktioniert, gibt es nicht. Ein gute Übersicht über bekannte Verfahren gibt es hier: https://github.com/andrewssobral/bgslibrary/wiki/List-of-available-algorithms

Ein häufig genutzer Algorithmus setzt auf ein Gaussian Mixture Model (GMM) oder MoG2, wie es in OpenCV genannt wird. Neuere Algorithmen sind zum Beispiel SubSENSE [2]

Hier ein kurzes Beispiel Video:

[![opencv basics background subtraction](http://img.youtube.com/vi/fPc_N1I-Wq4/0.jpg)](https://youtu.be/fPc_N1I-Wq4 "OpenCV Basics Background Subraction")


### Detektoren

Bei OpenCV oder dlib sind bereits diverse "standard" Detektoren integriert. Ein Programm, das in einem Webcam Stream Gesichter finden soll, ist in ein paar Zeilen Python schnell zusammengehackt. Taugen solche Programme auch für praktische Einsatzzwecke?! Wohl eher nicht. Die standard Detektoren haben hohe Fehlerraten (viele False Positives und False Negatives). "Klassisch", benutzt man vor allem folgende Methoden, um Gesichter in einem Bild zu finden ...

Haar Cascade Classifier:

Sie gehen zurück auf ein Paper von Viola und Jones aus dem Jahr 2000. Der Algorithmus ist relativ schnell - man kann ihn in abgespeckter Auflösung und Framerate auf einem Raspberry Pi laufen lassen. OpenCV bringt bereits einige vortrainierte Haar Cascade Classifier mit - unter anderem um Gesichter von Menschen oder Katzen zu erkennen. Allerdings erkennt dieser Classifier auch regelmäßig die Rückenlehne meines Stuhls als Gesicht.

HOG Detektoren:

HOG steht für Histogram of oriented Gradients. Dabei wird ein Bildausschnitt in ein Grid unterteilt. Für jede Box des Grids werden die dominanten Kannten ermittelt und in Zahlenwerte für die Ausrichtung der dieser Kannten umgewandelt. Auf diesen Werten wird dann ein Modell trainiert. Die benötigte Rechenleistung ist dabei deutlich höher als bei Haar Cascade Classifiern - man kann damit aber unter Umständen bessere Detektions-Ergebnisse erzielen. 

Eine vereinfachte Visualisierung eines HOG Feature Vektors kann man sich so vorstellen. Die dominanten Gradienten in jeder Box des Grids sind insgesamt eindeutig als Gesicht zu erkennen:

```
   ______
  / _  _ \
 |   /    |
 |   __   | 
  \ ____ /
```

In unserem Drohnen Demo Video verwenden wir einen Haar Cascade Classifier, der nur nach Gesichtern in der Nähe des detektierten orangenen Marker sucht. Damit können wir die Zahl der False Negatives so weit reduzieren, dass wir insgesamt ein gutes Ergebnis erzielen.


Hier der Video Ausschnitt, mit einer kurzen Erklärung zum Code:

[![opencv basics face detection](http://img.youtube.com/vi/RCyiRpQ2xME/0.jpg)](https://youtu.be/RCyiRpQ2xME "OpenCV Basics face detection")



# Ausblick Deep Learning

Zum Schluss möchte ich noch einen kleinen Ausblick auf das Thema Deep Learning geben. Viele Forscher beschäftigen sich mit dem Gebiet und man findet regelmäßig neue beeindruckende Demos und Algorithmen auf youtube. Einer davon ist YOLO [4]. Damit ist nicht das Jugendwort aus 2012 gemeint - sondern es steht für "You Only Look Once". Dahinter steckt ein Convolutional Neural Network, das in Echtzeit (auf entsprechender Hardware) verschiedenste Klassen von Objekten erkennen kann.
 
Wir haben den Algorithmus einmal ausprobiert. Dazu haben wir unsere Drohne durch unser Büro fliegen lassen. Auf AWS haben wir eine GPU Instanz gemietet und dort YOLO installiert. Wir haben dazu ein vorkonfiguriertes "TensorFlow Image" aus dem Amazon Marketplace gestartet und sind der Anleitung auf https://pjreddie.com/darknet/yolo/ gefolgt. Man kann natürlich auch selbst eine Instanz aufsetzen - aber alle Abhängigkeiten zum Laufen zu bringen ist nicht trivial. Wer es probieren möchte, hier eine Starthilfe: http://cvdrone.de/install-opencv-on-aws-with-cuda.html . An dieser Stelle haben wir auch ganz deutlich gemerkt, wieviel Unterschied eine GPU bringt - während der Algorithmus auf CPU etwa 15-20 Sekunden pro Frame rechnete, brauchte er mit GPU Unterstützung gerade noch 6 ms für die gleiche Arbeit.

Das Ergebnis unseres Drohnen Fluges kann man hier sehen:

[![opencv basics deeplearning](http://img.youtube.com/vi/su3pHwPyrVY/0.jpg)](https://youtu.be/su3pHwPyrVY "OpenCV Basics deeplearning")

Weitere interessante Beispiele sind "Convolutional Pose Machines": https://www.youtube.com/watch?v=pW6nZXeWlGM
oder "Style Transfer": https://www.youtube.com/watch?v=Khuj4ASldmU (... und noch viele mehr ...)

Wer sich tiefer in das Thema einarbeiten möchte, dem empfehle ich das Buch "Deep Learning" von Ian Goodfellow et al. Laut dem Buch verdoppeln sich Artificial Neural Networks alle 2,4 Jahre und 2015 lag die Anzahl der Neuronen der größten Netzwerke wie GoogLeNet zwischen dem Gehirn einer Biene und dem eines Froschs. Dennoch waren einige spezialisierte ANNs dem Menschen in ganz bestimmten Aufgaben bereits überlegen. Geht die Entwicklung so weiter, erwartet man, dass die größten neuronalen Netzwerke um 2056 in der Größenordnung des menschlichen Gehirns liegen werden. 


Ich hoffe, dass ich mit diesem Artikel etwas Interesse für Computer Vision wecken konnte. Ich freue mich über Shares und Feedback (gerne über: https://twitter.com/moseroli). Unter http://cvdrone.de findet man mehr Infos und Videos zu unserem Drohnen Projekt.



## References

* [1] - Fei-Fei Li - Professor at Stanford University. https://youtu.be/qLCKtc9moks
* [2] - SuBSENSE - https://www.ncbi.nlm.nih.gov/pubmed/25494507
* [3] - http://pyimagesearch.com
* [4] - YOLO - https://pjreddie.com/darknet/yolo/