# Einführung in Computer Vision mit OpenCV und Python

Computer Vision ist eine spannende Disziplin in der Informatik. Die Forschung beschäftigt sich bereits seit Jahrzenten mit dem Thema, aber erst durch aktuelle Fortschritte im Bereich Big Data und künstlicher Intelligenz ergeben sich beeindruckende neue Möglichkeiten. Mittels Cloud Technologien sowie neuen GPUs wird die Verarbeitung immer billiger und schneller. "Pay-as-you-go Modelle" ermöglichen einen risikolosen Einstieg - ohne große vorab Investitionen. Kleine Embedded Systeme (z.B. nvidia Jetson) ermöglichen innovative, mobile und smarte Geräte mit hoher Rechenleistung bei geringem Stromverbrauch. 
 
Vor vielen Millionen Jahren, kam es in der Evolution zur kambrischen Explosion. Dabei ist einem "relativ kurzem" Zeitraum die Artenvielfalt auf der Erde "explodiert". Einige Forscher sind der Meinung, dass eine Ursache dafür die Entwicklung des Sehens war und dass wir heute im Bereich Computer Vision auf einem ähnlichen Weg sind [1]. Allerdings entwickeln sich die Fähigkeiten von Computern deutlich schneller, als in der Evolution der Fall war. 

> Autos, Roboter und Drohnen beginnen zu verstehen, was in Bildern und Videos zu sehen ist. Die Schnittstelle "Computer Vision" zwischen Mensch und Maschine wird in den nächsten Jahren wahrscheinlich stark an Bedeutung gewinnen. 

Dieser Artikel ist der erste in einer Serie und soll Interessierten einen einfachen Einstieg in das Thema Computer Vision ermöglichen. Am Beispiel einer interaktiven Drohne wird erklärt, wie man Objekte und Personen in einem Video erkennen kann ... hier die Demo aus unserem Projekt http://cvdrone.de

[![dlib correlation tracking](http://img.youtube.com/vi/zCdacGMnlO0/0.jpg)](https://youtu.be/zCdacGMnlO0 "dlib correlation tracking")

# OpenCV, Python und verfügbare Frameworks - Getting Started

Es existieren diverse Frameworks für Computer Vision. Das wohl populärste ist OpenCV (http://www.opencv.org) und ebenfalls empfehlenswert ist dlib (http://dlib.net). 

> " ... OpenCV is released under a BSD license and hence it’s free for both academic and commercial use. It has C++, C, Python and Java interfaces and supports Windows, Linux, Mac OS, iOS and Android. OpenCV was designed for computational efficiency and with a strong focus on real-time applications. Written in optimized C/C++, the library can take advantage of multi-core processing. Enabled with OpenCL, it can take advantage of the hardware acceleration of the underlying heterogeneous compute platform. ..." - http://www.opencv.org
 
Je nach Vorliebe/Vorwissen kann man damit auf unterschiedlichsten Plattformen entwickeln. Für einen leichten Einstieg empfehle ich eine Entwicklungs-Umgebung auf Ubuntu 16.04 mit Python 3.x und OpenCV 3.x aufzubauen. Auf meinem Macbook verwende ich dafür eine virtuelle Maschine auf Basis vmware Workstation (hier funktioniert die Integration von von externer Hardware im Vergleich zu anderen Virtualisierungs-Lösungen meist stabiler). Die Komponenten lassen sich auch auf anderen Betriebssystemen zum Laufen bringen - hier ist evtl. aber etwas "Versions-Konflikt-und-Dependency-Gefummel" notwendig.

dlib ist zwar bei weitem nicht so umfangreich wie OpenCV - aber manche Funktionen sind einfach gut. Beispielsweise die "Facial Landmark Detection" (siehe: http://cvdrone.de/dlib-facial-landmark-detection.html) oder der Correlation Tracker ... siehe:

[![dlib correlation tracking](http://img.youtube.com/vi/sUv0HjpVgd8/0.jpg)](https://youtu.be/sUv0HjpVgd8?t=35s "dlib correlation tracking")

## GPU oder CPU ?

Einige Algorithmen basieren auf CUDA zur Nutzung der GPU. Dafür benötigt man eine Grafikkarte von nvidia. Hat man diese nicht, kann man auf AWS eine GPU Instanz mieten oder man besorgt sich ein Entwickler Board (z.B. nvidia Jetson TK1). Für einen ersten Einstieg ist das nicht unbedingt notwendig - aufwändigere Algorithmen (Neuronale Netze, Deep Learning etc.) laufen mit Hardware Beschleunigung aber oft um Größenordnungen schneller. In diesem Bereich fährt man übrigens nicht unbedingt gut, wenn man auf latest-greatest Versionen setzt. Evtl. ist ein älteres Ubuntu und ein nicht ganz aktueller Linux Kernel nötig, um alle Treiber und Abhängigkeiten kompilieren zu können. Im AWS Marketplace findet man GPU Instanzen, bei denen bereits OpenCV, Python, CUDA etc. lauffähig vorinstalliert sind (basierend auf Ubuntu 14.04).

## Installation von OpenCV mit Python Wrappern

Es gibt im Internet viele Anleitungen, wie man OpenCV installieren kann - ich werde daher nicht das Rad neu erfinden, sondern verweise auf den lesenswerten Blog von Adrian Rosebrock. Also zunächst eine Ubuntu vm aufsetzen und dann folgenden Artikel Schritt für Schritt nachvollziehen: http://www.pyimagesearch.com/2016/10/24/ubuntu-16-04-how-to-install-opencv/ 

# Computer Vision Basics

## Bilder sind multidimensionale Arrays

## Farbräume

## gebräuchliche Algorithmen

## Detektoren





## References

[1] - Fei-Fei Li - Professor at Stanford University. https://youtu.be/qLCKtc9moks